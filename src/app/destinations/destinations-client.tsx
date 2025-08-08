
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import type { Destination } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface DestinationsClientProps {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  destinations: Destination[];
}

export function DestinationsPageClient({ hero, destinations }: DestinationsClientProps) {

  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const heroSection = document.getElementById('hero-section-destinations');
      if (heroSection) {
          const nextSection = heroSection.nextElementSibling;
          if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
          }
      }
  };

  return (
    <div>
      <section id="hero-section-destinations" className="h-[65vh] flex flex-col">
          <div 
            className="flex-1 flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: hero.contentBackgroundImage ? `url(${hero.contentBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
          >
              <div className="relative text-center">
                  <ScrollAnimation>
                      <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground break-words relative" style={{ lineBreak: 'anywhere'}}>
                      {hero.headline}
                      </h1>
                  </ScrollAnimation>
                  <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center" aria-label="Scroll down">
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
      
      <Separator/>
      <Separator/>


      <div className="px-4 md:px-12">
          <div className="text-sm text-muted-foreground py-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">||</span>
              <span>Destinations</span>
          </div>
          <Separator />
      </div>

       <section className="py-28 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest, i) => (
                <ScrollAnimation key={dest.id} delay={i * 0.1}>
                    <Link href={dest.linkUrl || `/destinations/${dest.id}`} passHref>
                        <div className="destination-card group">
                            <Image 
                                src={dest.image || "https://placehold.co/600x800.png"} 
                                alt={dest.title} 
                                fill 
                                style={{ objectFit: 'cover' }} 
                                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                                className="card-image"
                            />
                            <div className="card-overlay"></div>
                            <div className="destination-card-title-box">
                                <h3 className="destination-card-title">{dest.title}</h3>
                            </div>
                            <div className="destination-card-description-box">
                                <p className="destination-card-description">{dest.description}</p>
                            </div>
                        </div>
                    </Link>
                </ScrollAnimation>
                ))}
            </div>
          {destinations.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No destinations have been added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
