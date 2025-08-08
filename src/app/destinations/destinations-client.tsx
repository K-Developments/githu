
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import type { Destination } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <div>
      <section className="h-[40vh] flex flex-col bg-background">
          <div 
            className="flex-1 flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: hero.contentBackgroundImage ? `url(${hero.contentBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
          >
              <ScrollAnimation>
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground break-words relative" style={{ lineBreak: 'anywhere'}}>
                  {hero.headline}
                  </h1>
              </ScrollAnimation>
          </div>
      </section>
      
      <Separator/>
      <Separator/>


      <div className="bg-background px-4 md:px-12">
          <div className="text-sm text-muted-foreground py-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">||</span>
              <span>Destinations</span>
          </div>
          <Separator />
      </div>

       <section className="py-12 md:py-24 px-4 md:px-12 bg-background">
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
