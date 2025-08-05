
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { CtaSection } from '@/components/ui/cta-section';
import type { CtaData } from '@/lib/data';

interface PackagesPageData {
  hero: {
    headline: string;
    heroImage: string;
  };
  ctaData: CtaData | null;
}

export default function PackagesPage() {
  const [pageData, setPageData] = useState<PackagesPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPackagesPageData() {
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

            if (contentDocSnap.exists()) {
                const data = contentDocSnap.data();
                setPageData({
                    hero: {
                      headline: data.hero?.headline || 'Our Packages',
                      heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
                    },
                    ctaData,
                });
            } else {
                 setPageData({
                    hero: {
                        headline: 'Our Packages',
                        heroImage: 'https://placehold.co/1920x600.png',
                    },
                    ctaData,
                });
            }
        } catch (error) {
            console.error('Error fetching packages page data:', error);
             setPageData(null);
        } finally {
            setLoading(false);
        }
    }
    getPackagesPageData();
  }, []);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!pageData) {
      return <div>Error loading page data.</div>;
  }

  const { hero, ctaData } = pageData;

  return (
    <div>
      <section className="h-[70vh] flex flex-col bg-white">
          <div className="flex-[0.7] flex items-center justify-center p-4">
              <ScrollAnimation>
                  <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground">
                  {hero.headline}
                  </h1>
              </ScrollAnimation>
          </div>
          <div className="flex-1 relative w-full">
              <ScrollAnimation>
                  <Image
                    src={hero.heroImage}
                    alt="Scenic view of a travel package destination"
                    fill
                    className="object-cover"
                    data-ai-hint="travel destination"
                  />
              </ScrollAnimation>
              <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
          </div>
      </section>

      <div className="bg-white px-4 md:px-12">
          <Separator />
          <div className="text-sm text-muted-foreground py-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">||</span>
              <span>Packages</span>
          </div>
          <Separator />
      </div>

      {/* Future content will go here */}
      
      {ctaData && <CtaSection data={ctaData} />}
    </div>
  );
}
