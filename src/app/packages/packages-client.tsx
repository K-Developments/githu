
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePackages } from '@/context/packages-context';
import type { Package, Category, PackagesCtaData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PackageCard } from '@/components/ui/package-card';
import { TourItinerary } from '@/components/ui/tour-itinerary';
import { PackagesCtaSection } from '@/components/ui/packages-cta-section';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Users, MapPin, Clock } from 'lucide-react';

interface PackagesClientProps {
  hero: {
    headline: string;
  };
  packages: Package[];
  categories: Category[];
  cta: PackagesCtaData;
}

function PackageDetailView({ pkg }: { pkg: Package }) {
    if (!pkg) return null;
    const [mainImage, setMainImage] = useState(pkg.images[0]);

    useEffect(() => {
        setMainImage(pkg.images[0]);
    }, [pkg]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
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
            </div>
            <div>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.duration && <Badge variant="outline" className="flex items-center gap-1.5"><Clock size={14} /> {pkg.duration}</Badge>}
                    {pkg.groupSize && <Badge variant="outline" className="flex items-center gap-1.5"><Users size={14} /> {pkg.groupSize}</Badge>}
                    {pkg.destinationsCount && <Badge variant="outline" className="flex items-center gap-1.5"><MapPin size={14} /> {pkg.destinationsCount} Destinations</Badge>}
                </div>
                {pkg.rating && <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> 
                    <span>{pkg.rating} ({pkg.reviewsCount} reviews)</span>
                </div>}
                
                <TourItinerary overview={pkg.overview} itinerary={pkg.itinerary} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {pkg.inclusions && pkg.inclusions.length > 0 && <div>
                        <h4 className="font-headline text-xl mb-3">What's Included</h4>
                        <ul className="space-y-2">
                            {pkg.inclusions.map((item, i) => <li key={i} className="flex items-start text-muted-foreground"><Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />{item}</li>)}
                        </ul>
                    </div>}
                    {pkg.exclusions && pkg.exclusions.length > 0 && <div>
                        <h4 className="font-headline text-xl mb-3">What's Not Included</h4>
                         <ul className="space-y-2">
                            {pkg.exclusions.map((item, i) => <li key={i} className="flex items-start text-muted-foreground"><X className="h-5 w-5 text-red-500 mr-2 mt-0.5 shrink-0" />{item}</li>)}
                        </ul>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export function PackagesPageClient({ hero, packages, categories, cta }: PackagesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  
  const { setPackages, setSelectedPackage } = usePackages();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const selectedPackageId = searchParams.get('package');

  useEffect(() => {
    setPackages(packages);
  }, [packages, setPackages]);

  useEffect(() => {
    const pkg = packages.find(p => p.id === selectedPackageId) || null;
    setSelectedPackage(pkg);
  }, [selectedPackageId, packages, setSelectedPackage]);

  const filteredPackages = useMemo(() => {
    if (activeCategoryId === 'all') return packages;
    return packages.filter(p => p.categoryId === activeCategoryId);
  }, [activeCategoryId, packages]);
  
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);
  
  const handleCloseDialog = () => {
    router.push('/packages', { scroll: false });
  };
  
  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const heroSection = document.getElementById('hero-section-packages');
    if (heroSection) {
        const nextSection = heroSection.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <>
      <section id="hero-section-packages" className="h-[65vh] flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 relative">
              <div className="relative text-center">
                  <ScrollAnimation>
                      <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground break-words relative" style={{ lineBreak: 'anywhere'}}>
                          {hero.headline}
                      </h1>
                  </ScrollAnimation>
                   <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center mt-12" aria-label="Scroll down">
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
              <span>Packages</span>
          </div>
          <Separator />
      </div>

       <section className="py-28 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
             <ScrollAnimation className="flex justify-center flex-wrap gap-8 md:gap-12 my-8">
                <button
                    onClick={() => handleCategoryChange('all')}
                    className={cn('package-filter', activeCategoryId === 'all' && 'active')}
                >
                    All
                </button>
                {categories.map(category => (
                    <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn('package-filter', activeCategoryId === category.id && 'active')}
                    >
                    {category.name}
                    </button>
                ))}
            </ScrollAnimation>
            
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <AnimatePresence>
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} isMobile={isMobile} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredPackages.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No tour packages found for this category.</p>
                </div>
            )}
        </div>
      </section>
      
      <PackagesCtaSection {...cta} />

      <Dialog open={!!selectedPackageId} onOpenChange={(open) => !open && handleCloseDialog()}>
        <AnimatePresence>
          {selectedPackageId && (
            <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-grow overflow-y-auto p-2"
              >
                  {packages.find(p => p.id === selectedPackageId) ? (
                    <PackageDetailView pkg={packages.find(p => p.id === selectedPackageId)!} />
                  ) : (
                    <div>Loading package...</div>
                  )}
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
}
