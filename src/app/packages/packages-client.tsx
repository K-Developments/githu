
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { PackagesCtaSection } from '@/components/ui/packages-cta-section';
import type { Package, Category, PackagesCtaData, ItineraryDay } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, CheckCircle, XCircle, Calendar, Users, MapPin, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { TourItinerary } from '@/components/ui/tour-itinerary';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";


interface PackagesClientProps {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
    sliderImages?: string[];
  };
  packages: Package[];
  categories: Category[];
  cta: PackagesCtaData;
}

function HeroImageSlider({ images }: { images: string[] }) {
    const isMobile = useIsMobile();
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (isMobile) {
            const timer = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % (images?.length || 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [images, isMobile]);

    if (!images || images.length === 0) {
        return (
             <Image
                src={'https://placehold.co/1920x600.png'}
                alt="Scenic view of a travel package destination"
                fill
                className="object-cover"
            />
        )
    }

    const duplicatedImages = [...images, ...images];

    return (
        <>
            {isMobile ? (
                <>
                    {(images || []).map((src, index) => (
                        <div key={index} className={`fade-image ${index === currentImage ? 'active' : ''}`}>
                            <Image src={src} alt="" fill className="object-cover" priority={index === 0} />
                        </div>
                    ))}
                </>
            ) : (
                <div className="scrolling-zigzag-container">
                    <div className="scrolling-zigzag-grid">
                        {duplicatedImages.map((src, index) => (
                            <div key={`grid1-${index}`} className="image-wrapper">
                                <Image src={src} alt="" fill className="object-cover" priority />
                            </div>
                        ))}
                    </div>
                     <div className="scrolling-zigzag-grid">
                        {duplicatedImages.map((src, index) => (
                            <div key={`grid2-${index}`} className="image-wrapper">
                                <Image src={src} alt="" fill className="object-cover" priority />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export function PackagesPageClient({ hero, packages, categories, cta }: PackagesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const detailViewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageIdFromUrl = searchParams.get('package');

  useEffect(() => {
    if (packageIdFromUrl) {
      const pkg = packages.find(p => p.id === packageIdFromUrl);
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        // If package not found, remove the query param
        router.push('/packages', { scroll: false });
        setSelectedPackage(null);
      }
    } else {
      setSelectedPackage(null);
    }
  }, [packageIdFromUrl, packages, router]);

  useEffect(() => {
    if (packageIdFromUrl && detailViewRef.current) {
        const timer = setTimeout(() => {
            const yOffset = -80; // Account for sticky header
            const y = detailViewRef.current!.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [packageIdFromUrl]);

  const handleSelectPackage = (pkg: Package) => {
    const newUrl = `/packages?package=${pkg.id}`;
    router.push(newUrl, { scroll: false });
  };
  
  const handleClosePackage = () => {
    router.push('/packages', { scroll: false });
  };

  const filteredPackages = packages.filter(pkg => 
    selectedCategory === 'all' || pkg.categoryId === selectedCategory
  );

  const otherPackages = packages.filter(pkg => pkg.id !== selectedPackage?.id);
  
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  return (
    <div>
      <section className="h-[70vh] flex flex-col bg-white">
          <div 
            className="flex-[0.7] flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: hero.contentBackgroundImage ? `url(${hero.contentBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
          >
              <ScrollAnimation>
                  <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground relative">
                  {hero.headline}
                  </h1>
              </ScrollAnimation>
          </div>
          <div className="flex-1 relative w-full left-0 overflow-hidden">
             <HeroImageSlider images={hero.sliderImages || []} />
          </div>
      </section>
      <Separator />

      <div className="bg-white px-4 md:px-12">
          <div className="text-sm text-muted-foreground py-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">||</span>
              {selectedPackage ? (
                <>
                  <Link href="/packages" className="hover:text-primary" onClick={(e) => { e.preventDefault(); handleClosePackage();}}>Packages</Link>
                  <span className="mx-2">||</span>
                  <span>{selectedPackage.title}</span>
                </>
              ) : (
                <span>Packages</span>
              )}
          </div>
          <Separator />
      </div>

       
      <AnimatePresence mode="wait">
        {selectedPackage ? (
            <motion.div
                key="detail"
                ref={detailViewRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <PackageDetailView 
                    pkg={selectedPackage} 
                    onClose={handleClosePackage}
                    categoryName={getCategoryName(selectedPackage.categoryId)}
                    otherPackages={otherPackages}
                    onSelectPackage={handleSelectPackage}
                />
            </motion.div>
        ) : (
            <motion.section
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="py-12 md:py-24 px-4 md:px-12 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-8">
                    <Select onValueChange={setSelectedCategory} defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg, index) => (
                        <ScrollAnimation key={pkg.id} delay={index * 0.05}>
                            <div 
                                onClick={() => handleSelectPackage(pkg)}
                                className="cursor-pointer group"
                            >
                                <div className="package-display-card">
                                    <div className="card-image">
                                        <Image
                                            src={(pkg.images && pkg.images[0]) || "https://placehold.co/600x400.png"}
                                            alt={`Image of ${pkg.title} package in ${pkg.location}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="card-details">
                                        <h3 className="card-title">{pkg.title}</h3>
                                        <p className="card-description flex-grow text-muted-foreground mb-4">{pkg.location}</p>
                                        <div className="flex justify-center">
                                        <div className="button-wrapper-for-border">
                                            <Button asChild variant="outline" size="sm" className="w-auto">
                                                <div className="w-full h-full flex items-center justify-center">View Details</div>
                                            </Button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                    <p>No packages found for the selected category.</p>
                    </div>
                )}
                </div>
            </motion.section>
        )}
      </AnimatePresence>
      
      <PackagesCtaSection 
        title={cta.title}
        description={cta.description}
        image={cta.image}
      />
    </div>
  );
}

function PackageDetailView({ pkg, onClose, categoryName, otherPackages, onSelectPackage }: { pkg: Package, onClose: () => void, categoryName: string, otherPackages: Package[], onSelectPackage: (pkg: Package) => void }) {
    const [otherApi, setOtherApi] = useState<CarouselApi>()
    
    const renderList = (items: string[] | undefined, icon: React.ReactNode, itemClassName: string) => (
        <ul className="space-y-2">
            {(items || []).filter(item => item.trim() !== '').map((item, index) => (
                <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1 flex-shrink-0 ">{icon}</span>
                    <span className={itemClassName}>{item}</span>
                </li>
            ))}
        </ul>
      );
      
  return (
    <>
    <section className="bg-background py-16 md:py-24 px-4 md:px-12 relative">
      <div className="max-w-7xl mx-auto p-6 md:p-10 bg-card rounded-lg shadow-2xl relative">
        <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background/80 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>
      
        <div className="mb-8">
            <p className="text-primary font-semibold uppercase tracking-wider mb-2">{categoryName}</p>
            <h2 className="font-headline text-4xl md:text-6xl text-foreground">{pkg.title}</h2>
            <p className="text-lg text-muted-foreground mt-2">{pkg.location}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b">
            <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                    <h4 className="font-semibold">Duration</h4>
                    <p className="text-muted-foreground">{pkg.duration}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                    <h4 className="font-semibold">Group Size</h4>
                    <p className="text-muted-foreground">{pkg.groupSize}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                    <h4 className="font-semibold">Destinations</h4>
                    <p className="text-muted-foreground">{pkg.destinationsCount}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                <div>
                    <h4 className="font-semibold">Rating</h4>
                    <p className="text-muted-foreground">{pkg.rating}/5 ({pkg.reviewsCount} reviews)</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-3">
                <TourItinerary overview={pkg.overview} itinerary={pkg.itinerary} />
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {(pkg.images || []).slice(0, 4).filter(img => img).map((image, index) => (
                        <div key={index} className="relative aspect-square">
                            <Image
                                src={image}
                                alt={`${pkg.title} - image ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 p-6 bg-background rounded-lg">
                    <div>
                        <h4 className="font-headline text-2xl mb-4">Inclusions</h4>
                        {renderList(pkg.inclusions, <CheckCircle className="h-5 w-5 text-green-500" />, 'text-muted-foreground')}
                    </div>
                    <div>
                        <h4 className="font-headline text-2xl mb-4">Exclusions</h4>
                        {renderList(pkg.exclusions, <XCircle className="h-5 w-5 text-red-500" />, 'text-muted-foreground')}
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <div className="button-wrapper-for-border">
                        <Button asChild size="lg">
                            <Link href={pkg.linkUrl || '#'}>Book This Tour</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    {otherPackages.length > 0 && (
          <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <ScrollAnimation>
                        <h2 className="text-3xl md:text-4xl font-headline">Explore Other Packages</h2>
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
                    <CarouselContent className="-ml-4">
                        {otherPackages.map((otherPkg) => (
                        <CarouselItem key={otherPkg.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <ScrollAnimation>
                               <div 
                                    onClick={() => onSelectPackage(otherPkg)}
                                    className="cursor-pointer group"
                                >
                                    <div className="package-display-card">
                                        <div className="card-image">
                                            <Image
                                                src={(otherPkg.images && otherPkg.images[0]) || "https://placehold.co/600x400.png"}
                                                alt={`Image of ${otherPkg.title} package in ${otherPkg.location}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="card-details">
                                            <h3 className="card-title">{otherPkg.title}</h3>
                                            <p className="card-description flex-grow text-muted-foreground mb-4">{otherPkg.location}</p>
                                            <div className="flex justify-center">
                                            <div className="button-wrapper-for-border">
                                                <Button asChild variant="outline" size="sm" className="w-auto">
                                                    <div className="w-full h-full flex items-center justify-center">View Details</div>
                                                </Button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
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

    </>
  );
}
