
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import type { FAQItem } from "@/lib/data";
import { Trash2 } from "lucide-react";

interface FAQHeroData {
  headline: string;
}

export default function AdminFAQPage() {
  const [heroData, setHeroData] = useState<FAQHeroData>({
    headline: "FAQs",
  });
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "faq");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = (data.hero || {}) as FAQHeroData;
          setHeroData({
            headline: hero.headline || "FAQs",
          });
           const fetchedFaqs = Array.isArray(data.faqItems) ? data.faqItems : [];
           setFaqItems(fetchedFaqs);
        } else {
             setHeroData({
                headline: "FAQs",
            });
            setFaqItems([]);
        }
      } catch (error) {
        console.error("Error fetching FAQ page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch FAQ page data.",
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
  
  const handleFaqItemChange = (index: number, field: keyof Omit<FAQItem, 'id'>, value: string) => {
    const newItems = [...faqItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFaqItems(newItems);
  };
  
  const handleAddNewFaqItem = () => {
      const newItem: FAQItem = {
        id: `new-faq-${Date.now()}`,
        question: 'New Question',
        answer: 'New Answer',
      };
      setFaqItems([...faqItems, newItem]);
  };

  const handleDeleteFaqItem = (id: string) => {
    if (!id.startsWith('new-')) {
        setDeletedItemIds(prev => [...prev, id]);
    }
    setFaqItems(faqItems.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const contentDocRef = doc(db, "content", "faq");
      
      const itemsToSave = faqItems.map(item => {
        const { id, ...rest } = item;
        if (id.startsWith('new-')) {
            const newId = doc(collection(db, 'faq')).id; // placeholder to get an ID
            return { id: newId, ...rest };
        }
        return { id, ...rest };
      });
      
      const dataToSave = { 
        hero: heroData, 
        faqItems: itemsToSave
      };
      
      await setDoc(contentDocRef, dataToSave, { merge: true });

      setFaqItems(itemsToSave);

      toast({
        title: "Success",
        description: "FAQ page content has been saved.",
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
        <h1 className="text-2xl font-bold">Admin Panel - FAQ Page</h1>
        <p className="text-muted-foreground">Manage your FAQ page content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Page Hero Section</CardTitle>
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
          <CardTitle>Manage FAQ Items</CardTitle>
          <CardDescription>Manage the questions and answers displayed on the FAQ page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-md space-y-3 bg-slate-50 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleDeleteFaqItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold">Item {index + 1}</h4>
                <div className="space-y-1">
                  <Label htmlFor={`faq-question-${index}`} className="text-xs">Question</Label>
                  <Input id={`faq-question-${index}`} value={item.question} onChange={(e) => handleFaqItemChange(index, 'question', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`faq-answer-${index}`} className="text-xs">Answer</Label>
                  <Textarea id={`faq-answer-${index}`} value={item.answer} onChange={(e) => handleFaqItemChange(index, 'answer', e.target.value)} rows={4} />
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleAddNewFaqItem} className="mt-4">Add New FAQ Item</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
