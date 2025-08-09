

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
import { PackageCard } from "@/components/ui/package-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";


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

        const packagesSnap = await getDocs(collection(db, "packages"));
        const packages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));

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
                <div className="flex flex-row-reverse  items-center justify-center ">
                   
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
                    <div className="w-full h-full">
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
                    </div>
                )}
            </div>
        </section>
    );
}

function IntroSection({ data, backgroundImage }: { data: IntroData, backgroundImage?: string }) {
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ['start end', 'end start']
    });

    const scale = reducedMotion ? 1 : useTransform(scrollYProgress, [0.3, 1], [1, 1.15]);
    const textOpacity = reducedMotion ? 1 : useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
    const y = reducedMotion ? 0 : useTransform(scrollYProgress, [0.3, 1], [0, -50]);


    return (
        <section
        className="py-28"
        style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        >
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col items-center text-center">
            <ScrollAnimation>
            <h2
                className="secondary-heading text-center"
                dangerouslySetInnerHTML={{ __html: data.headline }}
            />
            </ScrollAnimation>

            <div ref={imageContainerRef} className="w-full my-12 flex justify-center">
                <div className="relative md:aspect-[16/9] aspect-[16/12] md:w-3/4 w-[90%]  overflow-hidden rounded-md">
                    <motion.div style={{ scale, y }} className="w-full h-full parallax-element">
                        <Image
                            src={data.landscapeImage || 'https://placehold.co/1200x675.png'}
                            alt="Scenic introduction landscape"
                            fill
                            sizes="(min-width: 768px) 75vw, 90vw"
                            className="object-cover"
                            data-ai-hint="elegant architecture interior"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ opacity: textOpacity }}
                    >
                        <h3 className="text-white text-3xl md:text-5xl font-headline tracking-wider">Welcome to Sri Lanka</h3>
                    </motion.div>
                </div>
            </div>
            
            <ScrollAnimation className="max-w-3xl" delay={0.2}>
                <p className="paragraph-style text-lg text-center">{data.paragraph}</p>
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
}


function QuoteSection({ data, backgroundImage }: { data: QuoteData, backgroundImage?: string }) {
return (
    <section className="quote-section py-28" style={{ backgroundImage: `url(${backgroundImage || data.image})` }}>
        <div className="overlay"></div>
        <ScrollAnimation>
        <p className="quote-text">{data.text}</p>
        </ScrollAnimation>
    </section>
);
}

function DestinationsCarouselItem({ dest, index, current, api }: { dest: Destination, index: number, current: number, api: CarouselApi | undefined }) {
    const ref = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const isCenter = index === current;
    const y = reducedMotion ? 0 : useTransform(scrollYProgress, [0, 1], [-80, 80]);


    return (
        <CarouselItem ref={ref} key={dest.id} className="pl-4 basis-[90%] md:basis-[40%] lg:basis-[30%]">
            <div className="h-[75vh] relative flex items-center justify-center">
                <div className={cn(
                    "destination-card-parallax w-full h-full transition-all duration-500 ease-in-out",
                    isCenter ? "w-full h-full" : "w-[65%] h-[65%]"
                )}>
                    <Link href={dest.linkUrl || `/destinations/${dest.id}`} passHref className="block w-full h-full">
                        <motion.div className="relative w-full h-[130%] parallax-element" style={{ y }}>
                            <Image
                                src={dest.image || "https://placehold.co/600x800.png"}
                                alt={dest.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                                className="card-image"
                            />
                        </motion.div>
                        <div className={cn(
                            "absolute bottom-0 left-0 p-6 text-left z-10 transition-opacity duration-500",
                            isCenter ? "opacity-100" : "opacity-0"
                        )}>
                            <h3 className="text-3xl font-headline text-white">{dest.title}</h3>
                            <p className="text-white/80">{dest.location}</p>
                        </div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </Link>
                </div>
            </div>
        </CarouselItem>
    )
}

function DestinationsSection({ sectionData, destinations, backgroundImage }: { sectionData: DestinationsData, destinations: Destination[], backgroundImage?: string }) {
const [api, setApi] = React.useState<CarouselApi>()
const [current, setCurrent] = React.useState(0)

const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
}, []);

React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
    api.off('select', onSelect);
    };
}, [api, onSelect]);

const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};


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
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center">{sectionData.subtitle}</p>
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
                    <DestinationsCarouselItem key={dest.id} dest={dest} index={i} current={current} api={api} />
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
        
        <div className="max-w-xl mx-auto mt-8 text-center min-h-[6rem] px-4 ">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    variants={descriptionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex items-center justify-center"
                >
                    <p className="text-muted-foreground leading-relaxed text-center w-[80%]">
                        {destinations[current]?.description}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
            <div className="button-wrapper-for-border">
                <Button variant="outline" size="icon" onClick={() => api?.scrollPrev()}>
                <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
            <div className="button-wrapper-for-border">
                <Button asChild variant="default">
                    <Link href={sectionData.buttonUrl || '#'}>View All Destinations</Link>
                </Button>
            </div>
            <div className="button-wrapper-for-border">
                <Button variant="outline" size="icon" onClick={() => api?.scrollNext()}>
                <ChevronRight className="h-4 w-4" />
                </Button>
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
    <div className="packages-container max-w-7xl mx-auto px-2 md:px-12">
        <ScrollAnimation className="text-center">
            <Separator />
            <h2 className="section-title text-center my-8">Our Tours</h2>
            <Separator />
        </ScrollAnimation>
        
        <ScrollAnimation className="flex justify-center flex-wrap gap-8 md:gap-12 my-8">
            {displayCategories.map(category => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className={cn(
                        'package-filter',
                        activeCategoryId === category.id && 'active'
                    )}
                >
                    {category.name}
                </button>
            ))}
        </ScrollAnimation>


        <motion.div 
            className="packages-grid"
            layout
        >
            <AnimatePresence>
                {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
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
                        <p className="text-2xl md:text-3xl font-light leading-snug md:leading-tight mb-8 text-foreground">
                            “{currentTestimonial.text}”
                        </p>
                        <p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
                            {currentTestimonial.author}, <span className="font-light normal-case opacity-80">{currentTestimonial.location}</span>
                        </p>
                    </motion.div>
                </AnimatePresence>
            
                {testimonials.length > 1 && (
                    <div className="mt-12 flex justify-center gap-3 z-20">
                        <Button variant="outline" size="icon" onClick={handlePrev}>
                            <ArrowLeft />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNext}>
                            <ArrowRight />
                        </Button>
                    </div>
                )}
            </div>
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
