

'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Package, Category, PackagesCtaData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PackageCard } from '@/components/ui/package-card';
import { PackagesCtaSection } from '@/components/ui/packages-cta-section';

interface PackagesClientProps {
  hero: {
    headline: string;
  };
  packages: Package[];
  categories: Category[];
  cta: PackagesCtaData;
}

export function PackagesPageClient({ hero, packages, categories, cta }: PackagesClientProps) {
  const isMobile = useIsMobile();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const filteredPackages = useMemo(() => {
    if (activeCategoryId === 'all') return packages;
    return packages.filter(p => p.categoryId === activeCategoryId);
  }, [activeCategoryId, packages]);
  
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);
  
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
    </>
  );
}
