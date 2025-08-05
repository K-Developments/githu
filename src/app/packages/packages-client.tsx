
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { CtaSection } from '@/components/ui/cta-section';
import type { CtaData, Package, Category } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, CheckCircle, XCircle, Calendar, Users, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';


interface PackagesClientProps {
  hero: {
    headline: string;
    heroImage: string;
  };
  ctaData: CtaData | null;
  packages: Package[];
  categories: Category[];
}

export function PackagesPageClient({ hero, ctaData, packages, categories }: PackagesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const packageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const searchParams = useSearchParams();
  const openPackageId = searchParams.get('open');

  useEffect(() => {
    if (openPackageId) {
      setOpenAccordion(openPackageId);
    }
  }, [openPackageId]);

  useEffect(() => {
    if (openAccordion && packageRefs.current[openAccordion]) {
      setTimeout(() => {
        const headerOffset = 68; // height of the sticky header
        const elementPosition = packageRefs.current[openAccordion]?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
        });
      }, 100); 
    }
  }, [openAccordion]);

  const filteredPackages = packages.filter(pkg => 
    selectedCategory === 'all' || pkg.categoryId === selectedCategory
  );

  const handleValueChange = (value: string | null) => {
    setOpenAccordion(value);
  };

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
          <div className="flex-1 relative w-full left-0">
              <ScrollAnimation>
                  <Image
                    src={hero.heroImage}
                    alt="Scenic view of a travel package destination"
                    fill
                    className="object-cover"
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

       <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
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

          <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4"
            value={openAccordion ?? undefined}
            onValueChange={handleValueChange}
          >
            {filteredPackages.map(pkg => (
              <AccordionItem 
                value={pkg.id} 
                key={pkg.id} 
                className="border-b-0"
                ref={el => (packageRefs.current[pkg.id] = el)}
              >
                <PackageAccordion 
                    pkg={pkg} 
                    accordionValue={openAccordion}
                    onValueChange={handleValueChange}
                />
              </AccordionItem>
            ))}
          </Accordion>
          {filteredPackages.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No packages found for the selected category.</p>
            </div>
          )}
        </div>
      </section>
      
      {ctaData && <CtaSection data={ctaData} />}
    </div>
  );
}

function PackageAccordion({ pkg, accordionValue, onValueChange }: { pkg: Package, accordionValue: string | null, onValueChange: (value: string | null) => void }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isSticky, setIsSticky] = useState(false);
    const headerHeight = 68;
    const isOpen = accordionValue === pkg.id;
    const [isHovered, setIsHovered] = useState(false);


    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleScroll = () => {
            const itemRect = item.getBoundingClientRect();
            const shouldBeSticky = isOpen && itemRect.top <= headerHeight && itemRect.bottom - (triggerRef.current?.offsetHeight ?? 0) > headerHeight;
            setIsSticky(shouldBeSticky);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen, headerHeight]);
    
    const renderList = (items: string[] | undefined, icon: React.ReactNode, itemClassName: string) => (
        <ul className="space-y-2">
            {items?.map((item, index) => (
                <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1 flex-shrink-0">{icon}</span>
                    <span className={itemClassName}>{item}</span>
                </li>
            ))}
        </ul>
      );

    const contentContainerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    };

    const contentItemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 50 },
      },
    };

    const stickyHeaderVariants = {
      hidden: { y: -20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 200, damping: 25 }
      },
    };

    return (
        <div ref={itemRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative">
            <AnimatePresence>
                {isHovered && !isOpen && pkg.images?.[0] && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-1/2 -translate-y-1/2 right-0 transform translate-x-full ml-4 w-64 h-40 rounded-lg shadow-xl overflow-hidden pointer-events-none z-10"
                    >
                        <Image
                            src={pkg.images[0]}
                            alt={`Preview of ${pkg.title}`}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSticky && (
                    <motion.div
                        layout
                        variants={stickyHeaderVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed z-20 w-full left-0"
                        style={{ top: headerHeight }}
                        onClick={() => onValueChange(null)}
                    >
                        <div
                            className="flex justify-between items-center w-full p-4 md:p-6 text-left font-headline text-2xl md:text-4xl hover:no-underline rounded-t-lg transition-colors bg-primary text-primary-foreground cursor-pointer shadow-lg max-w-7xl mx-auto"
                        >
                            <span className="truncate">{pkg.title}</span>
                            <ChevronDown className={cn("h-6 w-6 shrink-0 transition-transform duration-200 rotate-180")} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AccordionTrigger
                ref={triggerRef}
                className={cn(
                    "flex justify-between items-center w-full p-4 md:p-6 text-left font-headline text-2xl md:text-4xl hover:no-underline bg-card rounded-t-lg transition-colors",
                    isOpen ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
            >
                <span className="truncate">{pkg.title}</span>
                <ChevronDown className={cn("h-6 w-6 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
            </AccordionTrigger>

            <AccordionContent className="p-0 bg-card rounded-b-lg overflow-hidden">
                    <motion.div
                        initial={false}
                        animate={isOpen ? 'visible' : 'hidden'}
                        exit="hidden"
                        variants={contentContainerVariants}
                        className="p-6 md:p-10"
                    >
                        <motion.p variants={contentItemVariants} className="text-lg text-muted-foreground mb-6">{pkg.location}</motion.p>

                        <motion.div variants={contentItemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b">
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
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                            <motion.div variants={contentItemVariants} className="md:col-span-3">
                                <h3 className="font-headline text-3xl mb-6">Tour Itinerary</h3>
                                <div className="space-y-6 prose prose-stone max-w-none text-muted-foreground">
                                    <div dangerouslySetInnerHTML={{ __html: pkg.description.replace(/\\n/g, '<br />') }} />
                                </div>
                            </motion.div>
                            <motion.div variants={contentItemVariants} className="md:col-span-2">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {(pkg.images || []).filter(img => img).map((image, index) => (
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
                            </motion.div>
                        </div>
                    </motion.div>
            </AccordionContent>
        </div>
    )
}
