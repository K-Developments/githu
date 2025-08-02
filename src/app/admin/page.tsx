
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Package, Category, Destination, Testimonial } from "@/lib/data";
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
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);


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
        
        const destinationsCollectionRef = collection(db, "destinations");
        const destinationsSnap = await getDocs(destinationsCollectionRef);
        const destinationsData = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        setDestinations(destinationsData);

        const categoriesCollectionRef = collection(db, "categories");
        const categoriesSnap = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesData);

        const packagesCollectionRef = collection(db, "packages");
        const packagesSnap = await getDocs(packagesCollectionRef);
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        setPackages(packagesData);

        const testimonialsCollectionRef = collection(db, "testimonials");
        const testimonialsSnap = await getDocs(testimonialsCollectionRef);
        const testimonialsData = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(testimonialsData);

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

  const handleDestinationsSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDestinationsData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleDestinationChange = (id: string, field: keyof Omit<Destination, 'id'>, value: any) => {
    setDestinations(prevDestinations => prevDestinations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleAddNewDestination = () => {
    const newDestination: Destination = {
      id: `new-dest-${Date.now()}`,
      title: "New Destination",
      location: "",
      description: "",
      image: "https://placehold.co/600x400.png",
      imageHint: "",
    };
    setDestinations([...destinations, newDestination]);
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };


  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index].name = value;
    setCategories(newCategories);
  };
  
  const handlePackageChange = (id: string, field: keyof Omit<Package, 'id'>, value: any) => {
    setPackages(prevPackages => prevPackages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const handlePackageImageChange = (id: string, imgIndex: number, value: string) => {
    setPackages(prevPackages => prevPackages.map(p => {
        if (p.id === id) {
            const newImages = [...(p.images || [])];
            newImages[imgIndex] = value;
            return { ...p, images: newImages };
        }
        return p;
    }));
  };

  const handleAddNewCategory = () => {
    const newCategory: Category = {
      id: `new-cat-${Date.now()}`,
      name: "New Category",
    };
    setCategories([...categories, newCategory]);
  };
  
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setPackages(packages.filter(p => p.categoryId !== id));
  };

  const handleAddNewPackage = (categoryId: string) => {
    const newPackage: Package = {
      id: `new-pkg-${Date.now()}`,
      categoryId: categoryId,
      title: "New Package",
      location: "",
      description: "",
      images: ["https://placehold.co/600x400.png"],
      imageHints: [],
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleTestimonialChange = (id: string, field: keyof Omit<Testimonial, 'id'>, value: any) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleAddNewTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `new-testimonial-${Date.now()}`,
      text: "New testimonial text...",
      author: "New Author",
      location: "Author's Location",
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleSave = async () => {
    try {
      const batch = writeBatch(db);

      // Save content data
      const contentDocRef = doc(db, "content", "home");
      batch.set(contentDocRef, { hero: heroData, intro: introData, quote: quoteData, destinations: destinationsData }, { merge: true });
      
      // Save destinations
      const destinationsCollectionRef = collection(db, 'destinations');
      const existingDestinationsSnap = await getDocs(destinationsCollectionRef);
      const existingDestinationIds = existingDestinationsSnap.docs.map(d => d.id);
      const currentDestinationIds = destinations.map(d => d.id);

      for (const id of existingDestinationIds) {
          if (!currentDestinationIds.includes(id)) {
              batch.delete(doc(db, "destinations", id));
          }
      }
      destinations.forEach(dest => {
          const { id, ...destData } = dest;
          const docRef = doc(db, "destinations", id);
          batch.set(docRef, destData);
      });

      // Save categories
      const categoriesCollectionRef = collection(db, 'categories');
      const existingCategoriesSnap = await getDocs(categoriesCollectionRef);
      const existingCategoryIds = existingCategoriesSnap.docs.map(d => d.id);
      const currentCategoryIds = categories.map(c => c.id);

      for (const id of existingCategoryIds) {
          if (!currentCategoryIds.includes(id)) {
              batch.delete(doc(db, "categories", id));
          }
      }
      categories.forEach(cat => {
          const { id, ...catData } = cat;
          const docRef = doc(db, "categories", id);
          batch.set(docRef, catData);
      });

      // Save packages
      const packagesCollectionRef = collection(db, 'packages');
      const existingPackagesSnap = await getDocs(packagesCollectionRef);
      const existingPackageIds = existingPackagesSnap.docs.map(d => d.id);
      const currentPackageIds = packages.map(p => p.id);

      for (const id of existingPackageIds) {
          if (!currentPackageIds.includes(id)) {
              batch.delete(doc(db, "packages", id));
          }
      }
      packages.forEach(pkg => {
        const { id, ...pkgData } = pkg;
        const docRef = doc(db, "packages", id);
        batch.set(docRef, pkgData);
      });

      // Save testimonials
      const testimonialsCollectionRef = collection(db, 'testimonials');
      const existingTestimonialsSnap = await getDocs(testimonialsCollectionRef);
      const existingTestimonialIds = existingTestimonialsSnap.docs.map(d => d.id);
      const currentTestimonialIds = testimonials.map(t => t.id);

      for (const id of existingTestimonialIds) {
          if (!currentTestimonialIds.includes(id)) {
              batch.delete(doc(db, "testimonials", id));
          }
      }
      testimonials.forEach(t => {
        const { id, ...testimonialData } = t;
        const docRef = doc(db, "testimonials", id);
        batch.set(docRef, testimonialData);
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
            <CardDescription>Update the title and subtitle for the destinations section header.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={destinationsData.title} onChange={handleDestinationsSectionChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea id="subtitle" value={destinationsData.subtitle} onChange={handleDestinationsSectionChange} />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Destinations</CardTitle>
          <CardDescription>Manage the destination cards for the grid section.</CardDescription>
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
                  <Label htmlFor={`dest-desc-${dest.id}`} className="text-xs">Short Description</Label>
                  <Textarea id={`dest-desc-${dest.id}`} value={dest.description} onChange={(e) => handleDestinationChange(dest.id, 'description', e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dest-img-${dest.id}`} className="text-xs">Image URL</Label>
                  <Input id={`dest-img-${dest.id}`} value={dest.image} onChange={(e) => handleDestinationChange(dest.id, 'image', e.target.value)} />
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
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories & Packages</CardTitle>
          <CardDescription>Organize packages within categories for the interactive preview section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {categories.map((category, catIndex) => (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent className="space-y-6 bg-slate-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor={`cat-name-${catIndex}`}>Category Name</Label>
                    <Input id={`cat-name-${catIndex}`} value={category.name} onChange={(e) => handleCategoryChange(catIndex, e.target.value)} />
                  </div>

                  <div className="space-y-4">
                    <Label>Packages in this Category</Label>
                    {packages.filter(p => p.categoryId === category.id).map((pkg) => (
                      <div key={pkg.id} className="p-4 border rounded-md space-y-3 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`pkg-title-${pkg.id}`} className="text-xs">Title</Label>
                                <Input id={`pkg-title-${pkg.id}`} value={pkg.title} onChange={(e) => handlePackageChange(pkg.id, 'title', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`pkg-location-${pkg.id}`} className="text-xs">Location</Label>
                                <Input id={`pkg-location-${pkg.id}`} value={pkg.location} onChange={(e) => handlePackageChange(pkg.id, 'location', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`pkg-desc-${pkg.id}`} className="text-xs">Short Description</Label>
                            <Textarea id={`pkg-desc-${pkg.id}`} value={pkg.description} onChange={(e) => handlePackageChange(pkg.id, 'description', e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`pkg-img-${pkg.id}`} className="text-xs">Image URL</Label>
                            <Input id={`pkg-img-${pkg.id}`} value={pkg.images?.[0] || ''} onChange={(e) => handlePackageImageChange(pkg.id, 0, e.target.value)} />
                        </div>
                         <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Package
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" onClick={() => handleAddNewPackage(category.id)}>Add New Package</Button>                     <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Category
                    </Button>
                  </div>

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={handleAddNewCategory}>Add New Category</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Testimonials</CardTitle>
          <CardDescription>Manage the customer testimonials displayed on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 border rounded-md space-y-3 bg-slate-50">
                <div className="space-y-1">
                  <Label htmlFor={`testimonial-text-${t.id}`} className="text-xs">Testimonial Text</Label>
                  <Textarea id={`testimonial-text-${t.id}`} value={t.text} onChange={(e) => handleTestimonialChange(t.id, 'text', e.target.value)} rows={3} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor={`testimonial-author-${t.id}`} className="text-xs">Author</Label>
                        <Input id={`testimonial-author-${t.id}`} value={t.author} onChange={(e) => handleTestimonialChange(t.id, 'author', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`testimonial-location-${t.id}`} className="text-xs">Location</Label>
                        <Input id={`testimonial-location-${t.id}`} value={t.location} onChange={(e) => handleTestimonialChange(t.id, 'location', e.target.value)} />
                    </div>
                 </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTestimonial(t.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Testimonial
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleAddNewTestimonial}>Add New Testimonial</Button>
        </CardContent>
      </Card>


      <Button onClick={handleSave}>Save All Changes</Button>
    </div>
  );
}
