
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Define interfaces for the fetched data
interface HeroData {
  headline: string;
  description: string;
  sliderImages: string[];
}

interface IntroData {
  headline: string;
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
      {categories.length > 0 && packages.length > 0 && <PackagesSection categories={categories} packages={packages} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
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
                <h2 className="secondary-heading" dangerouslySetInnerHTML={{ __html: data.headline }} />
                <p className="paragraph-style">{data.paragraph}</p>
                <Link href={data.linkUrl || '#'} className="link-to">{data.linkText}</Link>
            </div>
            <div className="intro-image-cluster">
                <div className="image-landscape-wrapper">
                    <Image src={data.landscapeImage || "https://placehold.co/1000x662.png"} alt="Scenic landscape" width={1000} height={662} sizes="(min-width: 768px) 45vw, 90vw"/>
                </div>
                <div className="image-portrait-wrapper">
                    <Image src={data.portraitImage || "https://placehold.co/800x1000.png"} alt="Scenic portrait" width={800} height={1000} sizes="(min-width: 768px) 25vw, 40vw" />
                </div>
            </div>
        </div>
    </section>
  );
}

function QuoteSection({ data }: { data: QuoteData }) {
  return (
    <section className="quote-section" style={{ backgroundImage: `url(${data.image})` }}>
        <div className="overlay"></div>
        <p className="quote-text">{data.text}</p>
    </section>
  );
}

function DestinationsSection({ sectionData, destinations }: { sectionData: DestinationsData, destinations: Destination[] }) {
  return (
    <section className="destinations-section">
      <h2 className="section-title">{sectionData.title}</h2>
      <p className="section-subtitle">{sectionData.subtitle}</p>
      <div className="destinations-grid">
        {destinations.map(dest => (
          <div key={dest.id} className="destination-card">
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
        ))}
      </div>
      <div className="rotated-view-all-wrapper">
        <Button asChild variant="outline" size="lg">
          <Link href={sectionData.buttonUrl || '#'}>View All</Link>
        </Button>
      </div>
    </section>
  );
}


function PackagesSection({ categories, packages }: { categories: Category[], packages: Package[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [activePackageIndex, setActivePackageIndex] = useState(0);

  const filteredPackages = packages.filter(p => p.categoryId === activeCategory);
  const activePackage = filteredPackages[activePackageIndex];

  const handleNextPackage = () => {
    setActivePackageIndex(prev => (prev + 1) % filteredPackages.length);
  };
  const handlePrevPackage = () => {
    setActivePackageIndex(prev => (prev - 1 + filteredPackages.length) % filteredPackages.length);
  };
  
  useEffect(() => {
    setActivePackageIndex(0);
  }, [activeCategory]);

  if (categories.length === 0 || packages.length === 0) return null;

  return (
    <section className="homepage-packages-section">
        <div className="packages-container">
             <div className="packages-header-desktop">
                {categories.map((cat, index) => (
                    <React.Fragment key={cat.id}>
                        <Button
                            variant={activeCategory === cat.id ? "default" : "ghost"}
                            onClick={() => { setActiveCategory(cat.id); }}
                        >
                            {cat.name}
                        </Button>
                        {index < categories.length - 1 && <div className="h-6 w-px bg-border" />}
                    </React.Fragment>
                ))}
            </div>
             <div className="packages-header-mobile">
                <h3 className="packages-category-title">{categories.find(c => c.id === activeCategory)?.name}</h3>
                <div className="packages-nav-buttons">
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            size="sm"
                            variant={activeCategory === cat.id ? "default" : "outline"}
                            onClick={() => { setActiveCategory(cat.id); }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="packages-grid">
              {filteredPackages.length > 0 && activePackage ? (
                  <div className="package-display-card">
                      <div className="card-image">
                          <Image src={activePackage.images?.[0] || 'https://placehold.co/800x600.png'} alt={activePackage.title} fill style={{objectFit:'cover'}} sizes="90vw" data-ai-hint={activePackage.imageHints?.[0]} />
                      </div>
                      <div className="card-details">
                          <h4 className="card-title">{activePackage.title}</h4>
                          <p className="card-description">{activePackage.description}</p>
                          <div className="flex justify-between items-center">
                            <Button asChild>
                              <Link href={activePackage.linkUrl || `/packages/${activePackage.id}`}>Explore Package</Link>
                            </Button>
                            {filteredPackages.length > 1 && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={handlePrevPackage} aria-label="Previous Package"><ChevronLeft/></Button>
                                    <Button variant="outline" size="icon" onClick={handleNextPackage} aria-label="Next Package"><ChevronRight/></Button>
                                </div>
                            )}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="no-packages-message">
                      <p>No packages available in this category.</p>
                  </div>
              )}
            </div>
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

    const activeTestimonial = testimonials[currentIndex];

    return (
        <section className="homepage-testimonials-section">
            <div className="testimonial-container">
                {testimonials.length > 1 && (
                    <Button variant="ghost" size="icon" className="testimonial-arrow" onClick={handlePrev}>
                        <ArrowLeft />
                    </Button>
                )}

                <div className="testimonial-content-wrapper">
                    <div className="testimonial-content">
                        <Quote className="testimonial-quote-icon" />
                        <p className="testimonial-text">{activeTestimonial.text}</p>
                        <p className="testimonial-author">{activeTestimonial.author}, {activeTestimonial.location}</p>
                    </div>
                </div>

                {testimonials.length > 1 && (
                    <Button variant="ghost" size="icon" className="testimonial-arrow" onClick={handleNext}>
                        <ArrowRight />
                    </Button>
                )}
            </div>
            {testimonials.length > 1 && (
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
            )}
        </section>
    );
}

function NewsletterSection() {
    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <h2 className="section-title">Join Our Journey</h2>
                <p className="newsletter-subtitle">
                    Sign up for our newsletter to receive the latest travel inspiration, exclusive offers, and updates from the world of luxury travel.
                </p>
                <form className="newsletter-form">
                    <Input type="email" placeholder="Enter your email address" className="newsletter-input" />
                    <div className="button-wrapper-for-border">
                        <Button type="submit" size="lg" className="w-full">Subscribe</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
