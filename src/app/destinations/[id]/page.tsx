
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import type { Destination } from '@/lib/data';
import { DestinationDetailClient } from './destination-detail-client';
import { notFound } from 'next/navigation';

interface DestinationPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function getDestinationPageData(id: string) {
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


export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const pageData = await getDestinationPageData(params.id);
  
  if (!pageData) {
      notFound();
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
