
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Package } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";

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

export default function AdminHomePage() {
  const [heroData, setHeroData] = useState<HeroData>({
    headline: "",
    description: "",
    sliderImages: ["", "", ""],
  });
  const [introData, setIntroData] = useState<IntroData>({
    headline: "",
    paragraph: "",
    linkText: "",
    portraitImage: "",
    landscapeImage: "",
  });
  const [quoteData, setQuoteData] = useState<QuoteData>({
    text: "",
    image: "",
  });
  const [destinationsData, setDestinationsData] = useState<DestinationsData>({
    title: "",
    subtitle: "",
  });
  const [packages, setPackages] = useState<Package[]>([]);

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          
          const hero = (data.hero || {}) as HeroData;
          const images = hero.sliderImages || [];
          while (images.length < 3) {
            images.push("");
          }
          setHeroData({ ...hero, sliderImages: images.slice(0, 3) });

          const intro = (data.intro || {}) as IntroData;
          setIntroData({
            headline: intro.headline || "",
            paragraph: intro.paragraph || "",
            linkText: intro.linkText || "",
            portraitImage: intro.portraitImage || "",
            landscapeImage: intro.landscapeImage || "",
          });

          const quote = (data.quote || {}) as QuoteData;
           setQuoteData({
            text: quote.text || '"The world is a book and those who do not travel read only one page."',
            image: quote.image || "https://placehold.co/1920x600.png",
          });

          const destinations = (data.destinations || {}) as DestinationsData;
          setDestinationsData({
            title: destinations.title || "",
            subtitle: destinations.subtitle || "",
          });

        } else {
          console.log("No content document! Using default values.");
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

        const packagesCollectionRef = collection(db, "packages");
        const packagesSnap = await getDocs(packagesCollectionRef);
        if (packagesSnap.empty) {
          console.log("No packages found in Firestore.");
          setPackages([]);
        } else {
          const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
          setPackages(packagesData);
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
  
  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setQuoteData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleDestinationsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDestinationsData(prevData => ({ ...prevData, [id]: value }));
  };
  
  const handlePackageChange = (index: number, field: keyof Package, value: any) => {
    const newPackages = [...packages];
    (newPackages[index] as any)[field] = value;
    setPackages(newPackages);
  };
  
  const handlePackageImageChange = (pkgIndex: number, imgIndex: number, value: string) => {
      const newPackages = [...packages];
      if (!newPackages[pkgIndex].images) {
          newPackages[pkgIndex].images = [];
      }
      newPackages[pkgIndex].images[imgIndex] = value;
      setPackages(newPackages);
  };

  const handleAddNewPackage = () => {
    const newPackage: Package = {
      id: `new-${Date.now()}`,
      title: "New Destination",
      location: "",
      description: "",
      images: ["https://placehold.co/600x400.png"],
      imageHints: [],
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    // The actual deletion from Firestore will happen on save
  };

  const handleSave = async () => {
    try {
      const batch = writeBatch(db);

      // Save content data
      const contentDocRef = doc(db, "content", "home");
      batch.set(contentDocRef, { hero: heroData, intro: introData, quote: quoteData, destinations: destinationsData }, { merge: true });
      
      // Save packages data
      const packagesCollectionRef = collection(db, 'packages');
      const existingPackagesSnap = await getDocs(packagesCollectionRef);
      const existingIds = existingPackagesSnap.docs.map(d => d.id);
      const currentIds = packages.map(p => p.id);

      // Delete packages that are no longer in the state
      for (const id of existingIds) {
          if (!currentIds.includes(id)) {
              batch.delete(doc(db, "packages", id));
          }
      }
      
      // Update or add packages
      packages.forEach(pkg => {
        const { id, ...pkgData } = pkg;
        const docRef = doc(db, "packages", id);
        batch.set(docRef, pkgData);
      });

      await batch.commit();

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
                <Label htmlFor="headline">Headline</Label>
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
      
      <Card>
        <CardHeader>
            <CardTitle>Quote Section</CardTitle>
            <CardDescription>Update the content for the full-width quote section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="text">Quote Text</Label>
                <Textarea id="text" value={quoteData.text} onChange={handleQuoteChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Background Image URL</Label>
                <Input id="image" value={quoteData.image} onChange={handleQuoteChange} />
            </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
            <CardTitle>Destinations Section</CardTitle>
            <CardDescription>Update the title and subtitle for the destinations section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={destinationsData.title} onChange={handleDestinationsChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea id="subtitle" value={destinationsData.subtitle} onChange={handleDestinationsChange} />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Destinations</CardTitle>
          <CardDescription>Add, edit, or delete destination packages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {packages.map((pkg, index) => (
              <AccordionItem value={pkg.id} key={pkg.id}>
                <AccordionTrigger>{pkg.title}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`pkg-title-${index}`}>Title</Label>
                      <Input id={`pkg-title-${index}`} value={pkg.title} onChange={(e) => handlePackageChange(index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`pkg-location-${index}`}>Location</Label>
                      <Input id={`pkg-location-${index}`} value={pkg.location} onChange={(e) => handlePackageChange(index, 'location', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pkg-desc-${index}`}>Short Description</Label>
                    <Textarea id={`pkg-desc-${index}`} value={pkg.description} onChange={(e) => handlePackageChange(index, 'description', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={pkg.images?.[0] || ''} onChange={(e) => handlePackageImageChange(index, 0, e.target.value)} />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Destination
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={handleAddNewPackage}>Add New Destination</Button>
        </CardContent>
      </Card>


      <Button onClick={handleSave}>Save All Changes</Button>
    </div>
  );
}
