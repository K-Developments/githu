
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AboutHeroData {
  headline: string;
  heroImage: string;
}

export default function AboutPage() {
  const [heroData, setHeroData] = useState<AboutHeroData>({
    headline: 'About Us',
    heroImage: 'https://placehold.co/1920x600.png',
  });

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const contentDocRef = doc(db, 'content', 'about');
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          setHeroData({
            headline: data.hero?.headline || 'About Us',
            heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
          });
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
      }
    };

    fetchContentData();
  }, []);

  return (
    <>
      <section className="h-[60vh] flex flex-col bg-card">
        <div className="flex-1 flex items-center justify-center p-8">
          <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground">
            {heroData.headline}
          </h1>
        </div>
        <div className="flex-1 relative w-full">
          <Image
            src={heroData.heroImage}
            alt="A diverse team collaborating on travel plans"
            fill
            className="object-cover"
            data-ai-hint="team collaboration"
          />
        </div>
      </section>
    </>
  );
}
