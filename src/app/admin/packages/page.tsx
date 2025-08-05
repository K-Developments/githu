
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";
import type { Package, Category, ItineraryDay } from "@/lib/data";

interface PackagesHeroData {
  headline: string;
  heroImage: string;
}

interface PackagesCtaData {
    title: string;
    description: string;
    image: string;
}

export default function AdminPackagesPage() {
  const [heroData, setHeroData] = useState<PackagesHeroData>({
    headline: "",
    heroImage: "",
  });
  const [ctaData, setCtaData] = useState<PackagesCtaData>({
      title: "Your Adventure Awaits",
      description: "Found a package that sparks your interest? Or perhaps you have a unique vision for your trip. Every journey with us can be tailored to your desires. Contact our travel experts to customize any package or build a completely new adventure from scratch.",
      image: "https://placehold.co/800x900.png"
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
  const [deletedPackageIds, setDeletedPackageIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "packages");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = (data.hero || {}) as PackagesHeroData;
          setHeroData({
            headline: hero.headline || "Our Packages",
            heroImage: hero.heroImage || "https://placehold.co/1920x600.png",
          });
          const cta = (data.cta || {}) as PackagesCtaData;
           setCtaData({
                title: cta.title || "Your Adventure Awaits",
                description: cta.description || "Found a package that sparks your interest? Or perhaps you have a unique vision for your trip. Every journey with us can be tailored to your desires. Contact our travel experts to customize any package or build a completely new adventure from scratch.",
                image: cta.image || "https://placehold.co/800x900.png",
            });
        } else {
            setHeroData({
                headline: "Our Packages",
                heroImage: "https://placehold.co/1920x600.png",
            });
        }

        const categoriesCollectionRef = collection(db, "categories");
        const categoriesSnap = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesData);

        const packagesCollectionRef = collection(db, "packages");
        const packagesSnap = await getDocs(packagesCollectionRef);
        const packagesData = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), itinerary: doc.data().itinerary || [] } as Package));
        setPackages(packagesData);

      } catch (error) {
        console.error("Error fetching packages page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch packages page data.",
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
  
  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCtaData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleCategoryChange = (id: string, field: keyof Omit<Category, 'id'>, value: any) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const handlePackageChange = (id: string, field: keyof Omit<Package, 'id'>, value: any) => {
    setPackages(prevPackages => prevPackages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePackageListChange = (id: string, field: 'inclusions' | 'exclusions', value: string) => {
    setPackages(prevPackages => prevPackages.map(p => {
        if (p.id === id) {
            return { ...p, [field]: value.split('\n') };
        }
        return p;
    }));
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

  const handleItineraryDayChange = (pkgId: string, dayIndex: number, field: 'title' | 'activities', value: string | string[]) => {
      setPackages(prev => prev.map(pkg => {
          if (pkg.id === pkgId) {
              const newItinerary = [...pkg.itinerary];
              if (field === 'activities') {
                newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: Array.isArray(value) ? value : value.split('\n') };
              } else {
                newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value };
              }
              return { ...pkg, itinerary: newItinerary };
          }
          return pkg;
      }));
  };

  const handleAddItineraryDay = (pkgId: string) => {
      setPackages(prev => prev.map(pkg => {
          if (pkg.id === pkgId) {
              const newDay: ItineraryDay = { title: `Day ${pkg.itinerary.length + 1}`, activities: [] };
              return { ...pkg, itinerary: [...pkg.itinerary, newDay] };
          }
          return pkg;
      }));
  };

  const handleDeleteItineraryDay = (pkgId: string, dayIndex: number) => {
      setPackages(prev => prev.map(pkg => {
          if (pkg.id === pkgId) {
              const newItinerary = pkg.itinerary.filter((_, index) => index !== dayIndex);
              return { ...pkg, itinerary: newItinerary };
          }
          return pkg;
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
      overview: "",
      itinerary: [],
      images: ["https://placehold.co/600x400.png", "", "", ""],
      inclusions: [],
      exclusions: [],
      linkUrl: "",
      duration: "",
      groupSize: "",
      destinationsCount: "",
      rating: "",
      reviewsCount: "",
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id: string) => {
    if (!id.startsWith('new-')) {
      setDeletedPackageIds(prev => [...prev, id]);
    }
    setPackages(packages.filter(p => p.id !== id));
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

        const contentDocRef = doc(db, "content", "packages");
        batch.set(contentDocRef, { hero: heroData, cta: ctaData }, { merge: true });

        deletedCategoryIds.forEach(id => batch.delete(doc(db, "categories", id)));
        deletedPackageIds.forEach(id => batch.delete(doc(db, "packages", id)));

        categories.filter(cat => !cat.id.startsWith('new-')).forEach(cat => {
            const { id, ...catData } = cat;
            batch.set(doc(db, "categories", id), catData);
        });

        updatedPackages.forEach(pkg => {
            const { id, ...pkgData } = pkg;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'packages')) : doc(db, "packages", id);
            batch.set(docRef, pkgData);
        });

        await batch.commit();

        setDeletedCategoryIds([]);
        setDeletedPackageIds([]);

        toast({
            title: "Success",
            description: "All changes have been saved. Refreshing data...",
        });

        const categoriesSnap = await getDocs(collection(db, "categories"));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
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
        <h1 className="text-2xl font-bold">Admin Panel - Packages Page</h1>
        <p className="text-muted-foreground">Manage your packages page content and all tour packages.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Packages Page Hero Section</CardTitle>
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
          <CardTitle>Manage Categories & Packages</CardTitle>
          <CardDescription>Organize packages within categories. All packages created here will appear on the public packages page.</CardDescription>
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
                                <Label htmlFor={`pkg-location-${pkg.id}`} className="text-xs">Location / Subtitle</Label>
                                <Input id={`pkg-location-${pkg.id}`} value={pkg.location} onChange={(e) => handlePackageChange(pkg.id, 'location', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`pkg-duration-${pkg.id}`} className="text-xs">Duration</Label>
                                <Input id={`pkg-duration-${pkg.id}`} value={pkg.duration || ''} onChange={(e) => handlePackageChange(pkg.id, 'duration', e.target.value)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`pkg-groupSize-${pkg.id}`} className="text-xs">Group Size</Label>
                                <Input id={`pkg-groupSize-${pkg.id}`} value={pkg.groupSize || ''} onChange={(e) => handlePackageChange(pkg.id, 'groupSize', e.target.value)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`pkg-destinationsCount-${pkg.id}`} className="text-xs"># of Destinations</Label>
                                <Input id={`pkg-destinationsCount-${pkg.id}`} value={pkg.destinationsCount || ''} onChange={(e) => handlePackageChange(pkg.id, 'destinationsCount', e.target.value)} />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`pkg-rating-${pkg.id}`} className="text-xs">Rating (e.g., 4.8)</Label>
                                <Input id={`pkg-rating-${pkg.id}`} value={pkg.rating || ''} onChange={(e) => handlePackageChange(pkg.id, 'rating', e.target.value)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`pkg-reviewsCount-${pkg.id}`} className="text-xs"># of Reviews</Label>
                                <Input id={`pkg-reviewsCount-${pkg.id}`} value={pkg.reviewsCount || ''} onChange={(e) => handlePackageChange(pkg.id, 'reviewsCount', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`pkg-overview-${pkg.id}`}>Tour Overview</Label>
                            <Textarea id={`pkg-overview-${pkg.id}`} value={pkg.overview} onChange={(e) => handlePackageChange(pkg.id, 'overview', e.target.value)} rows={5} />
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">Detailed Itinerary</h4>
                            {pkg.itinerary.map((day, dayIndex) => (
                                <div key={dayIndex} className="p-4 border rounded-md space-y-3 bg-slate-50 relative">
                                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleDeleteItineraryDay(pkg.id, dayIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="space-y-1">
                                        <Label htmlFor={`pkg-day-title-${pkg.id}-${dayIndex}`} className="text-xs">Day {dayIndex + 1} Title</Label>
                                        <Input id={`pkg-day-title-${pkg.id}-${dayIndex}`} value={day.title} onChange={(e) => handleItineraryDayChange(pkg.id, dayIndex, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`pkg-day-activities-${pkg.id}-${dayIndex}`} className="text-xs">Activities (one per line)</Label>
                                        <Textarea id={`pkg-day-activities-${pkg.id}-${dayIndex}`} value={day.activities.join('\n')} onChange={(e) => handleItineraryDayChange(pkg.id, dayIndex, 'activities', e.target.value)} rows={4} />
                                    </div>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={() => handleAddItineraryDay(pkg.id)}>Add Day</Button>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor={`pkg-inclusions-${pkg.id}`}>Inclusions (one per line)</Label>
                                <Textarea id={`pkg-inclusions-${pkg.id}`} value={(pkg.inclusions || []).join('\n')} onChange={(e) => handlePackageListChange(pkg.id, 'inclusions', e.target.value)} rows={5} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`pkg-exclusions-${pkg.id}`}>Exclusions (one per line)</Label>
                                <Textarea id={`pkg-exclusions-${pkg.id}`} value={(pkg.exclusions || []).join('\n')} onChange={(e) => handlePackageListChange(pkg.id, 'exclusions', e.target.value)} rows={5} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor={`pkg-img-${pkg.id}-${i}`} className="text-xs">Image {i + 1} URL</Label>
                                        <Input id={`pkg-img-${pkg.id}-${i}`} value={pkg.images?.[i] || ''} onChange={(e) => handlePackageImageChange(pkg.id, i, e.target.value)} />
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
          <CardTitle>Call to Action Section</CardTitle>
          <CardDescription>Update the content of the CTA section at the bottom of the page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Headline</Label>
            <Input id="title" value={ctaData.title} onChange={handleCtaChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={ctaData.description} onChange={handleCtaChange} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" value={ctaData.image} onChange={handleCtaChange} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save All Changes"}</Button>
    </div>
  );
}
