
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { CtaSection } from '@/components/ui/cta-section';
import type { CtaData, Package, Category } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


interface PackagesPageData {
  hero: {
    headline: string;
    heroImage: string;
  };
  ctaData: CtaData | null;
}

export default function PackagesPage() {
  const [pageData, setPageData] = useState<PackagesPageData | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);


  useEffect(() => {
    async function getPackagesPageData() {
        try {
            const contentDocRef = doc(db, 'content', 'packages');
            const contentDocSnap = await getDoc(contentDocRef);

            const homeContentDocRef = doc(db, "content", "home");
            const homeContentDocSnap = await getDoc(homeContentDocRef);
            let ctaData: CtaData | null = null;
            if (homeContentDocSnap.exists()) {
                const homeData = homeContentDocSnap.data();
                const cta = homeData.cta as CtaData;
                if (cta && !cta.interactiveItems) {
                    cta.interactiveItems = [];
                }
                ctaData = cta;
            }

            if (contentDocSnap.exists()) {
                const data = contentDocSnap.data();
                setPageData({
                    hero: {
                      headline: data.hero?.headline || 'Our Packages',
                      heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
                    },
                    ctaData,
                });
            } else {
                 setPageData({
                    hero: {
                        headline: 'Our Packages',
                        heroImage: 'https://placehold.co/1920x600.png',
                    },
                    ctaData,
                });
            }

            const categoriesSnap = await getDocs(collection(db, "categories"));
            const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            setCategories(categoriesData);

            const packagesSnap = await getDocs(collection(db, "packages"));
            const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
            setPackages(packagesData);

        } catch (error) {
            console.error('Error fetching packages page data:', error);
             setPageData(null);
        } finally {
            setLoading(false);
        }
    }
    getPackagesPageData();
  }, []);

  const filteredPackages = packages.filter(pkg => 
    selectedCategory === 'all' || pkg.categoryId === selectedCategory
  );

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!pageData) {
      return <div>Error loading page data.</div>;
  }

  const { hero, ctaData } = pageData;

  const renderList = (items: string[] | undefined, icon: React.ReactNode) => (
    <ul className="space-y-2">
        {items?.map((item, index) => (
            <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 flex-shrink-0">{icon}</span>
                <span>{item}</span>
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
                    data-ai-hint="travel destination"
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
            <AccordionItem value={pkg.id} key={pkg.id} className="border-b">
              <AccordionTrigger 
                className={cn(
                  "flex justify-between items-center w-full py-4 text-left font-headline text-2xl md:text-4xl hover:no-underline",
                  openAccordion === pkg.id && "text-primary"
                  )}
              >
                <span>{pkg.title}</span>
                <ChevronDown className={cn("h-6 w-6 shrink-0 transition-transform duration-200", openAccordion === pkg.id && "rotate-180")}/>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <h3 className="font-headline text-2xl mb-4">Tour Overview</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{pkg.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h4 className="font-headline text-xl mb-3">Inclusions</h4>
                            {renderList(pkg.inclusions, <CheckCircle className="h-5 w-5 text-green-500" />)}
                        </div>
                         <div>
                            <h4 className="font-headline text-xl mb-3">Exclusions</h4>
                            {renderList(pkg.exclusions, <XCircle className="h-5 w-5 text-red-500" />)}
                        </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(pkg.images || []).filter(img => img).map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image 
                          src={image} 
                          alt={`${pkg.title} - image ${index + 1}`} 
                          fill
                          className="object-cover rounded-md"
                          data-ai-hint={(pkg.imageHints && pkg.imageHints[index]) || 'travel landscape'}
                          />
                      </div>
                    ))}
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
      </section>
      
      {ctaData && <CtaSection data={ctaData} />}
    </div>
  );
}
