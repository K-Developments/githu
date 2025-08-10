
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Service } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { ArrowRight } from 'lucide-react';

interface ServicesHeroData {
  headline: string;
}

interface ServicesPageData {
  hero: ServicesHeroData;
  services: Service[];
}

async function getServicesPageData(): Promise<ServicesPageData> {
  try {
    const contentDocRef = doc(db, 'content', 'services');
    const contentDocSnap = await getDoc(contentDocRef);
    
    const heroData = contentDocSnap.exists() 
      ? (contentDocSnap.data().hero as ServicesHeroData) 
      : { headline: 'Our Services' };

    const servicesCollectionRef = collection(db, 'services');
    const q = query(servicesCollectionRef, orderBy('title'));
    const servicesSnap = await getDocs(q);
    const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));

    return {
      hero: heroData,
      services: servicesData,
    };
  } catch (error) {
    console.error('Error fetching services page data:', error);
    return {
      hero: { headline: 'Our Services' },
      services: [],
    };
  }
}

export default function ServicesPage() {
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServicesPageData().then(data => {
      setPageData(data);
      setLoading(false);
    });
  }, []);

  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const heroSection = document.getElementById('hero-section-services');
    if (heroSection) {
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!pageData) {
    return <div>Error loading page.</div>;
  }

  const { hero, services } = pageData;

  return (
    <div>
      <section id="hero-section-services" className="h-[65vh] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <div className="relative text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-8xl font-bold font-headline uppercase tracking-widest text-foreground">
                {hero.headline}
              </h1>
            </ScrollAnimation>
            <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center mt-12 top-[7rem]" aria-label="Scroll down">
              <motion.div
                initial={{ height: '0%' }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                className="w-full bg-black"
              />
            </button>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-12">
        <Separator />
        <div className="text-sm text-muted-foreground py-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">||</span>
          <span>Services</span>
        </div>
        <Separator />
      </div>

      <section className="py-28 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24">
          {services.map((service, index) => (
            <ScrollAnimation key={service.id} delay={index * 0.1}>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                <div className={`relative aspect-square ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-lg shadow-xl"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    data-ai-hint="luxury service travel"
                  />
                </div>
                <div className={`max-w-md ${index % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <h2 className="text-4xl md:text-5xl font-headline mb-6">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-body mb-8">
                    {service.description}
                  </p>
                  <Link href="/contact" className="standard-link">
                    <span>Inquire Now</span>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          ))}
           {services.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No services have been added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
