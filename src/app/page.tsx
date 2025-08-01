
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import type { Package } from "@/lib/data";
import { Search, Menu } from "lucide-react";
import { MobileNav } from "@/components/ui/mobile-nav";

interface HeroData {
  headline: string;
  description: string;
  buttonPrimary: string;
  buttonSecondary: string;
  sliderImages: string[];
  subtitle: string;
}

interface IntroData {
  headline: string;
  paragraph: string;
  linkText: string;
  portraitImage: string;
  landscapeImage: string;
}

interface DestinationsData {
  title: string;
  subtitle: string;
}

export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [destinationsData, setDestinationsData] = useState<DestinationsData | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          setDestinationsData(destinations || {
            title: "Our Favourite Destinations",
            subtitle: "A curated selection of the world's most enchanting islands, waiting to be discovered.",
          });
        } else {
           setHeroData({
            subtitle: "Luxury Travel Specialists",
            headline: "Discover the <span class=\"highlight\">Extraordinary</span>",
            description: "Embark on meticulously crafted journeys to the world's most exclusive destinations. Where luxury meets adventure, and every moment becomes an unforgettable memory.",
            buttonPrimary: "Start Your Journey",
            buttonSecondary: "View Destinations",
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
          setDestinationsData({
            title: "Our Favourite Destinations",
            subtitle: "A curated selection of the world's most enchanting islands, waiting to be discovered.",
          });
        }

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
    if (heroData && heroData.sliderImages && heroData.sliderImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === heroData.sliderImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentImageIndex, heroData]);


  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#f8f5f2]">Loading...</div>;
  }
  
  const heroContent = heroData!;
  const introContent = introData!;
  const destinationsContent = destinationsData!;
  const validImages = heroContent.sliderImages?.filter(url => url) || [];

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
          <div className="hero-image">
              {validImages.map((url, index) => (
                <div
                  key={index}
                  className={`fade-image noise-overlay ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <Image 
                    src={url}
                    alt="Luxury Travel Destination"
                    layout="fill"
                    objectFit="cover"
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
          <div className="hero-content">
            <div className="subtitle">{heroContent.subtitle}</div>
            <h1 dangerouslySetInnerHTML={{ __html: heroContent.headline }}></h1>
            <p>{heroContent.description}</p>
            <div className="hero-buttons">
              <button className="hero-button">{heroContent.buttonPrimary}</button>
              <a href="#" className="secondary-button">{heroContent.buttonSecondary}</a>
            </div>
          </div>
        </section>

        <section className="intro-home">
            <div className="intro-container">
                <div className="wrap-image-portrait">
                    <div className="image noise-overlay">
                        <Image 
                          alt="Inspiring travel portrait" 
                          src={introContent.portraitImage} 
                          width={800} 
                          height={1000} 
                          data-ai-hint="travel portrait" />
                    </div>
                </div>
                <div className="wrap-text-and-landscape">
                    <h2 className="secondary-heading" dangerouslySetInnerHTML={{ __html: introContent.headline }}></h2>
                    <p className="paragraph-style" dangerouslySetInnerHTML={{ __html: introContent.paragraph.replace(/\n/g, '<br />') }}></p>
                    <a className="link-to" href="#">{introContent.linkText}</a>
                    <div className="image noise-overlay">
                        <Image 
                          alt="Inspiring travel landscape" 
                          src={introContent.landscapeImage} 
                          width={1000} 
                          height={662}
                          data-ai-hint="travel landscape" />
                    </div>
                </div>
            </div>
        </section>

        <section className="destinations-section">
            <h2 className="section-title">{destinationsContent.title}</h2>
            <p className="section-subtitle">{destinationsContent.subtitle}</p>
            <div className="destinations-grid">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="destination-card noise-overlay">
                        <Image 
                            src={pkg.images[0]} 
                            alt={`View of ${pkg.title}`}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={pkg.imageHints?.[0]}
                        />
                        <div className="overlay">
                            <h3 className="card-title">{pkg.title}</h3>
                            <p className="card-location">{pkg.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>
    </>
  );
}
