
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminHomePage() {
  const [heroData, setHeroData] = useState<HeroData>({
    headline: "",
    description: "",
    buttonPrimary: "",
    buttonSecondary: "",
    sliderImages: ["", "", ""],
  });
  const [introData, setIntroData] = useState<IntroData>({
    headline: "",
    paragraph: "",
    linkText: "",
    portraitImage: "",
    landscapeImage: "",
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Set Hero Data
          const hero = (data.hero || {}) as HeroData;
          const images = hero.sliderImages || [];
          while (images.length < 3) {
            images.push("");
          }
          setHeroData({ ...hero, sliderImages: images.slice(0, 3) });

          // Set Intro Data
          const intro = (data.intro || {}) as IntroData;
          setIntroData(intro);

        } else {
          console.log("No such document! Using default values.");
          // Set default values if document doesn't exist
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
        console.error("Error fetching content data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch homepage data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [toast]);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setHeroData(prevData => ({ ...prevData, [id]: value }));
  };
  
  const handleImageChange = (index: number, value: string) => {
    const newSliderImages = [...heroData.sliderImages];
    newSliderImages[index] = value;
    setHeroData(prevData => ({ ...prevData, sliderImages: newSliderImages }));
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setIntroData(prevData => ({ ...prevData, [id]: value.replace(/\\n/g, '\n') }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "content", "home");
      await setDoc(docRef, { hero: heroData, intro: introData }, { merge: true });
      toast({
        title: "Success",
        description: "Home page content has been saved.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save homepage data.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your website content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home Page Hero Section</CardTitle>
          <CardDescription>Update the content of the hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={heroData.headline} onChange={handleHeroChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={heroData.description} onChange={handleHeroChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buttonPrimary">Primary Button Text</Label>
              <Input id="buttonPrimary" value={heroData.buttonPrimary} onChange={handleHeroChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonSecondary">Secondary Button Text</Label>
              <Input id="buttonSecondary" value={heroData.buttonSecondary} onChange={handleHeroChange} />
            </div>
          </div>
           <div className="space-y-4">
            <Label>Slider Images</Label>
            {heroData.sliderImages.map((url, index) => (
                 <div className="space-y-2" key={index}>
                    <Label htmlFor={`sliderImage${index + 1}`}>Image {index + 1} URL</Label>
                    <Input 
                        id={`sliderImage${index + 1}`} 
                        value={url} 
                        onChange={(e) => handleImageChange(index, e.target.value)} />
                </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Intro Section</CardTitle>
            <CardDescription>Update the content for the intro section below the hero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="introHeadline">Headline</Label>
                <Textarea id="headline" value={introData.headline} onChange={handleIntroChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paragraph">Paragraph</Label>
                <Textarea id="paragraph" rows={5} value={introData.paragraph} onChange={handleIntroChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="linkText">Link Text</Label>
                <Input id="linkText" value={introData.linkText} onChange={handleIntroChange} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="portraitImage">Portrait Image URL</Label>
                    <Input id="portraitImage" value={introData.portraitImage} onChange={handleIntroChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="landscapeImage">Landscape Image URL</Label>
                    <Input id="landscapeImage" value={introData.landscapeImage} onChange={handleIntroChange} />
                </div>
            </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save All Changes</Button>
    </div>
  );
}
