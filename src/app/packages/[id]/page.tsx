import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit } from 'firebase/firestore';
import type { Package, Category } from '@/lib/data';
import { PackageDetailClient } from './package-detail-client';
import { notFound } from 'next/navigation';

interface PackagePageProps {
    params: Promise<{ id: string }>; // Changed: params is now a Promise
}

async function getPackagePageData(id: string) {
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

export default async function PackageDetailPage({ params }: PackagePageProps) {
    // Changed: Await the params Promise
    const { id } = await params;
    const pageData = await getPackagePageData(id);
    
    if (!pageData) {
        notFound();
    }
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PackageDetailClient 
                pkg={pageData.pkg}
                otherPackages={pageData.otherPackages}
            />
        </Suspense>
    );
}
