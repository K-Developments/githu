
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
  backgroundUrl: string;
  videoUrl: string;
  imageUrl1: string;
  imageUrl2: string;
}

export default function AdminHomePage() {
  const [heroData, setHeroData] = useState<HeroData>({
    headline: "",
    description: "",
    buttonPrimary: "",
    buttonSecondary: "",
    backgroundUrl: "",
    videoUrl: "",
    imageUrl1: "",
    imageUrl2: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data().hero as HeroData);
        } else {
          console.log("No such document! Using default values.");
          // Set default values if document doesn't exist
          setHeroData({
            headline: "Curated Luxury Travel Experiences",
            description: "Where exceptional service meets breathtaking destinations. Your private escape awaits beyond the ordinary.",
            buttonPrimary: "Explore Collections",
            buttonSecondary: "Book Consultation",
            backgroundUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            videoUrl: "https://placehold.co/600x400.mp4/EAE3A4/287289?text=Tropical+Escape",
            imageUrl1: "https://placehold.co/400x400.png",
            imageUrl2: "https://placehold.co/300x300.png",
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch homepage data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setHeroData(prevData => ({
        ...prevData,
        [id]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      const docRef = doc(db, "content", "home");
      await setDoc(docRef, { hero: heroData }, { merge: true });
      toast({
        title: "Success",
        description: "Home page content has been saved.",
      });
    } catch (error) {
      console.error("Error saving hero data:", error);
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
          <CardTitle>Home Page Settings</CardTitle>
          <CardDescription>Update the content of the home page hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={heroData.headline} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={heroData.description} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buttonPrimary">Primary Button Text</Label>
              <Input id="buttonPrimary" value={heroData.buttonPrimary} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonSecondary">Secondary Button Text</Label>
              <Input id="buttonSecondary" value={heroData.buttonSecondary} onChange={handleInputChange} />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="backgroundUrl">Background Image URL</Label>
            <Input id="backgroundUrl" value={heroData.backgroundUrl} onChange={handleInputChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="videoUrl">Hero Video URL</Label>
            <Input id="videoUrl" value={heroData.videoUrl} onChange={handleInputChange} />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl1">Hero Image 1 URL</Label>
              <Input id="imageUrl1" value={heroData.imageUrl1} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl2">Hero Image 2 URL</Label>
              <Input id="imageUrl2" value={heroData.imageUrl2} onChange={handleInputChange} />
            </div>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
