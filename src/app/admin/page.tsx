
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
import type { Package, Destination, Testimonial, CtaData, Category, SiteSettings } from "@/lib/data";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface HeroData {
  headline: string;
  subtitle: string;
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

interface FeaturedPackagesData {
    packageIds: string[];
}

interface FeaturedDestinationsData {
    destinationIds: string[];
}

export default function AdminHomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logoUrl: "",
    siteTitle: "",
    siteDescription: "",
    introBackgroundImage: "",
    quoteBackgroundImage: "",
    destinationsBackgroundImage: "",
    packagesBackgroundImage: "",
    testimonialsBackgroundImage: "",
    phoneNumber: "",
    whatsappNumber: "",
  });
  const [heroData, setHeroData] = useState<HeroData>({
    headline: "",
    subtitle: "",
    sliderImages: [],
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
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [featuredDestinationsData, setFeaturedDestinationsData] = useState<FeaturedDestinationsData>({ destinationIds: [] });
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [featuredPackagesData, setFeaturedPackagesData] = useState<FeaturedPackagesData>({ packageIds: [] });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
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
          
          const settings = (data.siteSettings || {}) as SiteSettings;
          setSiteSettings({
            logoUrl: settings.logoUrl || "",
            siteTitle: settings.siteTitle || "",
            siteDescription: settings.siteDescription || "",
            introBackgroundImage: settings.introBackgroundImage || "",
            quoteBackgroundImage: settings.quoteBackgroundImage || "",
            destinationsBackgroundImage: settings.destinationsBackgroundImage || "",
            packagesBackgroundImage: settings.packagesBackgroundImage || "",
            testimonialsBackgroundImage: settings.testimonialsBackgroundImage || "",
            phoneNumber: settings.phoneNumber || "",
            whatsappNumber: settings.whatsappNumber || "",
          });

          const hero = (data.hero || {}) as HeroData;
          setHeroData({ ...hero, sliderImages: hero.sliderImages || [] });

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

          const featuredPackages = (data.featuredPackages || {}) as FeaturedPackagesData;
          setFeaturedPackagesData({
            packageIds: featuredPackages.packageIds || []
          });

          const featuredDestinations = (data.featuredDestinations || {}) as FeaturedDestinationsData;
          setFeaturedDestinationsData({
            destinationIds: featuredDestinations.destinationIds || []
          });

        }
        
        const destinationsCollectionRef = collection(db, "destinations");
        const destinationsSnap = await getDocs(destinationsCollectionRef);
        const destinationsData = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
        setAllDestinations(destinationsData);

        const categoriesCollectionRef = collection(db, "categories");
        const categoriesSnap = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setAllCategories(categoriesData);

        const packagesCollectionRef = collection(db, "packages");
        const packagesSnap = await getDocs(packagesCollectionRef);
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        setAllPackages(packagesData);

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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSiteSettings(prevData => ({ ...prevData, [id]: value }));
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setHeroData(prevData => ({ ...prevData, [id]: value }));
  };
  
  const handleImageChange = (value: string) => {
    const newSliderImages = value.split('\n').filter(url => url.trim() !== '');
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

  const handleFeaturedDestinationChange = (destinationId: string, checked: boolean | 'indeterminate') => {
    setFeaturedDestinationsData(prev => {
        const newDestinationIds = new Set(prev.destinationIds);
        if (checked) {
            newDestinationIds.add(destinationId);
        } else {
            newDestinationIds.delete(destinationId);
        }
        return { destinationIds: Array.from(newDestinationIds) };
    });
  };

  const handleFeaturedPackageChange = (packageId: string, checked: boolean | 'indeterminate') => {
    setFeaturedPackagesData(prev => {
        const newPackageIds = new Set(prev.packageIds);
        if (checked) {
            newPackageIds.add(packageId);
        } else {
            newPackageIds.delete(packageId);
        }
        return { packageIds: Array.from(newPackageIds) };
    });
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
      image: "https://placehold.co/1920x1080.png"
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

        const contentDocRef = doc(db, "content", "home");
        batch.set(contentDocRef, { 
            siteSettings,
            hero: heroData, 
            intro: introData, 
            quote: quoteData, 
            destinations: destinationsData, 
            cta: ctaData,
            featuredPackages: featuredPackagesData,
            featuredDestinations: featuredDestinationsData,
        }, { merge: true });

        deletedTestimonialIds.forEach(id => batch.delete(doc(db, "testimonials", id)));

        testimonials.forEach(t => {
            const { id, ...testimonialData } = t;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'testimonials')) : doc(db, "testimonials", id);
            batch.set(docRef, testimonialData);
        });

        await batch.commit();
        
        setDeletedTestimonialIds([]);

        toast({
            title: "Success",
            description: "All changes have been saved. Refreshing data...",
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
        <h1 className="text-2xl font-bold">Admin Panel - Home Page</h1>
        <p className="text-muted-foreground">Manage your website content here.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Site-wide Settings</CardTitle>
          <CardDescription>Manage settings that apply across the entire site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo Image URL</Label>
            <Input id="logoUrl" value={siteSettings.logoUrl} onChange={handleSettingsChange} placeholder="e.g., /logo.png" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title (for SEO)</Label>
            <Input id="siteTitle" value={siteSettings.siteTitle} onChange={handleSettingsChange} placeholder="e.g., Island Hopes Escapes" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description (for SEO)</Label>
            <Textarea id="siteDescription" value={siteSettings.siteDescription} onChange={handleSettingsChange} placeholder="e.g., Your premier partner for luxury island travel..." />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={siteSettings.phoneNumber} onChange={handleSettingsChange} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input id="whatsappNumber" value={siteSettings.whatsappNumber} onChange={handleSettingsChange} placeholder="+1 234 567 890" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="introBackgroundImage">Intro Section Background Image URL</Label>
            <Input id="introBackgroundImage" value={siteSettings.introBackgroundImage} onChange={handleSettingsChange} placeholder="https://example.com/intro-bg.jpg"/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="quoteBackgroundImage">Quote Section Background Image URL</Label>
            <Input id="quoteBackgroundImage" value={siteSettings.quoteBackgroundImage} onChange={handleSettingsChange} placeholder="https://example.com/quote-bg.jpg"/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="destinationsBackgroundImage">Destinations Section Background Image URL</Label>
            <Input id="destinationsBackgroundImage" value={siteSettings.destinationsBackgroundImage} onChange={handleSettingsChange} placeholder="https://example.com/destinations-bg.jpg"/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="packagesBackgroundImage">Packages Section Background Image URL</Label>
            <Input id="packagesBackgroundImage" value={siteSettings.packagesBackgroundImage} onChange={handleSettingsChange} placeholder="https://example.com/packages-bg.jpg"/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="testimonialsBackgroundImage">Testimonials Section Background Image URL</Label>
            <Input id="testimonialsBackgroundImage" value={siteSettings.testimonialsBackgroundImage} onChange={handleSettingsChange} placeholder="https://example.com/testimonials-bg.jpg"/>
          </div>
        </CardContent>
      </Card>


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
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea id="subtitle" value={heroData.subtitle} onChange={handleHeroChange} />
          </div>
          
           <div className="space-y-4">
            <Label>Slider/Grid Images (one URL per line)</Label>
            <Textarea
                id="sliderImages"
                value={heroData.sliderImages.join('\n')}
                onChange={(e) => handleImageChange(e.target.value)}
                rows={5}
                placeholder="https://example.com/image1.png
https://example.com/image2.png
https://example.com/image3.png"
            />
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
                <Label htmlFor="image">Parallax Background Image URL</Label>
                <Input id="image" value={quoteData.image} onChange={handleQuoteChange} />
            </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
            <CardTitle>Destinations Section</CardTitle>
            <CardDescription>Update the title, subtitle, and button URL for the destinations section on the homepage.</CardDescription>
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
            <CardTitle>Manage Featured Destinations</CardTitle>
            <CardDescription>Select which destinations to display on the homepage. Manage all destinations on the "Destinations" admin page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allDestinations.map(dest => (
                    <div key={dest.id} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Checkbox
                            id={`featured-dest-${dest.id}`}
                            checked={featuredDestinationsData.destinationIds.includes(dest.id)}
                            onCheckedChange={(checked) => handleFeaturedDestinationChange(dest.id, checked)}
                        />
                        <Label htmlFor={`featured-dest-${dest.id}`} className="cursor-pointer">{dest.title}</Label>
                    </div>
                ))}
            </div>
            {allDestinations.length === 0 && <p className="text-muted-foreground">No destinations found. Add destinations in the 'Destinations' admin page first.</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Manage Featured Packages</CardTitle>
            <CardDescription>Select which packages to display on the homepage. Manage all packages on the "Packages" admin page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {allCategories.map(category => {
                const packagesInCategory = allPackages.filter(p => p.categoryId === category.id);
                if (packagesInCategory.length === 0) return null;

                return (
                    <div key={category.id} className="space-y-3">
                        <h4 className="font-semibold text-md border-b pb-2">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {packagesInCategory.map(pkg => (
                                <div key={pkg.id} className="flex items-center space-x-2 p-2 border rounded-md">
                                    <Checkbox
                                        id={`featured-${pkg.id}`}
                                        checked={featuredPackagesData.packageIds.includes(pkg.id)}
                                        onCheckedChange={(checked) => handleFeaturedPackageChange(pkg.id, checked)}
                                    />
                                    <Label htmlFor={`featured-${pkg.id}`} className="cursor-pointer">{pkg.title}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            {allPackages.length === 0 && <p className="text-muted-foreground">No packages found. Add packages in the 'Packages' admin page first.</p>}
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
                 <div className="space-y-1">
                    <Label htmlFor={`testimonial-image-${t.id}`} className="text-xs">Background Image URL</Label>
                    <Input id={`testimonial-image-${t.id}`} value={t.image} onChange={(e) => handleTestimonialChange(t.id, 'image', e.target.value)} />
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
