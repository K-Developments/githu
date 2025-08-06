
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Destination } from '@/lib/data';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DestinationDetailClientProps {
  destination: Destination;
  otherDestinations: Destination[];
}

export function DestinationDetailClient({ destination, otherDestinations }: DestinationDetailClientProps) {
  const sliderImages = [destination.image, ...(destination.galleryImages || [])].filter(Boolean);

  return (
    <div className="bg-white">
        <Carousel
            opts={{
            align: "start",
            loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
            {sliderImages.map((src, index) => (
                <CarouselItem key={index}>
                <div className="relative h-[80vh] w-full">
                    <Image
                    src={src}
                    alt={`${destination.title} - view ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
             {sliderImages.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
                </>
             )}
        </Carousel>


        <div className="bg-white px-4 md:px-12">
            <Separator />
            <div className="text-sm text-muted-foreground py-4">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">||</span>
                <Link href="/destinations" className="hover:text-primary">Destinations</Link>
                <span className="mx-2">||</span>
                <span>{destination.title}</span>
            </div>
            <Separator />
        </div>

       <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <ScrollAnimation>
                        <h1 className="text-4xl md:text-6xl font-headline text-foreground mb-4">{destination.title}</h1>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <p className="text-lg text-muted-foreground mb-8">{destination.location}</p>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <p className="text-base leading-relaxed whitespace-pre-line">
                            {destination.longDescription || destination.description}
                        </p>
                    </ScrollAnimation>
                </div>
                <div>
                     {(destination.highlights && destination.highlights.length > 0) && (
                         <ScrollAnimation>
                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <h3 className="text-2xl font-headline mb-4">Highlights</h3>
                                <ul className="space-y-3">
                                    {destination.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start">
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

      {otherDestinations.length > 0 && (
          <section className="py-12 md:py-24 px-4 md:px-12 bg-accent/50">
            <div className="max-w-7xl mx-auto">
                <ScrollAnimation>
                    <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Explore Other Destinations</h2>
                </ScrollAnimation>
                <Carousel 
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {otherDestinations.map((dest) => (
                        <CarouselItem key={dest.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <ScrollAnimation>
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
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
                    <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
                </Carousel>
            </div>
          </section>
      )}
    </div>
  );
}
