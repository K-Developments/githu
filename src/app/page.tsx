
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import type { Package, Destination, Category } from "@/lib/data";
import { Search, Menu, ArrowLeft, ArrowRight } from "lucide-react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface HeroData {
  headline: string;
  description: string;
  sliderImages: string[];
}

interface IntroData {
  headline: string;
  paragraph: string;
  linkText: string;
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
}

const DestinationCard = ({ destination }: { destination: Destination }) => {
    return (
        <div className="destination-card noise-overlay">
            <a href={`/destinations/${destination.id}`}>
                <Image
                    src={destination.image}
                    alt={`View of ${destination.title}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint={destination.imageHint}
                />
                <div className="card-content">
                    <p className="card-location">{destination.location}</p>
                    <h3 className="card-title card-title-decorated">{destination.title}</h3>
                    <p className="card-description">{destination.description}</p>
                </div>
            </a>
        </div>
    );
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [destinationsData, setDestinationsData] = useState<DestinationsData | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activePackages, setActivePackages] = useState<Package[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const allPackagesCategory: Category = { id: 'all', name: 'All Packages' };


  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = data.hero as HeroData;
          const intro = data.intro as IntroData;
          const quote = data.quote as QuoteData;
          const destinations = data.destinations as DestinationsData;
          
           const images = hero.sliderImages && Array.isArray(hero.sliderImages) && hero.sliderImages.length > 0
           ? hero.sliderImages
           : [
               "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
               "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
               "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
             ];
          setHeroData({ ...hero, sliderImages: images });
          setIntroData(intro || {
            headline: "Magical memories,<br>Bespoke experiences",
            paragraph: "Once you have travelled the voyage never ends. Island Hopes will open a world of wonders and create magical memories that will stay with you far beyond your travels.\n\nDiverge from the typical tourist destinations in favour of unique, authentic experiences. Experiences designed in the most inspiring surroundings that will be yours, and yours only. Journeys that create memorable moments and Island Hopes’s bespoke itineraries will make this happen. The wonders of the world are within your reach.",
            linkText: "Meet our team",
            portraitImage: "https://placehold.co/800x1000.png",
            landscapeImage: "https://placehold.co/1000x662.png",
          });
           setQuoteData(quote || {
            text: '"The world is a book and those who do not travel read only one page."',
            image: "https://placehold.co/1920x600.png",
          });
          setDestinationsData(destinations || {
            title: "Our Favourite Destinations",
            subtitle: "A curated selection of the world's most enchanting islands, waiting to be discovered.",
          });
        } else {
           setHeroData({
            headline: "Discover the <span class=\"highlight\">Extraordinary</span>",
            description: "Embark on meticulously crafted journeys to the world's most exclusive destinations. Where luxury meets adventure, and every moment becomes an unforgettable memory.",
            sliderImages: [
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            ],
          });
          setIntroData({
            headline: "Magical memories,<br>Bespoke experiences",
            paragraph: "Once you have travelled the voyage never ends. Island Hopes will open a world of wonders and create magical memories that will stay with you far beyond your travels.\n\nDiverge from the typical tourist destinations in favour of unique, authentic experiences. Experiences designed in the most inspiring surroundings that will be yours, and yours only. Journeys that create memorable moments and Island Hopes’s bespoke itineraries will make this happen. The wonders of the world are within your reach.",
            linkText: "Meet our team",
            portraitImage: "https://placehold.co/800x1000.png",
            landscapeImage: "https://placehold.co/1000x662.png",
          });
          setQuoteData({
            text: '"The world is a book and those who do not travel read only one page."',
            image: "https://placehold.co/1920x600.png",
          });
          setDestinationsData({
            title: "Our Favourite Destinations",
            subtitle: "A curated selection of the world's most enchanting islands, waiting to be discovered.",
          });
        }

        const destinationsCollectionRef = collection(db, "destinations");
        const destinationsSnap = await getDocs(destinationsCollectionRef);
        const destinationsData = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        setDestinations(destinationsData);

        const categoriesCollectionRef = collection(db, "categories");
        const categoriesSnap = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories([allPackagesCategory, ...categoriesData]);
        
        const packagesCollectionRef = collection(db, "packages");
        const packagesSnap = await getDocs(packagesCollectionRef);
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        setPackages(packagesData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const currentCategory = categories[activeCategoryIndex];
      if (currentCategory.id === 'all') {
        setActivePackages(packages);
      } else {
        const filteredPackages = packages.filter(p => p.categoryId === currentCategory.id);
        setActivePackages(filteredPackages);
      }
    } else {
        setActivePackages(packages);
    }
  }, [activeCategoryIndex, categories, packages]);


  useEffect(() => {
    if (heroData && heroData.sliderImages && heroData.sliderImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === heroData.sliderImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentImageIndex, heroData]);
  
  const handleNextCategory = () => {
    setActiveCategoryIndex(prev => (prev + 1) % categories.length);
  };

  const handlePrevCategory = () => {
    setActiveCategoryIndex(prev => (prev - 1 + categories.length) % categories.length);
  };


  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#f8f5f2]">Loading...</div>;
  }
  
  const heroContent = heroData!;
  const introContent = introData!;
  const quoteContent = quoteData!;
  const destinationsContent = destinationsData!;
  const validImages = heroContent.sliderImages?.filter(url => url) || [];
  const activeCategory = categories.length > 0 ? categories[activeCategoryIndex] : null;

  return (
    <>
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <header>
          <div className="header-left">
              <a href="#" className="logo">ISLAND<span>HOPES</span></a>
          </div>
          <div className="header-center">
              <nav className="desktop-nav">
                  <ul>
                      <li><a href="#">Destinations</a></li>
                      <li><a href="#">Experiences</a></li>
                      <li><a href="#">About</a></li>
                      <li><a href="#">Contact</a></li>
                  </ul>
              </nav>
          </div>
          <div className="header-right">
              <a href="#" className="cta-button desktop-only">Plan Trip</a>
              <button className="search-button desktop-only" aria-label="Search">
                  <Search size={20} />
              </button>
              <button onClick={() => setIsMenuOpen(true)} className="hamburger-button" aria-label="Open menu">
                  <Menu size={24} />
              </button>
          </div>
      </header>
      
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 dangerouslySetInnerHTML={{ __html: heroContent.headline }}></h1>
            <p>{heroContent.description}</p>
          </div>
          <div className="hero-image">
              {validImages.map((url, index) => (
                <div
                  key={index}
                  className={`fade-image noise-overlay ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <Image 
                    src={url}
                    alt="Luxury Travel Destination"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
              {validImages.length > 1 && (
                <div className="pagination-bullets">
                  {validImages.map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-bullet ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
          </div>
        </section>

        <section className="intro-home">
            <div className="intro-container">
                <div className="intro-text-content">
                   <h2 className="secondary-heading" dangerouslySetInnerHTML={{ __html: introContent.headline }}></h2>
                    <p className="paragraph-style">{introContent.paragraph}</p>
                    <a className="link-to" href="#">{introContent.linkText}</a>
                </div>
                 <div className="intro-image-cluster">
                    <div className="image-landscape-wrapper noise-overlay">
                        <Image 
                          alt="Inspiring travel landscape" 
                          src={introContent.landscapeImage} 
                          width={1000} 
                          height={662}
                          className="object-cover"
                          data-ai-hint="travel landscape" />
                    </div>
                    <div className="image-portrait-wrapper noise-overlay">
                        <Image 
                          alt="Inspiring travel portrait" 
                          src={introContent.portraitImage} 
                          width={800} 
                          height={1000} 
                          className="object-cover"
                          data-ai-hint="travel portrait" />
                    </div>
                </div>
            </div>
        </section>
        
        <section className="destinations-section">
            <h2 className="section-title">{destinationsContent.title}</h2>
            <p className="section-subtitle">{destinationsContent.subtitle}</p>
            <div className="destinations-grid">
                {destinations.map((dest) => (
                    <DestinationCard key={dest.id} destination={dest} />
                ))}
            </div>
        </section>

        <section className="quote-section noise-overlay" style={{ backgroundImage: `url(${quoteContent.image})` }} data-ai-hint="tropical beach">
            <div className="overlay"></div>
            <p className="quote-text">{quoteContent.text}</p>
        </section>
        
         <section className="homepage-packages-section">
            <div className="packages-container">
                <div className="packages-header">
                    <Button variant="outline" size="icon" onClick={handlePrevCategory} disabled={categories.length <= 1}>
                        <ArrowLeft />
                    </Button>
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
                    <Button variant="outline" size="icon" onClick={handleNextCategory} disabled={categories.length <= 1}>
                        <ArrowRight />
                    </Button>
                </div>

                <motion.div className="packages-grid" layout>
                    <AnimatePresence>
                        {activePackages.map((pkg, index) => (
                        <React.Fragment key={pkg.id}>
                            <motion.div 
                                className="package-display-card"
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                <div className="card-image">
                                    <Image
                                        src={pkg.images[0]}
                                        alt={pkg.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                        data-ai-hint={pkg.imageHints?.[0]}
                                    />
                                </div>
                                <div className="card-details">
                                    <h3 className="card-title">{pkg.title}</h3>
                                    <p className="card-description">{pkg.description}</p>
                                    <a href={`/packages/${pkg.id}`} className="view-button">
                                        View Details
                                    </a>
                                </div>
                            </motion.div>
                            {index < activePackages.length - 1 && (
                                <Separator className="packages-divider" />
                             )}
                        </React.Fragment>
                        ))}
                    </AnimatePresence>
                </motion.div>
                {activePackages.length === 0 && !loading && (
                    <div className="no-packages-message">
                        <p>There are currently no packages available for this category.</p>
                    </div>
                )}
            </div>
        </section>

      </main>
    </>
  );
}
