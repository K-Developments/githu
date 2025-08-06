
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import type { Destination } from "@/lib/data";

interface DestinationsHeroData {
  headline: string;
  heroImage: string;
}

export default function AdminDestinationsPage() {
  const [heroData, setHeroData] = useState<DestinationsHeroData>({
    headline: "",
    heroImage: "",
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [deletedDestinationIds, setDeletedDestinationIds] = useState<string[]>([]);
  
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

        const destinationsCollectionRef = collection(db, "destinations");
        const destinationsSnap = await getDocs(destinationsCollectionRef);
        const destinationsData = destinationsSnap.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                galleryImages: data.galleryImages || [],
                highlights: data.highlights || [],
            } as Destination
        });
        setDestinations(destinationsData);

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

  const handleDestinationChange = (id: string, field: keyof Omit<Destination, 'id'>, value: any) => {
    setDestinations(prevDestinations => prevDestinations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleDestinationListChange = (id: string, field: 'highlights' | 'galleryImages', value: string) => {
    setDestinations(prevDestinations => prevDestinations.map(d => {
        if (d.id === id) {
            return { ...d, [field]: value.split('\n') };
        }
        return d;
    }));
  };

  const handleAddNewDestination = () => {
    const newDestination: Destination = {
      id: `new-dest-${Date.now()}`,
      title: "New Destination",
      location: "",
      description: "",
      longDescription: "",
      image: "https://placehold.co/600x400.png",
      galleryImages: [],
      highlights: [],
      linkUrl: "",
    };
    setDestinations([...destinations, newDestination]);
  };

  const handleDeleteDestination = (id: string) => {
    if (!id.startsWith('new-')) {
      setDeletedDestinationIds(prev => [...prev, id]);
    }
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const batch = writeBatch(db);

        const contentDocRef = doc(db, "content", "destinations");
        batch.set(contentDocRef, { hero: heroData }, { merge: true });

        deletedDestinationIds.forEach(id => batch.delete(doc(db, "destinations", id)));

        destinations.forEach(dest => {
            const { id, ...destData } = dest;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'destinations')) : doc(db, "destinations", id);
            batch.set(docRef, destData);
        });

        await batch.commit();
        
        setDeletedDestinationIds([]);

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
        <p className="text-muted-foreground">Manage your destinations page hero section and all destinations.</p>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Manage All Destinations</CardTitle>
          <CardDescription>Destinations created here will appear on the public destinations page and can be featured on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {destinations.map((dest) => (
              <div key={dest.id} className="p-4 border rounded-md space-y-3 bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`dest-title-${dest.id}`} className="text-xs">Title</Label>
                    <Input id={`dest-title-${dest.id}`} value={dest.title} onChange={(e) => handleDestinationChange(dest.id, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`dest-location-${dest.id}`} className="text-xs">Location</Label>
                    <Input id={`dest-location-${dest.id}`} value={dest.location} onChange={(e) => handleDestinationChange(dest.id, 'location', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dest-desc-${dest.id}`} className="text-xs">Short Description (for cards)</Label>
                  <Textarea id={`dest-desc-${dest.id}`} value={dest.description} onChange={(e) => handleDestinationChange(dest.id, 'description', e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dest-long-desc-${dest.id}`} className="text-xs">Long Description (for detail page)</Label>
                  <Textarea id={`dest-long-desc-${dest.id}`} value={dest.longDescription || ''} onChange={(e) => handleDestinationChange(dest.id, 'longDescription', e.target.value)} rows={4} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dest-highlights-${dest.id}`} className="text-xs">Highlights (one per line)</Label>
                  <Textarea id={`dest-highlights-${dest.id}`} value={(dest.highlights || []).join('\n')} onChange={(e) => handleDestinationListChange(dest.id, 'highlights', e.target.value)} rows={4} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dest-img-${dest.id}`} className="text-xs">Cover Image URL</Label>
                  <Input id={`dest-img-${dest.id}`} value={dest.image} onChange={(e) => handleDestinationChange(dest.id, 'image', e.target.value)} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor={`dest-gallery-${dest.id}`} className="text-xs">Gallery Images (one URL per line)</Label>
                  <Textarea id={`dest-gallery-${dest.id}`} value={(dest.galleryImages || []).join('\n')} onChange={(e) => handleDestinationListChange(dest.id, 'galleryImages', e.target.value)} rows={4} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor={`dest-link-${dest.id}`} className="text-xs">Link URL (optional, defaults to /destinations/ID)</Label>
                  <Input id={`dest-link-${dest.id}`} placeholder={`/destinations/${dest.id}`} value={dest.linkUrl || ''} onChange={(e) => handleDestinationChange(dest.id, 'linkUrl', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteDestination(dest.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Destination
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleAddNewDestination}>Add New Destination</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save All Changes"}</Button>
    </div>
  );
}
