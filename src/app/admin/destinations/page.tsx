
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface DestinationsHeroData {
  headline: string;
  heroImage: string;
}

export default function AdminDestinationsPage() {
  const [heroData, setHeroData] = useState<DestinationsHeroData>({
    headline: "",
    heroImage: "",
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "destinations");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = (data.hero || {}) as DestinationsHeroData;
          setHeroData({
            headline: hero.headline || "Our Destinations",
            heroImage: hero.heroImage || "https://placehold.co/1920x600.png",
          });
        } else {
            setHeroData({
                headline: "Our Destinations",
                heroImage: "https://placehold.co/1920x600.png",
            });
        }

      } catch (error) {
        console.error("Error fetching destinations page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch destinations page data.",
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

  const handleSave = async () => {
    setLoading(true);
    try {
        const contentDocRef = doc(db, "content", "destinations");
        await setDoc(contentDocRef, { hero: heroData }, { merge: true });

        toast({
            title: "Success",
            description: "All changes have been saved.",
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
        <h1 className="text-2xl font-bold">Admin Panel - Destinations Page</h1>
        <p className="text-muted-foreground">Manage your destinations page hero section.</p>
        <p className="text-muted-foreground mt-2">Note: The destinations themselves are managed on the <a href="/admin" className="text-primary underline">Home Page admin section</a>.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Destinations Page Hero Section</CardTitle>
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
      
      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
