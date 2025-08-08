

'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial, CtaData, SiteSettings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ArrowDown, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";
import { CtaSection } from "@/components/ui/cta-section";
import { useSiteSettings } from "@/context/site-settings-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";


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

interface FeaturedPackagesData {
    packageIds: string[];
}

interface FeaturedDestinationsData {
    destinationIds: string[];
}

async function getHomePageData() {
    try {
        // Fetch content from the 'home' document
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        
        let heroData: HeroData | null = null;
        let introData: IntroData | null = null;
        let quoteData: QuoteData | null = null;
        let destinationsData: DestinationsData | null = null;
        let ctaData: CtaData | null = null;
        let featuredPackageIds: string[] = [];
        let featuredDestinationIds: string[] = [];

        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          heroData = data.hero as HeroData;
          introData = data.intro as IntroData;
          quoteData = data.quote as QuoteData;
          destinationsData = data.destinations as DestinationsData;
          const cta = data.cta as CtaData;
          if (cta && !cta.interactiveItems) {
            cta.interactiveItems = [];
          }
          ctaData = cta;
          const featuredPackages = data.featuredPackages as FeaturedPackagesData;
          if (featuredPackages && featuredPackages.packageIds) {
            featuredPackageIds = featuredPackages.packageIds;
          }
          const featuredDestinations = data.featuredDestinations as FeaturedDestinationsData;
          if (featuredDestinations && featuredDestinations.destinationIds) {
            featuredDestinationIds = featuredDestinations.destinationIds;
          }
        }

        let destinations: Destination[] = [];
        if (featuredDestinationIds.length > 0) {
            const destinationsQuery = query(collection(db, "destinations"), where('__name__', 'in', featuredDestinationIds));
            const destinationsSnap = await getDocs(destinationsQuery);
            destinations = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        }

        const categoriesSnap = await getDocs(collection(db, "categories"));
        const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        let packages: Package[] = [];
        if (featuredPackageIds.length > 0) {
            const packagesQuery = query(collection(db, "packages"), where('__name__', 'in', featuredPackageIds));
            const packagesSnap = await getDocs(packagesQuery);
            packages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        }

        const testimonialsSnap = await getDocs(collection(db, "testimonials"));
        const testimonials = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));

        return {
          heroData,
          introData,
          quoteData,
          destinationsData,
          ctaData,
          destinations,
          packages,
          categories,
          testimonials,
        };

      } catch (error) {
        console.error("Error fetching homepage data:", error);
        return {
            heroData: null,
            introData: null,
            quoteData: null,
            destinationsData: null,
            ctaData: null,
            destinations: [],
            packages: [],
            categories: [],
            testimonials: [],
        }
      }
}


// Main component for the homepage
export default function HomePage() {
  const [pageData, setPageData] = useState<Awaited<ReturnType<typeof getHomePageData>> | null>(null);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    getHomePageData().then(data => setPageData(data));
  }, []);

  if (!pageData) {
    return null; // Or a loading spinner
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

  if (!heroData) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Could not load page content. Please try again later.</p>
        </div>
    )
  }

  return (
    <>
      <HeroSection data={heroData} />
      {introData && <IntroSection data={introData} backgroundImage={siteSettings?.introBackgroundImage} />}
      {quoteData && <QuoteSection data={quoteData} backgroundImage={siteSettings?.quoteBackgroundImage} />}
      {destinationsData && destinations.length > 0 && <DestinationsSection sectionData={destinationsData} destinations={destinations} backgroundImage={siteSettings?.destinationsBackgroundImage} />}
      {packages.length > 0 && categories.length > 0 && <PackagesSection categories={categories} packages={packages} backgroundImage={siteSettings?.packagesBackgroundImage} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} backgroundImage={siteSettings?.testimonialsBackgroundImage} />}
      {ctaData && <CtaSection data={ctaData} />}
      <NewsletterSection backgroundImage={siteSettings?.newsletterBackgroundImage}/>
    </>
  );
}

// --- Sub-components for each section ---

function HeroSection({ data }: { data: HeroData }) {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (isMobile) {
            const timer = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % (data.sliderImages?.length || 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [data.sliderImages, isMobile]);

    return (
        <section ref={containerRef} className="hero">
            <div 
                className="hero-content"
            >
                 <h1 dangerouslySetInnerHTML={{ __html: data.headline }} />
                 <div className="flex flex-row-reverse  items-end gap-4">
                    {data.subtitle && (
                        <p className="text-right max-w-xs text-lg text-black" style={{ fontVariant: 'small-caps' }}>{data.subtitle}</p>
                    )}
                    <button 
                        onClick={() => {
                            const nextSection = containerRef.current?.nextElementSibling;
                            nextSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="border rounded-full h-14 w-14 flex items-center justify-center hover:bg-white/10 transition-colors text-black"
                        aria-label="Scroll down"
                    >
                        <ArrowDown />
                    </button>
                 </div>
            </div>

            <div className="hero-image">
                {isMobile ? (
                    <>
                        {(data.sliderImages || []).map((src, index) => (
                            <div key={index} className={`fade-image ${index === currentImage ? 'active' : ''}`}>
                                <Image src={src} alt="" fill className="object-cover" priority={index === 0} />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="scrolling-grid-container">
                        <div className="scrolling-grid">
                            {(data.sliderImages || []).map((src, index) => (
                                <div key={`grid1-${index}`} className="image-wrapper">
                                    <Image src={src} alt="" fill className="object-cover" priority />
                                </div>
                            ))}
                        </div>
                         <div className="scrolling-grid">
                            {(data.sliderImages || []).map((src, index) => (
                                <div key={`grid2-${index}`} className="image-wrapper">
                                    <Image src={src} alt="" fill className="object-cover" priority />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}


function IntroSection({ data, backgroundImage }: { data: IntroData, backgroundImage?: string }) {
  return (
    <section
      className="intro-home py-28"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="intro-content-wrapper">
        <Separator />
        <h2
          className="secondary-heading"
          dangerouslySetInnerHTML={{ __html: data.headline }}
        />
        <Separator />
        <div className="intro-container">
            <div className="intro-text-content">
                <ScrollAnimation>
                <p className="paragraph-style">{data.paragraph}</p>
                </ScrollAnimation>
                <ScrollAnimation>
                <div className="button-wrapper-for-border">
                    <Button asChild variant="outline">
                        <Link href={data.linkUrl || '#'}>{data.linkText}</Link>
                    </Button>
                </div>
                </ScrollAnimation>
            </div>
            <div className="intro-image-cluster">
                <ScrollAnimation className="h-full">
                <div className="image-landscape-wrapper">
                    <Image
                    src={data.landscapeImage || 'https://placehold.co/1000x662.png'}
                    alt="Scenic landscape"
                    width={1000}
                    height={662}
                    sizes="(min-width: 768px) 45vw, 90vw"
                    />
                </div>
                </ScrollAnimation>
            </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ data, backgroundImage }: { data: QuoteData, backgroundImage?: string }) {
  return (
    <section className="quote-section" style={{ backgroundImage: `url(${backgroundImage || data.image})` }}>
        <div className="overlay"></div>
        <ScrollAnimation>
          <p className="quote-text">{data.text}</p>
        </ScrollAnimation>
    </section>
  );
}

function DestinationsSection({ sectionData, destinations, backgroundImage }: { sectionData: DestinationsData, destinations: Destination[], backgroundImage?: string }) {
  const [api, setApi] = React.useState<CarouselApi>()

  return (
    <section 
        className="destinations-section py-28"
        style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className=" mx-auto px-4 md:px-12">
            <Separator />
            <ScrollAnimation>
                <h2 className="section-title text-right my-8 ">{sectionData.title}</h2>
            </ScrollAnimation>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-10 gap-8 ">
                <div className="md:col-span-3">
                    <ScrollAnimation>
                        <p className="text-muted-foreground leading-relaxed mb-8 w-[90%] mt-[2rem]">{sectionData.subtitle}</p>
                    </ScrollAnimation>
                    <ScrollAnimation>
                         <div className="button-wrapper-for-border">
                            <Button asChild variant="outline">
                                <Link href={sectionData.buttonUrl || '#'}>View All Destinations</Link>
                            </Button>
                        </div>
                    </ScrollAnimation>
                </div>
                <div className="md:col-span-7">
                    <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-4">
                            {destinations.map((dest, i) => (
                                <CarouselItem key={dest.id} className="pl-4 md:basis-1/2">
                                     <ScrollAnimation delay={i * 0.1}>
                                        <div className="destination-card group h-[70vh]">
                                            <Link href={dest.linkUrl || `/destinations/${dest.id}`} passHref>
                                                <div className="relative overflow-hidden h-full">
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
                                                </div>
                                            </Link>
                                        </div>
                                    </ScrollAnimation>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="flex justify-start items-center gap-2 mt-8">
                        <div className="button-wrapper-for-border">
                            <Button variant="outline" size="icon" onClick={() => api?.scrollPrev()}>
                               <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="button-wrapper-for-border">
                            <Button variant="outline" size="icon" onClick={() => api?.scrollNext()}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}


function PackagesSection({ categories, packages, backgroundImage }: { categories: Category[], packages: Package[], backgroundImage?: string }) {
    const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

    const displayCategories = React.useMemo(() => {
        return [{ id: 'all', name: 'All' }, ...categories];
    }, [categories]);

    const filteredPackages = activeCategoryId === 'all'
        ? packages
        : packages.filter(p => p.categoryId === activeCategoryId);

  return (
    <section 
        className="homepage-packages-section py-28"
        style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
      <div className="packages-container max-w-7xl mx-auto px-4 md:px-12">
        <ScrollAnimation className="text-center">
            <Separator />
            <h2 className="section-title text-center my-8">Our Tours</h2>
            <Separator />
        </ScrollAnimation>
        
        <ScrollAnimation className="flex justify-center flex-wrap gap-2 my-8">
            {displayCategories.map(category => (
                <Button 
                    key={category.id}
                    variant={activeCategoryId === category.id ? 'default' : 'outline'}
                    onClick={() => setActiveCategoryId(category.id)}
                >
                    {category.name}
                </Button>
            ))}
        </ScrollAnimation>


        <motion.div 
            className={cn(
                "packages-grid",
                 filteredPackages.length === 1 && "md:grid-cols-1",
                 "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
            layout
        >
            <AnimatePresence>
                {filteredPackages.map((pkg, index) => (
                <React.Fragment key={pkg.id}>
                    <motion.div 
                        className={cn("package-display-card")}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                        <div className="card-image">
                            <Image
                                src={(pkg.images && pkg.images[0]) || "https://placehold.co/600x400.png"}
                                alt={`Image of ${pkg.title} package in ${pkg.location}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="card-details">
                            <h3 className="card-title">{pkg.title}</h3>
                            <p className="card-description flex-grow text-muted-foreground mb-4">{pkg.location}</p>
                            <div className="flex justify-center">
                              <div className="button-wrapper-for-border">
                                <Button asChild variant="outline" size="sm" className="w-auto"><Link href={`/packages?package=${pkg.id}`}>View Details</Link></Button>
                              </div>
                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
                ))}
            </AnimatePresence>
        </motion.div>
        {filteredPackages.length === 0 && (
            <div className="no-packages-message">
                <p>There are currently no packages available for this category.</p>
            </div>
        )}
    </div>
</section>
  );
}


function TestimonialsSection({ testimonials, backgroundImage }: { testimonials: Testimonial[], backgroundImage?: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (testimonials.length === 0) {
      return null;
    }
    
    const currentTestimonial = testimonials[currentIndex];

    const testimonialVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
    };

    return (
        <section 
            className="homepage-testimonials-section py-28 relative min-h-[70vh] md:min-h-[80vh] flex items-end justify-start p-8 md:p-16 text-white overflow-hidden"
            style={{
                backgroundImage: !currentTestimonial.image && backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
             <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={currentTestimonial.image || 'https://placehold.co/1920x1080.png'}
                        alt={`Background for testimonial by ${currentTestimonial.author}`}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
            
            <div className="relative z-20 w-[85%] md:w-4/5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={testimonialVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Quote className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-50" />
                        <p className="text-[1.2rem] md:text-4xl font-light leading-snug md:leading-tight mb-6">
                            {currentTestimonial.text}
                        </p>
                        <p className="text-lg font-semibold uppercase tracking-wider">
                            {currentTestimonial.author}, <span className="font-light normal-case opacity-80">{currentTestimonial.location}</span>
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {testimonials.length > 1 && (
                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 flex gap-3 z-20">
                    <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handlePrev}>
                        <ArrowLeft />
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleNext}>
                        <ArrowRight />
                    </Button>
                </div>
            )}
        </section>
    );
}

function NewsletterSection({ backgroundImage }: { backgroundImage?: string }) {
    return (
        <section 
            className="newsletter-section py-28"
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="newsletter-container-wrapper">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <ScrollAnimation>
                        <div className="section-title-wrapper">
                            <h2 className="section-title">Join Our Journey</h2>
                        </div>
                        </ScrollAnimation>
                        <ScrollAnimation>
                        <p className="newsletter-subtitle">
                            Sign up for our newsletter to receive the latest travel inspiration, exclusive offers, and updates from the world of luxury travel.
                        </p>
                        </ScrollAnimation>
                        <ScrollAnimation>
                        <form className="newsletter-form">
                            <Input type="email" placeholder="Enter your email address" className="newsletter-input" />
                            <div className="button-wrapper-for-border">
                                <Button type="submit" size="lg" className="w-full">Subscribe</Button>
                            </div>
                        </form>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>
        </section>
    );
}
