
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, documentId } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Package, Category, Destination, Testimonial, CtaData } from "@/lib/data";
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
  linkUrl: string;
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
  buttonUrl: string;
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
    linkUrl: "",
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
    buttonUrl: "",
  });
  const [ctaData, setCtaData] = useState<CtaData>({
    title: "",
    buttonText: "",
    buttonUrl: "",
    backgroundImage: "",
    interactiveItems: [
        { title: "FAQs", description: "Answers to your questions", linkUrl: "#", backgroundImage: "" },
        { title: "Gallery", description: "Visual inspiration", linkUrl: "#", backgroundImage: "" },
        { title: "Blog & News", description: "Latest stories", linkUrl: "#", backgroundImage: "" },
    ]
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [deletedDestinationIds, setDeletedDestinationIds] = useState<string[]>([]);
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
  const [deletedPackageIds, setDeletedPackageIds] = useState<string[]>([]);
  const [deletedTestimonialIds, setDeletedTestimonialIds] = useState<string[]>([]);


  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
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
            linkUrl: intro.linkUrl || "#",
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
            buttonUrl: destinations.buttonUrl || "/destinations",
          });

          const cta = (data.cta || {}) as CtaData;
          const defaultItems = [
             { title: "FAQs", description: "Answers to your questions", linkUrl: "#", backgroundImage: "https://placehold.co/1920x1080.png?text=FAQs+Image" },
             { title: "Gallery", description: "Visual inspiration for your next trip", linkUrl: "#", backgroundImage: "https://placehold.co/1920x1080.png?text=Gallery+Image" },
             { title: "Blog & News", description: "The latest stories from our travels", linkUrl: "#", backgroundImage: "https://placehold.co/1920x1080.png?text=Blog+Image" },
          ];
          const interactiveItems = (cta.interactiveItems || defaultItems).map((item, index) => ({
                ...defaultItems[index],
                ...item
          }));

           setCtaData({
            title: cta.title || "Ready to plan your journey?",
            buttonText: cta.buttonText || "Plan Your Trip Now",
            buttonUrl: cta.buttonUrl || "#",
            backgroundImage: cta.backgroundImage || "https://placehold.co/1920x1080.png",
            interactiveItems: interactiveItems,
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

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCtaData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleCtaInteractiveItemChange = (index: number, field: string, value: string) => {
    const newItems = [...ctaData.interactiveItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setCtaData(prevData => ({ ...prevData, interactiveItems: newItems }));
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

  const handleCategoryChange = (id: string, field: keyof Omit<Category, 'id'>, value: any) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const handlePackageChange = (id: string, field: keyof Omit<Package, 'id'>, value: any) => {
    setPackages(prevPackages => prevPackages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const handlePackageImageChange = (id: string, imgIndex: number, value: string) => {
    setPackages(prevPackages => prevPackages.map(p => {
        if (p.id === id) {
            const newImages = [...(p.images || [])];
            while (newImages.length < 4) newImages.push("");
            newImages[imgIndex] = value;
            return { ...p, images: newImages };
        }
        return p;
    }));
  };

 const handlePackageImageHintChange = (id: string, imgIndex: number, value: string) => {
    setPackages(prevPackages => prevPackages.map(p => {
        if (p.id === id) {
            const newImageHints = [...(p.imageHints || [])];
            while (newImageHints.length < 4) newImageHints.push("");
            newImageHints[imgIndex] = value;
            return { ...p, imageHints: newImageHints };
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
    const packagesToDelete = packages.filter(p => p.categoryId === id).map(p => p.id);
    if (!id.startsWith('new-')) {
      setDeletedCategoryIds(prev => [...prev, id]);
      setDeletedPackageIds(prev => [...prev, ...packagesToDelete.filter(pid => !pid.startsWith('new-'))]);
    }
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
      images: ["https://placehold.co/600x400.png", "", "", ""],
      imageHints: ["", "", "", ""],
      linkUrl: "",
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id: string) => {
    if (!id.startsWith('new-')) {
      setDeletedPackageIds(prev => [...prev, id]);
    }
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
    if (!id.startsWith('new-')) {
        setDeletedTestimonialIds(prev => [...prev, id]);
    }
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const batch = writeBatch(db);
        const categoryIdMap = new Map<string, string>();

        const newCategories = categories.filter(cat => cat.id.startsWith('new-'));
        const newCategoryPromises = newCategories.map(async (cat) => {
            const newDocRef = doc(collection(db, 'categories'));
            categoryIdMap.set(cat.id, newDocRef.id);
            const { id, ...catData } = cat;
            batch.set(newDocRef, catData);
        });
        await Promise.all(newCategoryPromises);

        let updatedPackages = packages.map(pkg => {
            if (pkg.categoryId.startsWith('new-') && categoryIdMap.has(pkg.categoryId)) {
                return { ...pkg, categoryId: categoryIdMap.get(pkg.categoryId)! };
            }
            return pkg;
        });

        const contentDocRef = doc(db, "content", "home");
        batch.set(contentDocRef, { hero: heroData, intro: introData, quote: quoteData, destinations: destinationsData, cta: ctaData }, { merge: true });

        deletedDestinationIds.forEach(id => batch.delete(doc(db, "destinations", id)));
        deletedCategoryIds.forEach(id => batch.delete(doc(db, "categories", id)));
        deletedPackageIds.forEach(id => batch.delete(doc(db, "packages", id)));
        deletedTestimonialIds.forEach(id => batch.delete(doc(db, "testimonials", id)));

        destinations.forEach(dest => {
            const { id, ...destData } = dest;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'destinations')) : doc(db, "destinations", id);
            batch.set(docRef, destData);
        });

        categories.filter(cat => !cat.id.startsWith('new-')).forEach(cat => {
            const { id, ...catData } = cat;
            batch.set(doc(db, "categories", id), catData);
        });

        updatedPackages.forEach(pkg => {
            const { id, ...pkgData } = pkg;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'packages')) : doc(db, "packages", id);
            batch.set(docRef, pkgData);
        });

        testimonials.forEach(t => {
            const { id, ...testimonialData } = t;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'testimonials')) : doc(db, "testimonials", id);
            batch.set(docRef, testimonialData);
        });

        await batch.commit();
        
        const finalCategories = categories.map(cat => {
            if (categoryIdMap.has(cat.id)) {
                return { ...cat, id: categoryIdMap.get(cat.id)! };
            }
            return cat;
        });
        setCategories(finalCategories);

        const finalPackages = updatedPackages.map(pkg => {
             if (pkg.id.startsWith('new-')) {
                // This part is tricky, as we don't get the new package IDs back from a batch write directly.
                // A full refetch would be the most reliable way to get the new state.
                // For now, we'll just update the categoryId locally.
                return { ...pkg, id: `saved-pkg-${Date.now()}` }; // Mark as saved, but ID is not the real one
            }
            return pkg;
        });
        setPackages(finalPackages);

        setDeletedDestinationIds([]);
        setDeletedCategoryIds([]);
        setDeletedPackageIds([]);
        setDeletedTestimonialIds([]);

        toast({
            title: "Success",
            description: "All changes have been saved. Refreshing data...",
        });

        // Optional: a quick refetch to get the latest state including new document IDs
        const packagesSnap = await getDocs(collection(db, "packages"));
        setPackages(packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package)));


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
            <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input id="linkUrl" value={introData.linkUrl} onChange={handleIntroChange} />
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
            <CardDescription>Update the title, subtitle, and button URL for the destinations section.</CardDescription>
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
            <div className="space-y-2">
                <Label htmlFor="buttonUrl">View All Button URL</Label>
                <Input id="buttonUrl" value={destinationsData.buttonUrl} onChange={handleDestinationsSectionChange} />
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
                 <div className="space-y-1">
                  <Label htmlFor={`dest-link-${dest.id}`} className="text-xs">Link URL (optional)</Label>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories & Packages</CardTitle>
          <CardDescription>Organize packages within categories for the interactive preview section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {categories.map((category) => (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent className="space-y-6 bg-slate-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor={`cat-name-${category.id}`}>Category Name</Label>
                    <Input id={`cat-name-${category.id}`} value={category.name} onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)} />
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
                            <Label htmlFor={`pkg-desc-${pkg.id}`} className="text-xs">Tour Overview / Itinerary</Label>
                            <Textarea id={`pkg-desc-${pkg.id}`} value={pkg.description} onChange={(e) => handlePackageChange(pkg.id, 'description', e.target.value)} rows={10} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor={`pkg-img-${pkg.id}-${i}`} className="text-xs">Image {i + 1} URL</Label>
                                        <Input id={`pkg-img-${pkg.id}-${i}`} value={pkg.images?.[i] || ''} onChange={(e) => handlePackageImageChange(pkg.id, i, e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`pkg-imghint-${pkg.id}-${i}`} className="text-xs">Image {i + 1} Hint (AI)</Label>
                                        <Input id={`pkg-imghint-${pkg.id}-${i}`} value={pkg.imageHints?.[i] || ''} onChange={(e) => handlePackageImageHintChange(pkg.id, i, e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`pkg-link-${pkg.id}`} className="text-xs">Link URL (optional)</Label>
                            <Input id={`pkg-link-${pkg.id}`} placeholder={`/packages/${pkg.id}`} value={pkg.linkUrl || ''} onChange={(e) => handlePackageChange(pkg.id, 'linkUrl', e.target.value)} />
                        </div>
                         <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Package
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" onClick={() => handleAddNewPackage(category.id)}>Add New Package</Button>
                     <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
          <CardDescription>Manage the content for the interactive call to action section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cta-title-main">Main Title</Label>
            <Input id="cta-title-main" value={ctaData.title} onChange={(e) => setCtaData(prev => ({...prev, title: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-buttonText">Button Text</Label>
            <Input id="cta-buttonText" value={ctaData.buttonText} onChange={(e) => setCtaData(prev => ({...prev, buttonText: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-buttonUrl">Button URL</Label>
            <Input id="cta-buttonUrl" value={ctaData.buttonUrl} onChange={(e) => setCtaData(prev => ({...prev, buttonUrl: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-backgroundImage">Default Background Image URL</Label>
            <Input id="cta-backgroundImage" value={ctaData.backgroundImage} onChange={(e) => setCtaData(prev => ({...prev, backgroundImage: e.target.value}))} />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-lg">Interactive Items</h4>
            {ctaData.interactiveItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-md space-y-3 bg-slate-50">
                    <div className="space-y-1">
                        <Label htmlFor={`cta-item-title-${index}`}>Item {index + 1} Title</Label>
                        <Input id={`cta-item-title-${index}`} value={item.title} onChange={(e) => handleCtaInteractiveItemChange(index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`cta-item-desc-${index}`}>Item {index + 1} Description</Label>
                        <Textarea id={`cta-item-desc-${index}`} value={item.description} onChange={(e) => handleCtaInteractiveItemChange(index, 'description', e.target.value)} rows={2}/>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`cta-item-link-${index}`}>Item {index + 1} Link URL</Label>
                        <Input id={`cta-item-link-${index}`} value={item.linkUrl} onChange={(e) => handleCtaInteractiveItemChange(index, 'linkUrl', e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`cta-item-bg-${index}`}>Item {index + 1} Background Image URL</Label>
                        <Input id={`cta-item-bg-${index}`} value={item.backgroundImage} onChange={(e) => handleCtaInteractiveItemChange(index, 'backgroundImage', e.target.value)} />
                    </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>


      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save All Changes"}</Button>
    </div>
  );
}
