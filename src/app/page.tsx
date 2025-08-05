
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial, CtaData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";


// Define interfaces for the fetched data
interface HeroData {
  headline: string;
  description: string;
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

// Main component for the homepage
export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [destinationsData, setDestinationsData] = useState<DestinationsData | null>(null);
  const [ctaData, setCtaData] = useState<CtaData | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch content from the 'home' document
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          setHeroData(data.hero as HeroData);
          setIntroData(data.intro as IntroData);
          setQuoteData(data.quote as QuoteData);
          setDestinationsData(data.destinations as DestinationsData);
          const cta = data.cta as CtaData;
          if (cta && !cta.interactiveItems) {
            cta.interactiveItems = [];
          }
          setCtaData(cta);
        }

        // Fetch collections
        const destinationsSnap = await getDocs(collection(db, "destinations"));
        setDestinations(destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination)));

        const categoriesSnap = await getDocs(collection(db, "categories"));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

        const packagesSnap = await getDocs(collection(db, "packages"));
        setPackages(packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package)));

        const testimonialsSnap = await getDocs(collection(db, "testimonials"));
        setTestimonials(testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      {heroData && <HeroSection data={heroData} />}
      {introData && <IntroSection data={introData} />}
      {quoteData && <QuoteSection data={quoteData} />}
      {destinationsData && destinations.length > 0 && <DestinationsSection sectionData={destinationsData} destinations={destinations} />}
      {categories.length > 0 && <PackagesSection categories={categories} packages={packages} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {ctaData && <HomePageCallToActionSection data={ctaData} />}
      <NewsletterSection />
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
        <div className="hero-content">
            <h1 dangerouslySetInnerHTML={{ __html: data.headline }} />
            <p>{data.description}</p>
        </div>
      <div className="hero-image">
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
      </div>
      {data.sliderImages.length > 1 && (
        <div className="pagination-bullets">
            {data.sliderImages.map((_, index) => (
                <button
                    key={index}
                    className={`pagination-bullet ${index === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      )}
    </section>
  );
}


function IntroSection({ data }: { data: IntroData }) {
  return (
    <section className="intro-home">
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
                  <h3 className="card-title card-title-absolute">{dest.title}</h3>
                  <Image src={dest.image || "https://placehold.co/600x800.png"} alt={dest.title} fill style={{ objectFit: 'cover' }} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 45vw, 45vw" data-ai-hint={dest.imageHint}/>
                  <div className="card-content">
                      <span className="card-location">{dest.location}</span>
                      <h3 className="card-title card-title-decorated">{dest.title}</h3>
                      <p className="card-description">{dest.description}</p>
                  </div>
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
                                data-ai-hint={(pkg.imageHints && pkg.imageHints[0]) || ''}
                            />
                        </div>
                        <div className="card-details">
                            <h3 className="card-title">{pkg.title}</h3>
                            <p className="card-description">{pkg.description}</p>
                            <div className="flex justify-center">
                              <div className="button-wrapper-for-border">
                                <Button asChild variant="outline" size="sm" className="w-auto"><a href={pkg.linkUrl || `/packages/${pkg.id}`}>View Details</a></Button>
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

function HomePageCallToActionSection({ data }: { data: CtaData }) {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const getBackgroundImage = () => {
        if (hoveredItem !== null && data.interactiveItems && data.interactiveItems[hoveredItem]) {
            return data.interactiveItems[hoveredItem].backgroundImage;
        }
        return data.backgroundImage;
    };
    
    const interactiveItems = data.interactiveItems || [];

    return (
        <section className="home-page-call-to-action-section">
            <AnimatePresence>
                <motion.div
                    key={getBackgroundImage()}
                    className="cta-background-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <Image 
                        src={getBackgroundImage() || "https://placehold.co/1920x1080.png"} 
                        alt="Serene travel destination" 
                        fill 
                        className="object-cover" 
                        data-ai-hint="tropical beach"
                    />
                </motion.div>
            </AnimatePresence>
            <div className="cta-overlay"></div>

            <div className="cta-content-container">
                <ScrollAnimation>
                    <div className="cta-content">
                        <h2 className="cta-title">{data.title}</h2>
                        <div className="button-wrapper-for-border">
                            <Button asChild size="lg" className="w-full">
                                <a href={data.buttonUrl}>{data.buttonText}</a>
                            </Button>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
            
            <ScrollAnimation className="cta-interactive-panel" onMouseLeave={() => setHoveredItem(null)}>
                {interactiveItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.linkUrl || '#'}
                        className="cta-interactive-item"
                        onMouseEnter={() => setHoveredItem(index)}
                    >
                        <h3 className="cta-item-title">{item.title}</h3>
                        <p className="cta-item-description">{item.description}</p>
                    </Link>
                ))}
            </ScrollAnimation>

            <div className="cta-mobile-panel">
                {interactiveItems.map((item, index) => (
                    <Link key={index} href={item.linkUrl || '#'} className="cta-mobile-card">
                        <Image 
                            src={item.backgroundImage || "https://placehold.co/1920x1080.png"} 
                            alt={item.title}
                            fill
                            className="object-cover -z-10"
                        />
                        <div className="cta-mobile-card-overlay"></div>
                        <h3 className="cta-item-title">{item.title}</h3>
                        <p className="cta-item-description">{item.description}</p>
                    </Link>
                ))}
            </div>

        </section>
    );
}


function NewsletterSection() {
    return (
        <section className="newsletter-section">
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

    