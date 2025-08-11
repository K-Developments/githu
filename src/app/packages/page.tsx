
'use client';

import { Suspense, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import type { Package, Category, PackagesCtaData } from '@/lib/data';
import { PackagesPageClient } from './packages-client';
import { PackageDetailClient } from './[id]/package-detail-client';

interface ListPageData {
  hero: {
    headline: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  cta: PackagesCtaData,
  packages: Package[];
  categories: Category[];
}

interface DetailPageData {
  pkg: Package;
  otherPackages: Package[];
}

async function getPackagesPageData(): Promise<ListPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'packages');
        const contentDocSnap = await getDoc(contentDocRef);
        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);

        let heroData: ListPageData['hero'];
        let ctaData: ListPageData['cta'];
        let sliderImages: string[] = [];

         if (homeContentDocSnap.exists()) {
            const homeData = homeContentDocSnap.data();
             if (homeData.hero && homeData.hero.sliderImages) {
                sliderImages = homeData.hero.sliderImages;
            }
        }

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            heroData = {
                headline: data.hero?.headline || 'Our Packages',
                contentBackgroundImage: data.hero?.contentBackgroundImage || '',
                sliderImages,
            };
            ctaData = {
                title: data.cta?.title || 'Your Adventure Awaits',
                description: data.cta?.description || "Found a package that sparks your interest? Or perhaps you have a unique vision for your trip. Every journey with us can be tailored to your desires. Contact our travel experts to customize any package or build a completely new adventure from scratch.",
                image: data.cta?.image || 'https://placehold.co/800x900.png',
            };
        } else {
             heroData = {
                headline: 'Our Packages',
                contentBackgroundImage: '',
                sliderImages,
            };
            ctaData = {
                title: 'Your Adventure Awaits',
                description: "Found a package that sparks your interest? Or perhaps you have a unique vision for your trip. Every journey with us can be tailored to your desires. Contact our travel experts to customize any package or build a completely new adventure from scratch.",
                image: 'https://placehold.co/800x900.png',
            };
        }

        const categoriesSnap = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        const packagesSnap = await getDocs(collection(db, "packages"));
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));

        return {
            hero: heroData,
            cta: ctaData,
            categories: categoriesData,
            packages: packagesData
        };

    } catch (error) {
        console.error('Error fetching packages page data:', error);
        return null;
    }
}

async function getPackagePageData(id: string): Promise<DetailPageData | null> {
    try {
        const packageDocRef = doc(db, 'packages', id);
        const packageDocSnap = await getDoc(packageDocRef);
        
        if (!packageDocSnap.exists()) {
            return null;
        }
        
        const packageData = { id: packageDocSnap.id, ...packageDocSnap.data() } as Package;
        
        const otherPackagesQuery = query(
            collection(db, "packages"), 
            where('__name__', '!=', id),
            where('categoryId', '==', packageData.categoryId),
            limit(3)
        );
        const otherPackagesSnap = await getDocs(otherPackagesQuery);
        const otherPackagesData = otherPackagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        
        return {
            pkg: packageData,
            otherPackages: otherPackagesData,
        };
    } catch (error) {
        console.error('Error fetching package page data:', error);
        return null;
    }
}

export default function PackagesPage() {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [listPageData, setListPageData] = useState<ListPageData | null>(null);
    const [detailPageData, setDetailPageData] = useState<DetailPageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (view === 'list') {
            setLoading(true);
            getPackagesPageData().then(data => {
                setListPageData(data);
                setLoading(false);
            });
        } else if (view === 'detail' && selectedId) {
            setLoading(true);
            getPackagePageData(selectedId).then(data => {
                setDetailPageData(data);
                setLoading(false);
            });
        }
    }, [view, selectedId]);

    const handleSelectPackage = (id: string) => {
        setSelectedId(id);
        setView('detail');
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedId(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (view === 'detail' && detailPageData) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <PackageDetailClient 
                    pkg={detailPageData.pkg}
                    otherPackages={detailPageData.otherPackages}
                    onBack={handleBackToList}
                />
            </Suspense>
        );
    }

    if (listPageData) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <PackagesPageClient 
                    hero={listPageData.hero}
                    packages={listPageData.packages}
                    categories={listPageData.categories}
                    cta={listPageData.cta}
                    onPackageSelect={handleSelectPackage}
                />
            </Suspense>
        );
    }
  
    return <div>Error loading page data.</div>;
}
