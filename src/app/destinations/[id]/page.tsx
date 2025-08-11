
'use client';

import { Suspense, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import type { Destination } from '@/lib/data';
import { DestinationDetailClient } from './destination-detail-client';
import { notFound, useParams } from 'next/navigation';

interface PageData {
    destination: Destination;
    otherDestinations: Destination[];
}

async function getDestinationPageData(id: string): Promise<PageData | null> {
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

export default function DestinationDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getDestinationPageData(id).then(data => {
                if (data) {
                    setPageData(data);
                } else {
                    notFound();
                }
                setLoading(false);
            });
        }
    }, [id]);
    
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!pageData) {
        // This will be caught by notFound() in useEffect, but as a fallback
        return notFound();
    }
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationDetailClient 
                destination={pageData.destination}
                otherDestinations={pageData.otherDestinations}
            />
        </Suspense>
    );
}
