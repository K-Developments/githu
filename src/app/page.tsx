
'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial, CtaData, SiteSettings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";
import { CtaSection } from "@/components/ui/cta-section";


// Define interfaces for the fetched data
interface HeroData {
  headline: string;
  description: string;
  sliderImages: string[];
  contentBackgroundImage?: string;
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

interface HomePageProps {
    siteSettings: SiteSettings | null;
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
export default function HomePage({ siteSettings }: HomePageProps) {
  const [pageData, setPageData] = useState<Awaited<ReturnType<typeof getHomePageData>> | null>(null);

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
      {quoteData && <QuoteSection data={quoteData} />}
      {destinationsData && destinations.length > 0 && <DestinationsSection sectionData={destinationsData} destinations={destinations} />}
      {categories.length > 0 && <PackagesSection categories={categories} packages={packages} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {ctaData && <CtaSection data={ctaData} />}
      <NewsletterSection backgroundImage={siteSettings?.newsletterBackgroundImage}/>
    </>
  );
}

// --- Sub-components for each section ---

function HeroSection({ data }: { data: HeroData }) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (data.sliderImages.length > 1) {
            const timer = setTimeout(() => {
                setCurrentImage((prevIndex) => (prevIndex + 1) % data.sliderImages.length);
            }, 5000); // Change image every 5 seconds
            return () => clearTimeout(timer);
        }
    }, [currentImage, data.sliderImages.length]);
    
  return (
    <section className="hero">
        <div 
            className="hero-content"
            style={{
                backgroundImage: data.contentBackgroundImage ? `url(${data.contentBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
          
            <h1 
                dangerouslySetInnerHTML={{ __html: data.headline }} 
                className="relative z-10"
            />
        </div>

        {/* Mobile Hero Image */}
        <div className="hero-image md:hidden">
            {data.sliderImages.map((src, index) => (
            <div key={index} className={`fade-image ${index === currentImage ? 'active' : ''}`}>
                <Image 
                    src={src || "https://placehold.co/1920x1080.png"} 
                    alt="Luxury travel destination" 
                    fill
                    priority={index === 0}
                    style={{ objectFit: 'cover' }}
                    sizes="100vw" 
                />
            </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        {/* Desktop Scrolling Grid */}
        <div className="hero-image hidden md:block">
            <div className="scrolling-grid-container">
                <div className="scrolling-grid">
                    {data.sliderImages.map((src, index) => (
                        <div key={`grid-1-${index}`} className="image-wrapper">
                            <Image 
                                src={src || "https://placehold.co/800x600.png"} 
                                alt={`Luxury travel destination ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="33.3vw"
                            />
                        </div>
                    ))}
                </div>
                 <div className="scrolling-grid">
                    {data.sliderImages.map((src, index) => (
                        <div key={`grid-2-${index}`} className="image-wrapper">
                            <Image 
                                src={src || "https://placehold.co/800x600.png"} 
                                alt={`Luxury travel destination ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="33.3vw"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </section>
  );
}


function IntroSection({ data, backgroundImage }: { data: IntroData, backgroundImage?: string }) {
  return (
    <section 
        className="intro-home"
        style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    >
        <div className="intro-container">
            <div className="intro-text-content">
              <ScrollAnimation>
                <h2 className="secondary-heading" dangerouslySetInnerHTML={{ __html: data.headline }} />
              </ScrollAnimation>
              <ScrollAnimation>
                <p className="paragraph-style">{data.paragraph}</p>
              </ScrollAnimation>
              <ScrollAnimation>
                <Link href={data.linkUrl || '#'} className="link-to">{data.linkText}</Link>
              </ScrollAnimation>
            </div>
            <div className="intro-image-cluster">
              <ScrollAnimation>
                <div className="image-landscape-wrapper">
                    <Image src={data.landscapeImage || "https://placehold.co/1000x662.png"} alt="Scenic landscape" width={1000} height={662} sizes="(min-width: 768px) 45vw, 90vw"/>
                </div>
              </ScrollAnimation>
              <ScrollAnimation>
                <div className="image-portrait-wrapper">
                    <Image src={data.portraitImage || "https://placehold.co/800x1000.png"} alt="Scenic portrait" width={800} height={1000} sizes="(min-width: 768px) 25vw, 40vw" />
                </div>
              </ScrollAnimation>
            </div>
        </div>
    </section>
  );
}

function QuoteSection({ data }: { data: QuoteData }) {
  return (
    <section className="quote-section" style={{ backgroundImage: `url(${data.image})` }}>
        <div className="overlay"></div>
        <ScrollAnimation>
          <p className="quote-text">{data.text}</p>
        </ScrollAnimation>
    </section>
  );
}

function DestinationsSection({ sectionData, destinations }: { sectionData: DestinationsData, destinations: Destination[] }) {
  return (
    <section className="destinations-section">
      <ScrollAnimation>
        <h2 className="section-title">{sectionData.title}</h2>
      </ScrollAnimation>
      <ScrollAnimation>
        <p className="section-subtitle">{sectionData.subtitle}</p>
      </ScrollAnimation>
      <div className="destinations-grid">
        {destinations.map((dest, i) => (
          <ScrollAnimation key={dest.id} delay={i * 0.1}>
            <div className="destination-card">
              <Link href={dest.linkUrl || `/destinations/${dest.id}`} passHref>
                <>
                  <h3 className="card-title-absolute">{dest.title}</h3>
                  <Image src={dest.image || "https://placehold.co/600x800.png"} alt={dest.title} fill style={{ objectFit: 'cover' }} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 45vw, 45vw" />
                  <div className="card-content">
                      <span className="card-location">{dest.location}</span>
                      <h3 className="card-title card-title-decorated">{dest.title}</h3>
                      <p className="card-description">{dest.description}</p>
                  </div>
                </>
              </Link>
            </div>
          </ScrollAnimation>
        ))}
      </div>
      <ScrollAnimation>
        <div className="rotated-view-all-wrapper">
          <Button asChild variant="outline" size="lg">
            <Link href={sectionData.buttonUrl || '#'}>View All</Link>
          </Button>
        </div>
      </ScrollAnimation>
    </section>
  );
}


function PackagesSection({ categories, packages }: { categories: Category[], packages: Package[] }) {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

    const displayCategories = React.useMemo(() => {
        return [{ id: 'all', name: 'Our Packages' }, ...categories];
    }, [categories]);

    const handleNextCategory = () => {
        setActiveCategoryIndex((prev) => (prev + 1) % displayCategories.length);
    };

    const handlePrevCategory = () => {
        setActiveCategoryIndex((prev) => (prev - 1 + displayCategories.length) % displayCategories.length);
    };

    const activeCategory = displayCategories[activeCategoryIndex];
    const filteredPackages = activeCategory.id === 'all'
        ? packages
        : packages.filter(p => p.categoryId === activeCategory.id);

  return (
    <section className="homepage-packages-section">
      <div className="packages-container">
        <ScrollAnimation>
            <div className="packages-header-desktop">
                <div className="button-wrapper-for-border">
                    <Button variant="outline" size="icon" onClick={handlePrevCategory} disabled={displayCategories.length <= 1}>
                        <ArrowLeft />
                    </Button>
                </div>
                <h2 className="packages-category-title">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeCategory ? activeCategory.id : 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                        {activeCategory ? activeCategory.name : "Packages"}
                        </motion.span>
                    </AnimatePresence>
                </h2>
                <div className="button-wrapper-for-border">
                    <Button variant="outline" size="icon" onClick={handleNextCategory} disabled={displayCategories.length <= 1}>
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </ScrollAnimation>

        <ScrollAnimation>
            <div className="packages-header-mobile">
                <h2 className="packages-category-title">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeCategory ? activeCategory.id : 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                        {activeCategory ? activeCategory.name : "Packages"}
                        </motion.span>
                    </AnimatePresence>
                </h2>
                <div className="packages-nav-buttons">
                    <div className="button-wrapper-for-border">
                        <Button variant="outline" size="icon" onClick={handlePrevCategory} disabled={displayCategories.length <= 1}>
                            <ArrowLeft />
                        </Button>
                    </div>
                    <div className="button-wrapper-for-border">
                        <Button variant="outline" size="icon" onClick={handleNextCategory} disabled={displayCategories.length <= 1}>
                            <ArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
        </ScrollAnimation>


        <motion.div 
            className={cn(
                "packages-grid",
                 filteredPackages.length === 1 && "md:grid-cols-1"
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
                                <Button asChild variant="outline" size="sm" className="w-auto"><Link href={`/packages?open=${pkg.id}`}>View Details</Link></Button>
                              </div>
                            </div>
                        </div>
                    </motion.div>
                    {index < filteredPackages.length - 1 && (
                        <Separator className="packages-divider" />
                     )}
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


function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
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

    const testimonialVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -15, transition: { duration: 0.4 } },
    };

    return (
        <section className="homepage-testimonials-section">
            <ScrollAnimation>
                <div className="testimonial-container">
                    {testimonials.length > 1 && (
                        <Button variant="ghost" size="icon" className="testimonial-arrow" onClick={handlePrev}>
                            <ArrowLeft />
                        </Button>
                    )}

                    <div className="testimonial-content-wrapper">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                variants={testimonialVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="testimonial-content"
                            >
                                <Quote className="testimonial-quote-icon" />
                                <p className="testimonial-text">{testimonials[currentIndex].text}</p>
                                <p className="testimonial-author">{testimonials[currentIndex].author}, {testimonials[currentIndex].location}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {testimonials.length > 1 && (
                        <Button variant="ghost" size="icon" className="testimonial-arrow" onClick={handleNext}>
                            <ArrowRight />
                        </Button>
                    )}
                </div>
            </ScrollAnimation>
            {testimonials.length > 1 && (
                <ScrollAnimation>
                    <div className="testimonial-pagination">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`testimonial-bullet ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </ScrollAnimation>
            )}
        </section>
    );
}

function NewsletterSection({ backgroundImage }: { backgroundImage?: string }) {
    return (
        <section 
            className="newsletter-section"
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="newsletter-container">
                <ScrollAnimation>
                  <h2 className="section-title">Join Our Journey</h2>
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
        </section>
    );
}

    