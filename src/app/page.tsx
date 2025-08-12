
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial, CtaData, SiteSettings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useAnimationControls, useMotionValueEvent } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/context/site-settings-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PackageCard } from '@/components/ui/package-card';
import { Preloader } from "@/components/ui/preloader";

const DynamicCtaSection = dynamic(() => import('@/components/ui/cta-section').then(mod => mod.CtaSection));


// Define interfaces for the fetched data
interface HeroData {
  headline: string;
  subtitle: string;
  sliderImages: string[];
}

interface IntroData {
  headline:string;
  paragraph: string;
  linkText: string;
  linkUrl: string;
  portraitImage: string;
  landscapeImage: string;
}

interface QuoteData {
  text: string;
  image: string;
}

interface DestinationsData {
  title: string;
  subtitle: string;
  buttonUrl: string;
}

// Memoized data fetching function with better error handling
const getHomePageData = async () => {
  try {
    const contentDocRef = doc(db, "content", "home");
    const contentDocSnap = await getDoc(contentDocRef);
    
    let heroData: HeroData | null = null;
    let introData: IntroData | null = null;
    let quoteData: QuoteData | null = null;
    let destinationsData: DestinationsData | null = null;
    let ctaData: CtaData | null = null;
    let featuredPackages: { packageIds: string[] } | null = null;
    let featuredDestinations: { destinationIds: string[] } | null = null;


    if (contentDocSnap.exists()) {
      const data = contentDocSnap.data();
      heroData = data.hero as HeroData;
      introData = data.intro as IntroData;
      quoteData = data.quote as QuoteData;
      destinationsData = data.destinations as DestinationsData;
      featuredPackages = data.featuredPackages as { packageIds: string[] };
      featuredDestinations = data.featuredDestinations as { destinationIds: string[] };
      const cta = data.cta as CtaData;
      if (cta && !cta.interactiveItems) {
        cta.interactiveItems = [];
      }
      ctaData = cta;
    }

    // Parallel data fetching for better performance
    const [destinationsSnap, categoriesSnap, packagesSnap, testimonialsSnap] = await Promise.all([
      getDocs(collection(db, "destinations")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "packages")),
      getDocs(collection(db, "testimonials"))
    ]);

    const allDestinations = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
    const allPackages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));

    const finalDestinations = featuredDestinations 
        ? allDestinations.filter(d => featuredDestinations.destinationIds.includes(d.id))
        : [];
    
    const finalPackages = featuredPackages
        ? allPackages.filter(p => featuredPackages.packageIds.includes(p.id))
        : [];

    const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    const testimonials = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));

    return {
      heroData,
      introData,
      quoteData,
      destinationsData,
      ctaData,
      destinations: finalDestinations,
      packages: finalPackages,
      categories,
      testimonials,
    };

  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error; // Re-throw to handle in component
  }
};

// Main component for the homepage
export default function HomePage() {
  const [pageData, setPageData] = useState<Awaited<ReturnType<typeof getHomePageData>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    let isMounted = true;
    
    getHomePageData()
      .then(data => {
        if (isMounted) {
          setPageData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Error loading page data:", err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (error || !pageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not load page content. Please try again later.</p>
      </div>
    );
  }
  
  const {
      heroData,
      introData,
      quoteData,
      destinationsData,
      ctaData,
      destinations,
      packages,
      categories,
      testimonials
    } = pageData;

  return (
    <>
      <HeroSection data={heroData} />
      <IntroSection data={introData} backgroundImage={siteSettings?.introBackgroundImage} />
      <QuoteSection data={quoteData} backgroundImage={siteSettings?.quoteBackgroundImage} />
      <DestinationsSection 
        sectionData={destinationsData} 
        destinations={destinations} 
        backgroundImage={siteSettings?.destinationsBackgroundImage} 
      />
      <PackagesSection 
        categories={categories} 
        packages={packages} 
        backgroundImage={siteSettings?.packagesBackgroundImage} 
      />
      <TestimonialsSection 
        testimonials={testimonials} 
        backgroundImage={siteSettings?.testimonialsBackgroundImage} 
      />
      {ctaData && <DynamicCtaSection data={ctaData} />}
    </>
  );
}

// Memoized HeroSection
const HeroSection = memo(function HeroSection({ data }: { data: HeroData | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  if (!data) return null;

  const headline = data.headline.replace(/<br\s*\/?>/gi, ' <br> ');
  const words = headline.split(" ");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.2 },
    },
  };

  const childVariants = {
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const gridElements = (
      <div className="scrolling-grid-container">
          <div className="scrolling-grid">
              {[...data.sliderImages, ...data.sliderImages].map((src, index) => (
                  <div key={`grid-${index}`} className="image-wrapper">
                      <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          priority={index < 6}
                          sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <section ref={containerRef} className="hero">
      <div className="hero-content">
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {words.map((word, index) =>
            word === '<br>' ? <br key={index} /> : (
              <motion.span
                key={index}
                variants={childVariants}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            )
          )}
        </motion.h1>
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
             <button className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center" aria-label="Scroll down">
                <div className="w-px h-6 overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "50%", "100%"] }}
                        transition={{ 
                            duration: 1.5, 
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 0.5
                         }}
                        className="w-full h-full bg-foreground"
                    />
                </div>
            </button>
        </div>
      </div>

      <div className="hero-image">
        {gridElements}
      </div>
    </section>
  );
});




// Memoized IntroSection
const IntroSection = memo(function IntroSection({ 
  data, 
  backgroundImage 
}: { 
  data: IntroData | null, 
  backgroundImage?: string 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end']
  });

  const borderRadius = useTransform(scrollYProgress, [0.1, 0.7], ["50%", "0%"]);
  const textOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  
  if (!data) return null;

  return (
    <section
      ref={scrollContainerRef}
      className="relative h-[300vh] py-[7rem]"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden h-[150vh] py-[28rem] md:py-[38rem]">
      <ScrollAnimation>
          <h2
            className="secondary-heading text-center"
            dangerouslySetInnerHTML={{ __html: data.headline }}
          />
        </ScrollAnimation>

        <div className="relative md:aspect-square aspect-square md:w-1/2 w-[90%] max-w-[80vh] max-h-[80vh]">
          <motion.div 
            style={{ borderRadius }}
            className="w-full h-full relative overflow-hidden"
          >
            <Image
              src={data.landscapeImage || 'https://placehold.co/1200x675.png'}
              alt="Scenic introduction landscape"
              fill
              sizes="(min-width: 768px) 50vw, 90vw"
              className="object-cover"
              priority
            />
             <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: textOpacity }}
          >
            <h3 className="text-white text-3xl md:text-5xl font-headline tracking-wider">
              Welcome to Sri Lanka
            </h3>
          </motion.div>
        </div>
        
        <ScrollAnimation className="max-w-3xl flex flex-center justify-center" delay={0.2}>
          <p className="text-center text-body w-[90%] mt-12">{data.paragraph}</p>
        </ScrollAnimation>

        <ScrollAnimation delay={0.3}>
          <div className="button-wrapper-for-border mt-4">
            <Button asChild variant="outline">
              <Link href={data.linkUrl || '#'}>{data.linkText}</Link>
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
});






// Memoized QuoteSection
const QuoteSection = memo(function QuoteSection({ 
  data, 
  backgroundImage 
}: { 
  data: QuoteData | null, 
  backgroundImage?: string 
}) {
  if (!data) return null;
  
  return (
    <section 
      className="quote-section py-28 mt-[7rem] mb-[7rem]" 
      style={{ backgroundImage: `url(${backgroundImage || data.image})` }}
    >
      <div className="overlay"></div>
      <ScrollAnimation>
        <p className="quote-text">{data.text}</p>
      </ScrollAnimation>
    </section>
  );
});

const DestinationsCarouselItem = memo(function DestinationsCarouselItem({ 
  dest, 
  index, 
  current, 
  api 
}: { 
  dest: Destination, 
  index: number, 
  current: number, 
  api: CarouselApi | undefined 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isCenter = index === current;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = reducedMotion ? 0 : useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <CarouselItem ref={ref} className="pl-4 basis-[90%] md:basis-[40%] lg:basis-[30%]">
      <div className="md:h-[75vh] h-[60vh] relative flex items-center justify-center bg-[#f5f5f5]">
        <div className={cn(
          "destination-card-parallax w-full h-full transition-all duration-500 ease-in-out",
          isCenter ? "w-full h-full" : "w-[65%] h-[65%]"
        )}>
          <Link href={dest.linkUrl || `/destinations?id=${dest.id}`} className="block w-full h-full">
            <motion.div className="relative w-full h-[130%] parallax-element" style={{ y }}>
              <Image
                src={dest.image || "https://placehold.co/600x800.png"}
                alt={dest.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                className="card-image"
                priority={index <= 2} // Only prioritize first 3 images
              />
            </motion.div>
            <div className={cn(
              "absolute bottom-0 left-0 p-6 text-left z-10 transition-opacity duration-500",
              isCenter ? "opacity-100" : "opacity-0"
            )}>
              <h3 className="text-3xl font-headline text-white">{dest.title}</h3>
              <p className="text-white/80">{dest.location}</p>
            </div>
           
          </Link>
        </div>
      </div>
    </CarouselItem>
  );
});

// Memoized DestinationsSection
const DestinationsSection = memo(function DestinationsSection({ 
  sectionData, 
  destinations, 
  backgroundImage 
}: { 
  sectionData: DestinationsData | null, 
  destinations: Destination[], 
  backgroundImage?: string 
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  const descriptionVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }), []);

  const handlePrev = useCallback(() => api?.scrollPrev(), [api]);
  const handleNext = useCallback(() => api?.scrollNext(), [api]);
  
  if (!sectionData || destinations.length === 0) return null;

  return (
    <section 
      className="destinations-section py-28 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
        <ScrollAnimation>
          <h2 className="section-title text-center mb-4">{sectionData.title}</h2>
        </ScrollAnimation>
        <ScrollAnimation delay={0.1}>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center text-body">
            {sectionData.subtitle}
          </p>
        </ScrollAnimation>
      </div>

      <div className="mt-16">
        <Carousel 
          setApi={setApi} 
          opts={{ 
            align: "center", 
            loop: true,
            containScroll: 'trimSnaps',
          }}
        >
          <CarouselContent className="-ml-4">
            {destinations.map((dest, i) => (
              <DestinationsCarouselItem 
                key={dest.id} 
                dest={dest} 
                index={i} 
                current={current} 
                api={api} 
              />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="max-w-xl mx-auto mt-8 text-center min-h-[6rem] px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={descriptionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center justify-center"
          >
            <p className="text-muted-foreground leading-relaxed text-center w-[80%] text-body">
              {destinations[current]?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <div className=" rounded-full">
          <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="button-wrapper-for-border">
          <Button asChild variant="default">
            <Link href={sectionData.buttonUrl || '#'}>View All Destinations</Link>
          </Button>
        </div>
        <div className="rounded-full">
          <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
});

// Memoized PackagesSection
const PackagesSection = memo(function PackagesSection({ 
  categories, 
  packages, 
  backgroundImage 
}: { 
  categories: Category[], 
  packages: Package[], 
  backgroundImage?: string 
}) {
  const isMobile = useIsMobile();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const displayCategories = useMemo(() => {
      const packageCategoryIds = new Set(packages.map(p => p.categoryId));
      const relevantCategories = categories.filter(c => packageCategoryIds.has(c.id));
      if (relevantCategories.length > 0) {
        return [{ id: 'all', name: 'All' }, ...relevantCategories];
      }
      return [];
  }, [packages, categories]);


  const filteredPackages = useMemo(() => {
    if (activeCategoryId === 'all') return packages;
    return packages.filter(p => p.categoryId === activeCategoryId);
  }, [activeCategoryId, packages]);
  
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);
  
  if (packages.length === 0) {
    return null;
  }

  return (
    <section 
      className="homepage-packages-section py-28"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="packages-container max-w-7xl mx-auto px-2 md:px-12">
        <ScrollAnimation className="text-center">
          <Separator />
          <h2 className="section-title text-center my-8">Our Tours</h2>
          <Separator />
        </ScrollAnimation>
        
        {displayCategories.length > 1 && (
            <ScrollAnimation className="flex justify-center flex-wrap gap-8 md:gap-12 my-8">
            {displayCategories.map(category => (
                <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                    'package-filter',
                    activeCategoryId === category.id && 'active'
                )}
                >
                {category.name}
                </button>
            ))}
            </ScrollAnimation>
        )}

        <motion.div className="packages-grid" layout>
          <AnimatePresence>
            {filteredPackages.map((pkg) => (
                <Link key={pkg.id} href={`/packages?id=${pkg.id}`}>
                    <PackageCard pkg={pkg} isMobile={isMobile}/>
                </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPackages.length === 0 && activeCategoryId !== 'all' && (
          <div className="no-packages-message">
            <p>There are currently no packages available for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
});

// Memoized TestimonialsSection
const TestimonialsSection = memo(function TestimonialsSection({ 
  testimonials, 
  backgroundImage 
}: { 
  testimonials: Testimonial[], 
  backgroundImage?: string 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const testimonialVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
  }), []);

  if (testimonials.length === 0) return null;
  
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className="homepage-testimonials-section py-28 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-12 text-center relative">
        <Quote className="w-16 h-16 md:w-20 md:h-20 mb-6 mx-auto text-primary/30" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={testimonialVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[12rem]"
          >
            <p className="text-2xl md:text-3xl font-light leading-snug md:leading-tight mb-8 text-foreground text-body">
              "{currentTestimonial.text}"
            </p>
            <p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground text-body">
              {currentTestimonial.author}, <span className="font-light normal-case opacity-80">{currentTestimonial.location}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      
        {testimonials.length > 1 && (
          <div className="mt-12 flex justify-center gap-3 z-20">
            <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full">
              <ArrowLeft />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});

    