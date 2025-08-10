
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
import type { Service } from "@/lib/data";

interface ServicesHeroData {
  headline: string;
}

export default function AdminServicesPage() {
  const [heroData, setHeroData] = useState<ServicesHeroData>({ headline: "" });
  const [services, setServices] = useState<Service[]>([]);
  const [deletedServiceIds, setDeletedServiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "services");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          setHeroData({
            headline: data.hero?.headline || "Our Services",
          });
        } else {
            setHeroData({ headline: "Our Services" });
        }

        const servicesCollectionRef = collection(db, "services");
        const servicesSnap = await getDocs(servicesCollectionRef);
        const servicesData = servicesSnap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data()
        } as Service));
        setServices(servicesData);

      } catch (error) {
        console.error("Error fetching services page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch services page data.",
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

  const handleServiceChange = (id: string, field: keyof Omit<Service, 'id'>, value: any) => {
    setServices(prevServices => prevServices.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddNewService = () => {
    const newService: Service = {
      id: `new-service-${Date.now()}`,
      title: "New Service",
      description: "",
      image: "https://placehold.co/600x600.png",
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (id: string) => {
    if (!id.startsWith('new-')) {
      setDeletedServiceIds(prev => [...prev, id]);
    }
    setServices(services.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const batch = writeBatch(db);

        const contentDocRef = doc(db, "content", "services");
        batch.set(contentDocRef, { hero: heroData }, { merge: true });

        deletedServiceIds.forEach(id => batch.delete(doc(db, "services", id)));

        services.forEach(service => {
            const { id, ...serviceData } = service;
            const docRef = id.startsWith('new-') ? doc(collection(db, 'services')) : doc(db, "services", id);
            batch.set(docRef, serviceData);
        });

        await batch.commit();
        
        setDeletedServiceIds([]);

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
        <h1 className="text-2xl font-bold">Admin Panel - Services Page</h1>
        <p className="text-muted-foreground">Manage your services page hero section and all services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Services Page Hero Section</CardTitle>
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
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>Services created here will appear on the public services page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 border rounded-md space-y-3 bg-slate-50">
                <div className="space-y-1">
                    <Label htmlFor={`service-title-${service.id}`} className="text-xs">Title</Label>
                    <Input id={`service-title-${service.id}`} value={service.title} onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`service-desc-${service.id}`} className="text-xs">Description</Label>
                  <Textarea id={`service-desc-${service.id}`} value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} rows={3} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`service-img-${service.id}`} className="text-xs">Image URL</Label>
                  <Input id={`service-img-${service.id}`} value={service.image} onChange={(e) => handleServiceChange(service.id, 'image', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Service
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleAddNewService}>Add New Service</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save All Changes"}</Button>
    </div>
  );
}
