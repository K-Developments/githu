
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Destination } from '@/lib/data';
import { DestinationsPageClient } from './destinations-client';

interface DestinationsPageData {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  destinations: Destination[];
}

async function getDestinationsPageData(): Promise<DestinationsPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'destinations');
        const contentDocSnap = await getDoc(contentDocRef);
        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);

        let heroData: DestinationsPageData['hero'];
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
                headline: data.hero?.headline || 'Our Destinations',
                heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
                contentBackgroundImage: data.hero?.contentBackgroundImage || '',
                sliderImages,
            };
        } else {
             heroData = {
                headline: 'Our Destinations',
                heroImage: 'https://placehold.co/1920x600.png',
                contentBackgroundImage: '',
                sliderImages,
            };
        }

        const destinationsSnap = await getDocs(collection(db, "destinations"));
        const destinationsData = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));

        return {
            hero: heroData,
            destinations: destinationsData,
        };

    } catch (error) {
        console.error('Error fetching destinations page data:', error);
        return null;
    }
}


export default async function DestinationsPage() {
  const pageData = await getDestinationsPageData();
  
  if (!pageData) {
      return <div>Error loading page data.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DestinationsPageClient 
        hero={pageData.hero}
        destinations={pageData.destinations}
      />
    </Suspense>
  );
}

    
