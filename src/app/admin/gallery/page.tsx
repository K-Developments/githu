
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, writeBatch, collection, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage, GalleryCategory } from "@/lib/data";
import { Trash2 } from "lucide-react";

interface GalleryHeroData {
  headline: string;
}

export default function AdminGalleryPage() {
  const [heroData, setHeroData] = useState<GalleryHeroData>({
    headline: "Gallery",
  });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "gallery");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          setHeroData({
            headline: data.hero?.headline || "Gallery",
          });
        }

        const imagesSnap = await getDocs(collection(db, "galleryImages"));
        setImages(imagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));

        const categoriesSnap = await getDocs(collection(db, "galleryCategories"));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryCategory)));
        
      } catch (error) {
        console.error("Error fetching gallery page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch gallery data.",
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
  
  const handleImageChange = (id: string, field: keyof Omit<GalleryImage, 'id'>, value: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const handleCategoryChange = (id: string, value: string) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, name: value } : cat));
  };
  
  const handleAddNewImage = () => {
      const newImage: GalleryImage = {
        id: `new-img-${Date.now()}`,
        imageUrl: 'https://placehold.co/600x800.png',
        title: 'New Image',
        category: categories[0]?.id || 'uncategorized',
      };
      setImages([newImage, ...images]);
  };
  
  const handleAddNewCategory = () => {
      const newCategory: GalleryCategory = {
        id: `new-cat-${Date.now()}`,
        name: 'New Category',
      };
      setCategories([...categories, newCategory]);
  };

  const handleDeleteImage = (id: string) => {
    if (!id.startsWith('new-')) {
        setDeletedImageIds(prev => [...prev, id]);
    }
    setImages(images.filter(item => item.id !== id));
  };
  
  const handleDeleteCategory = (id: string) => {
    if (!id.startsWith('new-')) {
        setDeletedCategoryIds(prev => [...prev, id]);
    }
    setCategories(categories.filter(item => item.id !== id));
    // Also update images to remove the deleted category
    setImages(imgs => imgs.map(img => img.category === id ? {...img, category: 'uncategorized'} : img));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      const contentDocRef = doc(db, "content", "gallery");
      batch.set(contentDocRef, { hero: heroData }, { merge: true });

      // Handle deletions
      deletedImageIds.forEach(id => batch.delete(doc(db, "galleryImages", id)));
      deletedCategoryIds.forEach(id => batch.delete(doc(db, "galleryCategories", id)));

      // Handle additions/updates
      images.forEach(image => {
        const { id, ...imageData } = image;
        const docRef = id.startsWith('new-') ? doc(collection(db, 'galleryImages')) : doc(db, "galleryImages", id);
        batch.set(docRef, imageData);
      });
      
      categories.forEach(category => {
        const { id, ...catData } = category;
        const docRef = id.startsWith('new-') ? doc(collection(db, 'galleryCategories')) : doc(db, "galleryCategories", id);
        batch.set(docRef, catData);
      });

      await batch.commit();

      setDeletedImageIds([]);
      setDeletedCategoryIds([]);

      toast({
        title: "Success",
        description: "Gallery content has been saved.",
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
        <h1 className="text-2xl font-bold">Admin Panel - Gallery Page</h1>
        <p className="text-muted-foreground">Manage your gallery page content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Page Hero Section</CardTitle>
          <CardDescription>Update the content of the hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={heroData.headline} onChange={handleHeroChange} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
           <CardDescription>Manage the filter categories for the gallery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {categories.map((cat) => (
             <div key={cat.id} className="flex items-center gap-2">
               <Input value={cat.name} onChange={(e) => handleCategoryChange(cat.id, e.target.value)} />
               <Button variant="destructive" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                 <Trash2 className="h-4 w-4"/>
               </Button>
             </div>
           ))}
           <Button onClick={handleAddNewCategory} className="mt-4">Add New Category</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery Images</CardTitle>
          <CardDescription>Add, edit, or delete images displayed on the gallery page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button onClick={handleAddNewImage} className="mb-4">Add New Image</Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div key={item.id} className="p-4 border rounded-md space-y-3 bg-slate-50 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleDeleteImage(item.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="relative aspect-square w-full">
                    <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full rounded-md" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`img-url-${item.id}`} className="text-xs">Image URL</Label>
                  <Input id={`img-url-${item.id}`} value={item.imageUrl} onChange={(e) => handleImageChange(item.id, 'imageUrl', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`img-title-${item.id}`} className="text-xs">Title</Label>
                  <Input id={`img-title-${item.id}`} value={item.title} onChange={(e) => handleImageChange(item.id, 'title', e.target.value)} />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor={`img-cat-${item.id}`} className="text-xs">Category</Label>
                    <select
                        id={`img-cat-${item.id}`}
                        value={item.category}
                        onChange={(e) => handleImageChange(item.id, 'category', e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="uncategorized">Uncategorized</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
