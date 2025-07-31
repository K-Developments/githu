
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface HeroData {
  headline: string;
  description: string;
  buttonPrimary: string;
  buttonSecondary: string;
  sliderImages: string[];
}

interface IntroData {
  headline: string;
  paragraph: string;
  linkText: string;
  portraitImage: string;
  landscapeImage: string;
}

export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const hero = data.hero as HeroData;
          const intro = data.intro as IntroData;
          
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
        } else {
           setHeroData({
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
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
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


  if (!heroData || !introData) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#f8f5f2]">Loading...</div>;
  }

  const validImages = heroData.sliderImages?.filter(url => url) || [];

  return (
    <>
      <header>
        <a href="#" className="logo">ISLAND<span>HOPES</span></a>
        <nav>
          <ul>
            <li><a href="#">Destinations</a></li>
            <li><a href="#">Experiences</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#" className="cta-button">Plan Trip</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section className="hero">
          <div className="hero-image">
              {validImages.map((url, index) => (
                <div
                  key={index}
                  className={`fade-image ${index === currentImageIndex ? 'active' : ''}`}
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
            <h1 dangerouslySetInnerHTML={{ __html: heroData.headline }}></h1>
            <p>{heroData.description}</p>
            <div className="hero-buttons">
              <button className="hero-button">{heroData.buttonPrimary}</button>
              <a href="#" className="secondary-button">{heroData.buttonSecondary}</a>
            </div>
          </div>
        </section>

        <section className="intro-home">
            <div className="intro-container">
                <div className="wrap-image-portrait">
                    <div className="image">
                        <Image 
                          alt="Inspiring travel portrait" 
                          src={introData.portraitImage} 
                          width={800} 
                          height={1000} 
                          data-ai-hint="travel portrait" />
                    </div>
                </div>
                <div className="wrap-text-and-landscape">
                    <h2 className="secondary-heading" dangerouslySetInnerHTML={{ __html: introData.headline }}></h2>
                    <p className="paragraph-style" dangerouslySetInnerHTML={{ __html: introData.paragraph.replace(/\n/g, '<br />') }}></p>
                    <a className="link-to" href="#">{introData.linkText}</a>
                    <div className="image">
                        <Image 
                          alt="Inspiring travel landscape" 
                          src={introData.landscapeImage} 
                          width={1000} 
                          height={662}
                          data-ai-hint="travel landscape" />
                    </div>
                </div>
            </div>
        </section>

      </main>
    </>
  );
}
