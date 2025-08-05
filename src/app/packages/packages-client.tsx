
'use client';

import { useState, useEffect, useRef } from 'react';
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
        packageRefs.current[openAccordion]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100); // Small delay to allow layout to settle
    }
  }, [openAccordion]);

  const filteredPackages = packages.filter(pkg => 
    selectedCategory === 'all' || pkg.categoryId === selectedCategory
  );

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
          <div className="flex-1 relative w-full">
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
            value={openAccordion || undefined}
            onValueChange={setOpenAccordion}
          >
            {filteredPackages.map(pkg => (
              <AccordionItem 
                value={pkg.id} 
                key={pkg.id} 
                className="border-b-0"
                ref={el => (packageRefs.current[pkg.id] = el)}
              >
                <AccordionTrigger 
                  className={cn(
                    "flex justify-between items-center w-full p-6 text-left font-headline text-2xl md:text-4xl hover:no-underline bg-card rounded-t-lg transition-colors",
                    openAccordion === pkg.id 
                      ? "bg-primary text-primary-foreground sticky top-[68px] z-10" 
                      : "text-primary-foreground",
                  )}
                >
                  <span>{pkg.title}</span>
                  <ChevronDown className={cn("h-6 w-6 shrink-0 transition-transform duration-200", openAccordion === pkg.id && "rotate-180")}/>
                </AccordionTrigger>
                <AccordionContent className="p-6 md:p-10 bg-card rounded-b-lg">
                  <p className="text-lg text-muted-foreground mb-6">{pkg.location}</p>

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
                      <h3 className="font-headline text-3xl mb-6">Tour Itinerary</h3>
                      <div className="space-y-6 prose prose-stone max-w-none text-muted-foreground">
                        <div dangerouslySetInnerHTML={{ __html: pkg.description.replace(/\\n/g, '<br />') }} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
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
                    </div>
                  </div>
                </AccordionContent>
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
