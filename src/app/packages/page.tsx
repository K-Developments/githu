
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Package, Category, PackagesCtaData } from '@/lib/data';
import { PackagesPageClient } from './packages-client';

interface PackagesPageData {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  cta: PackagesCtaData,
  packages: Package[];
  categories: Category[];
}

async function getPackagesPageData(): Promise<PackagesPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'packages');
        const contentDocSnap = await getDoc(contentDocRef);
        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);

        let heroData: PackagesPageData['hero'];
        let ctaData: PackagesPageData['cta'];
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
                heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
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
                heroImage: 'https://placehold.co/1920x600.png',
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


export default async function PackagesPage() {
  const pageData = await getPackagesPageData();
  
  if (!pageData) {
      return <div>Error loading page data.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PackagesPageClient 
        hero={pageData.hero}
        packages={pageData.packages}
        categories={pageData.categories}
        cta={pageData.cta}
      />
    </Suspense>
  );
}
