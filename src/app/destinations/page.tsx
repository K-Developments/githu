
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import type { Destination, Package } from '@/lib/data';
import { DestinationsPageClient } from './destinations-client';
import { DestinationDetailClient } from './[id]/destination-detail-client';

interface PageData {
  hero: {
    headline: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  destinations: Destination[];
}

interface DetailPageData {
    destination: Destination;
    otherDestinations: Destination[];
}

// Fetch data for the main list page
async function getDestinationsPageData(): Promise<PageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'destinations');
        const contentDocSnap = await getDoc(contentDocRef);
        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);

        let heroData: PageData['hero'];
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
                contentBackgroundImage: data.hero?.contentBackgroundImage || '',
                sliderImages,
            };
        } else {
             heroData = {
                headline: 'Our Destinations',
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

// Fetch data for the detail view
async function getDestinationPageData(id: string): Promise<DetailPageData | null> {
    try {
        const destinationDocRef = doc(db, 'destinations', id);
        const destinationDocSnap = await getDoc(destinationDocRef);
        
        if (!destinationDocSnap.exists()) {
            return null;
        }
        
        const destinationData = { id: destinationDocSnap.id, ...destinationDocSnap.data() } as Destination;
        
        const otherDestinationsQuery = query(
            collection(db, "destinations"), 
            where('__name__', '!=', id),
            limit(6)
        );
        const otherDestinationsSnap = await getDocs(otherDestinationsQuery);
        const otherDestinationsData = otherDestinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        
        return {
            destination: destinationData,
            otherDestinations: otherDestinationsData,
        };
    } catch (error) {
        console.error('Error fetching destination page data:', error);
        return null;
    }
}

function DestinationsContent() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id');

    const [view, setView] = useState<'list' | 'detail'>(initialId ? 'detail' : 'list');
    const [selectedId, setSelectedId] = useState<string | null>(initialId);

    const [listPageData, setListPageData] = useState<PageData | null>(null);
    const [detailPageData, setDetailPageData] = useState<DetailPageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (view === 'list') {
            setLoading(true);
            getDestinationsPageData().then(data => {
                setListPageData(data);
                setLoading(false);
            });
        } else if (view === 'detail' && selectedId) {
            setLoading(true);
            getDestinationPageData(selectedId).then(data => {
                setDetailPageData(data);
                setLoading(false);
            });
        }
    }, [view, selectedId]);

    const handleSelectDestination = (id: string) => {
        setSelectedId(id);
        setView('detail');
        const newUrl = `/destinations?id=${id}`;
        window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedId(null);
        const newUrl = `/destinations`;
        window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    };
    
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                setSelectedId(id);
                setView('detail');
            } else {
                setView('list');
                setSelectedId(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);


    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (view === 'detail' && detailPageData) {
         return (
            <DestinationDetailClient 
                destination={detailPageData.destination}
                otherDestinations={detailPageData.otherDestinations}
                onBack={handleBackToList}
            />
        );
    }
    
    if (listPageData) {
        return (
            <DestinationsPageClient 
                hero={listPageData.hero}
                destinations={listPageData.destinations}
                onDestinationSelect={handleSelectDestination}
            />
        );
    }

    return <div>Error loading page data.</div>;
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DestinationsContent />
        </Suspense>
    );
}
