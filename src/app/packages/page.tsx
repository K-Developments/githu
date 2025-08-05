
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { CtaData, Package, Category } from '@/lib/data';
import { PackagesPageClient } from './packages-client';

interface PackagesPageData {
  hero: {
    headline: string;
    heroImage: string;
  };
  ctaData: CtaData | null;
  packages: Package[];
  categories: Category[];
}

async function getPackagesPageData(): Promise<PackagesPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'packages');
        const contentDocSnap = await getDoc(contentDocRef);

        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);
        let ctaData: CtaData | null = null;
        if (homeContentDocSnap.exists()) {
            const homeData = homeContentDocSnap.data();
            const cta = homeData.cta as CtaData;
            if (cta && !cta.interactiveItems) {
                cta.interactiveItems = [];
            }
            ctaData = cta;
        }

        let pageData: PackagesPageData['hero'];
        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            pageData = {
                headline: data.hero?.headline || 'Our Packages',
                heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
            };
        } else {
             pageData = {
                headline: 'Our Packages',
                heroImage: 'https://placehold.co/1920x600.png',
            };
        }

        const categoriesSnap = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        const packagesSnap = await getDocs(collection(db, "packages"));
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));

        return {
            hero: pageData,
            ctaData,
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
        ctaData={pageData.ctaData}
        packages={pageData.packages}
        categories={pageData.categories}
      />
    </Suspense>
  );
}
