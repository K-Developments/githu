
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import type { Destination } from '@/lib/data';
import { CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DestinationDetailClientProps {
  destination: Destination;
  otherDestinations: Destination[];
  onBack: () => void;
}

export function DestinationDetailClient({ destination, otherDestinations, onBack }: DestinationDetailClientProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>()
  
  const sliderImages = [destination.image, ...(destination.galleryImages || [])].filter(Boolean);
  
  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const heroSection = document.getElementById('hero-section-destination-detail');
      if (heroSection) {
          const nextSection = heroSection.nextElementSibling;
          if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
          }
      }
  };

  return (
    <div>
        <section id="hero-section-destination-detail" className="h-[65vh] flex flex-col">
            <div 
              className="flex-1 flex items-center justify-center p-4 relative"
            >
                <div className="relative text-center">
                    <ScrollAnimation>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground break-words relative" style={{ lineBreak: 'anywhere'}}>
                          Destinations
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
            <div className="text-xs text-muted-foreground py-4 flex items-center">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">||</span>
                <span className="hover:text-primary cursor-pointer" onClick={onBack}>Destinations</span>
                <span className="mx-2">||</span>
                <span>{destination.title}</span>
            </div>
            <Separator />
        </div>

       <section className="pt-16 pb-28 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <ScrollAnimation>
                    <h2 className="text-lg font-medium tracking-widest uppercase text-muted-foreground">{destination.title}</h2>
                </ScrollAnimation>
            </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative">
                    <Carousel
                        setApi={setMainApi}
                        opts={{
                        align: "start",
                        loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {sliderImages.map((src, index) => (
                            <CarouselItem key={index}>
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                src={src}
                                alt={`${destination.title} - view ${index + 1}`}
                                fill
                                className="object-cover rounded-lg shadow-xl"
                                priority={index === 0}
                                />
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>
                    {sliderImages.length > 1 && (
                         <div className="flex justify-center items-center gap-2 mt-8">
                            <div className="button-wrapper-for-border">
                               <Button variant="outline" size="icon" onClick={() => mainApi?.scrollPrev()}>
                                 <ChevronLeft className="h-4 w-4" />
                               </Button>
                            </div>
                             <div className="button-wrapper-for-border">
                               <Button variant="outline" size="icon" onClick={() => mainApi?.scrollNext()}>
                                 <ChevronRight className="h-4 w-4" />
                               </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <ScrollAnimation>
                        <p className="text-lg text-muted-foreground mb-4 text-body">{destination.location}</p>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <p className="leading-relaxed whitespace-pre-line mb-8 text-body">
                            {destination.longDescription || destination.description}
                        </p>
                    </ScrollAnimation>
                     {(destination.highlights && destination.highlights.length > 0) && (
                         <ScrollAnimation>
                            <div className="bg-secondary p-6 rounded-lg shadow-sm">
                                <h3 className="text-2xl font-headline mb-4">Highlights</h3>
                                <ul className="space-y-3">
                                    {destination.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start text-body">
                                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         </ScrollAnimation>
                     )}
                     <ScrollAnimation>
                        <div className="button-wrapper-for-border mt-8">
                            <Button asChild size="lg" className="w-full">
                                <Link href="#">Plan a Trip to {destination.title}</Link>
                            </Button>
                        </div>
                     </ScrollAnimation>
                </div>
           </div>
        </div>
      </section>
    </div>
  );
}
