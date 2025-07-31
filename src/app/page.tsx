
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
  backgroundUrl: string; // This will now be used for the main hero image
  videoUrl: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
}


export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data().hero as HeroData);
        } else {
           setHeroData({
            headline: "Discover the <span class=\"highlight\">Extraordinary</span>",
            description: "Embark on meticulously crafted journeys to the world's most exclusive destinations. Where luxury meets adventure, and every moment becomes an unforgettable memory.",
            buttonPrimary: "Start Your Journey",
            buttonSecondary: "View Destinations",
            backgroundUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            videoUrl: "",
            imageUrl1: "",
            imageUrl2: "",
            imageUrl3: "",
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchHeroData();
  }, []);

  if (!heroData) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#f8f5f2]">Loading...</div>;
  }

  return (
    <>
      <header>
        <a href="#" className="logo">ISLAND<span>HOPES</span></a>
        <nav>
          <ul>
            <li><a href="#">Destinations</a></li>
            <li><a href="#">Experiences</a></li>
            <li><a href="#">Packages</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#" className="cta-button">Plan Trip</a></li>
          </ul>
        </nav>
      </header>
      
      <section className="hero">
        <div className="hero-image">
          <Image 
            src={heroData.backgroundUrl} 
            alt="Luxury Travel Destination"
            width={2070}
            height={1380}
            priority
          />
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
    </>
  );
}
