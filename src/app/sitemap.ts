
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MetadataRoute } from 'next';
import type { Destination, Package } from '@/lib/data';

const URL = 'https://your-production-domain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '/',
    '/about',
    '/services',
    '/packages',
    '/destinations',
    '/gallery',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));

  try {
    const packagesSnap = await getDocs(collection(db, "packages"));
    const packagesRoutes = packagesSnap.docs.map(doc => {
        const pkg = { id: doc.id, ...doc.data() } as Package;
        return {
            url: `${URL}/packages?id=${pkg.id}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as 'weekly',
            priority: 0.7,
        };
    });

    const destinationsSnap = await getDocs(collection(db, "destinations"));
    const destinationsRoutes = destinationsSnap.docs.map(doc => {
        const dest = { id: doc.id, ...doc.data() } as Destination;
        return {
            url: `${URL}/destinations?id=${dest.id}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as 'weekly',
            priority: 0.7,
        };
    });

    return [...staticRoutes, ...packagesRoutes, ...destinationsRoutes];

  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return only static routes if there's an error fetching dynamic ones
    return staticRoutes;
  }
}
