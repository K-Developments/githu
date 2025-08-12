
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { TourItinerary } from '@/components/ui/tour-itinerary';
import { PackageCard } from '@/components/ui/package-card';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Package } from '@/lib/data';
import { Check, X, Star, Users, MapPin, Clock, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface PackageDetailClientProps {
  pkg: Package;
  otherPackages: Package[];
  onBack: () => void;
}

export function PackageDetailClient({ pkg, otherPackages, onBack }: PackageDetailClientProps) {
  const [mainImage, setMainImage] = useState(pkg.images[0]);
  const [otherApi, setOtherApi] = useState<CarouselApi>()
  const isMobile = useIsMobile();

  useEffect(() => {
      setMainImage(pkg.images[0]);
  }, [pkg]);
  
  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const heroSection = document.getElementById('hero-section-package-detail');
      if (heroSection) {
          const nextSection = heroSection.nextElementSibling;
          if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
          }
      }
  };

  return (
    <div>
        <section id="hero-section-package-detail" className="h-[65vh] flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 relative">
                 <Image
                    src={pkg.images[0]}
                    alt={`${pkg.title} hero background`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative text-center">
                    <ScrollAnimation>
                        <h1 className="text-5xl md:text-7xl font-bold font-headline text-center uppercase tracking-widest text-white z-10 relative">
                        {pkg.title}
                        </h1>
                    </ScrollAnimation>
                    <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center mt-12" aria-label="Scroll down">
                      <motion.div
                          initial={{ height: '0%' }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                          className="w-full bg-white"
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
                <span className="hover:text-primary cursor-pointer" onClick={onBack}>Packages</span>
                <span className="mx-2">||</span>
                <span>{pkg.title}</span>
            </div>
            <Separator />
        </div>

       <section className="py-28 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <div>
                    <ScrollAnimation>
                        <div className="relative aspect-[4/3] w-full mb-4 overflow-hidden rounded-lg">
                            <AnimatePresence>
                                <motion.div
                                    key={mainImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={mainImage}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                      <div className="grid grid-cols-4 gap-2">
                          {pkg.images.map((img, index) => (
                              img && <div
                                  key={index}
                                  className="relative aspect-square w-full cursor-pointer rounded-md overflow-hidden"
                                  onClick={() => setMainImage(img)}
                              >
                                  <Image src={img} alt={`${pkg.title} thumbnail ${index+1}`} fill className="object-cover" />
                                  {mainImage === img && <div className="absolute inset-0 border-2 border-primary rounded-md" />}
                              </div>
                          ))}
                      </div>
                    </ScrollAnimation>
                </div>
                <div>
                    <ScrollAnimation>
                      <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.duration && <Badge variant="outline" className="flex items-center gap-1.5"><Clock size={14} /> {pkg.duration}</Badge>}
                          {pkg.groupSize && <Badge variant="outline" className="flex items-center gap-1.5"><Users size={14} /> {pkg.groupSize}</Badge>}
                          {pkg.destinationsCount && <Badge variant="outline" className="flex items-center gap-1.5"><MapPin size={14} /> {pkg.destinationsCount} Destinations</Badge>}
                      </div>
                      {pkg.rating && <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <Star size={16} className="text-amber-400 fill-amber-400" /> 
                          <span>{pkg.rating} ({pkg.reviewsCount} reviews)</span>
                      </div>}
                    </ScrollAnimation>
                    
                    <ScrollAnimation>
                      <TourItinerary overview={pkg.overview} itinerary={pkg.itinerary} />
                    </ScrollAnimation>
                    
                    <ScrollAnimation>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                          {pkg.inclusions && pkg.inclusions.length > 0 && <div>
                              <h4 className="font-semibold text-xl mb-3">What's Included</h4>
                              <ul className="space-y-2">
                                  {pkg.inclusions.map((item, i) => <li key={i} className="flex items-start text-muted-foreground text-body"><span className="font-bold text-primary mr-2 mt-1">&#8226;</span>{item}</li>)}
                              </ul>
                          </div>}
                          {pkg.exclusions && pkg.exclusions.length > 0 && <div>
                              <h4 className="font-semibold text-xl mb-3">What's Not Included</h4>
                              <ul className="space-y-2">
                                  {pkg.exclusions.map((item, i) => <li key={i} className="flex items-start text-muted-foreground text-body"><span className="font-bold text-foreground/50 mr-2 mt-1">&#8226;</span>{item}</li>)}
                              </ul>
                          </div>}
                      </div>
                     </ScrollAnimation>
                     <ScrollAnimation>
                        <div className="button-wrapper-for-border mt-12 inline-block">
                           <Button asChild size="lg">
                                <Link href="/contact">Inquire About This Tour</Link>
                           </Button>
                        </div>
                     </ScrollAnimation>
                </div>
           </div>
        </div>
      </section>

      {otherPackages.length > 0 && (
          <section className="py-28 px-4 md:px-12 bg-secondary/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <ScrollAnimation>
                        <h2 className="text-3xl md:text-4xl font-headline">You Might Also Like</h2>
                    </ScrollAnimation>
                </div>
                
                <Carousel 
                    setApi={setOtherApi}
                    opts={{
                        align: "start",
                        loop: otherPackages.length > 3,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-8">
                        {otherPackages.map((p, i) => (
                          <CarouselItem key={p.id} className="pl-8 md:basis-1/2 lg:basis-1/3">
                              <div onClick={() => {
                                  // Since we can't directly navigate, we might need a different approach
                                  // For now, this will just re-render with new data but URL won't change
                                  // A better solution would involve the parent page handling this state change
                                  console.log("Package clicked, but navigation is handled by parent");
                              }}>
                                <PackageCard pkg={p} isMobile={isMobile} />
                              </div>
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="flex justify-center items-center gap-2 mt-8">
                    <div className="button-wrapper-for-border">
                        <Button variant="outline" size="icon" onClick={() => otherApi?.scrollPrev()}>
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="button-wrapper-for-border">
                        <Button variant="outline" size="icon" onClick={() => otherApi?.scrollNext()}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </section>
      )}
    </div>
  );
}
