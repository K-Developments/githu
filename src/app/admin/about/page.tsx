
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AboutHeroData {
  headline: string;
  heroImage: string;
}

interface JourneyData {
    title: string;
    image: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
}

export default function AdminAboutPage() {
  const [heroData, setHeroData] = useState<AboutHeroData>({
    headline: "",
    heroImage: "",
  });
  const [journeyData, setJourneyData] = useState<JourneyData>({
    title: "",
    image: "",
    missionTitle: "",
    missionText: "",
    visionTitle: "",
    visionText: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "about");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = (data.hero || {}) as AboutHeroData;
          setHeroData({
            headline: hero.headline || "About Us",
            heroImage: hero.heroImage || "https://placehold.co/1920x600.png",
          });

          const journey = (data.journey || {}) as JourneyData;
          setJourneyData({
            title: journey.title || "Our Journey",
            image: journey.image || "https://placehold.co/1200x800.png",
            missionTitle: journey.missionTitle || "Our Mission",
            missionText: journey.missionText || "",
            visionTitle: journey.visionTitle || "Our Vision",
            visionText: journey.visionText || "",
          });

        } else {
            // Set default values if the document doesn't exist
            setHeroData({
                headline: "About Us",
                heroImage: "https://placehold.co/1920x600.png",
            });
            setJourneyData({
                title: "Our Journey",
                image: "https://placehold.co/1200x800.png",
                missionTitle: "Our Mission",
                missionText: "",
                visionTitle: "Our Vision",
                visionText: "",
            });
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch about page data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [toast]);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setHeroData(prevData => ({ ...prevData, [id]: value }));
  };
  
  const handleJourneyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setJourneyData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const contentDocRef = doc(db, "content", "about");
      await setDoc(contentDocRef, { hero: heroData, journey: journeyData }, { merge: true });
      toast({
        title: "Success",
        description: "About page content has been saved.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel - About Page</h1>
        <p className="text-muted-foreground">Manage your about page content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Page Hero Section</CardTitle>
          <CardDescription>Update the content of the hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={heroData.headline} onChange={handleHeroChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero Image URL</Label>
            <Input id="heroImage" value={heroData.heroImage} onChange={handleHeroChange} />
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Our Journey Section</CardTitle>
          <CardDescription>Update the content of the journey section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input id="title" value={journeyData.title} onChange={handleJourneyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Main Image URL</Label>
            <Input id="image" value={journeyData.image} onChange={handleJourneyChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="missionTitle">Mission Title</Label>
              <Input id="missionTitle" value={journeyData.missionTitle} onChange={handleJourneyChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionTitle">Vision Title</Label>
              <Input id="visionTitle" value={journeyData.visionTitle} onChange={handleJourneyChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="missionText">Mission Text</Label>
              <Textarea id="missionText" value={journeyData.missionText} onChange={handleJourneyChange} rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionText">Vision Text</Label>
              <Textarea id="visionText" value={journeyData.visionText} onChange={handleJourneyChange} rows={5} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
