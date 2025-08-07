
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import type { CoreValue, WorkflowStep } from "@/lib/data";
import { Trash2 } from "lucide-react";

interface AboutHeroData {
  headline: string;
  heroImage: string;
  contentBackgroundImage?: string;
}

interface IntroData {
  paragraph: string;
}

interface JourneyData {
    title: string;
    image: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
}

export default function AdminAboutPage() {
  const [heroData, setHeroData] = useState<AboutHeroData>({
    headline: "",
    heroImage: "",
    contentBackgroundImage: "",
  });
  const [introData, setIntroData] = useState<IntroData>({
    paragraph: "",
  });
  const [journeyData, setJourneyData] = useState<JourneyData>({
    title: "",
    image: "",
    missionTitle: "",
    missionText: "",
    visionTitle: "",
    visionText: "",
  });
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const contentDocRef = doc(db, "content", "about");
        const contentDocSnap = await getDoc(contentDocRef);
        
        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          const hero = (data.hero || {}) as AboutHeroData;
          setHeroData({
            headline: hero.headline || "About Us",
            heroImage: hero.heroImage || "https://placehold.co/1920x600.png",
            contentBackgroundImage: hero.contentBackgroundImage || "",
          });

          const intro = (data.intro || {}) as IntroData;
          setIntroData({
            paragraph: intro.paragraph || "",
          });

          const journey = (data.journey || {}) as JourneyData;
          setJourneyData({
            title: journey.title || "Our Journey",
            image: journey.image || "https://placehold.co/1200x800.png",
            missionTitle: journey.missionTitle || "Our Mission",
            missionText: journey.missionText || "",
            visionTitle: journey.visionTitle || "Our Vision",
            visionText: journey.visionText || "",
          });
          
          const fetchedValues = Array.isArray(data.coreValues) ? data.coreValues : [];
          setCoreValues(fetchedValues);

          const fetchedWorkflow = Array.isArray(data.workflow) ? data.workflow : [];
          setWorkflow(fetchedWorkflow);

        } else {
            // Set default values if the document doesn't exist
            setHeroData({
                headline: "About Us",
                heroImage: "https://placehold.co/1920x600.png",
                contentBackgroundImage: "",
            });
            setIntroData({
                paragraph: "",
            });
            setJourneyData({
                title: "Our Journey",
                image: "https://placehold.co/1200x800.png",
                missionTitle: "Our Mission",
                missionText: "",
                visionTitle: "Our Vision",
                visionText: "",
            });
            setCoreValues([]);
            setWorkflow([]);
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch about page data.",
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
  
  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setIntroData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleJourneyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setJourneyData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleCoreValueChange = (index: number, field: keyof Omit<CoreValue, 'id'>, value: string) => {
    const newValues = [...coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    setCoreValues(newValues);
  };
  
  const handleAddNewCoreValue = () => {
    if (coreValues.length < 4) {
      const newValue: CoreValue = {
        id: `new-value-${Date.now()}`,
        title: 'New Core Value',
        description: '',
        image: 'https://placehold.co/600x600.png',
      };
      setCoreValues([...coreValues, newValue]);
    } else {
       toast({
        title: "Limit Reached",
        description: "You can only have a maximum of 4 core values.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoreValue = (id: string) => {
    setCoreValues(coreValues.filter(value => value.id !== id));
  };

  const handleWorkflowChange = (index: number, field: keyof Omit<WorkflowStep, 'id'>, value: string) => {
    const newSteps = [...workflow];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setWorkflow(newSteps);
  };
  
  const handleAddNewWorkflowStep = () => {
      const newStep: WorkflowStep = {
        id: `new-step-${Date.now()}`,
        title: 'New Step Title',
        description: '',
        image: 'https://placehold.co/800x600.png',
      };
      setWorkflow([...workflow, newStep]);
  };

  const handleDeleteWorkflowStep = (id: string) => {
    setWorkflow(workflow.filter(step => step.id !== id));
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const contentDocRef = doc(db, "content", "about");
      
      const valuesToSave = coreValues.map(value => {
        const { id, ...rest } = value;
        const newId = id.startsWith('new-') ? `value-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : id;
        return { id: newId, ...rest };
      });
      
      const workflowToSave = workflow.map(step => {
        const { id, ...rest } = step;
        const newId = id.startsWith('new-') ? `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`: id;
        return { id: newId, ...rest };
      });
      
      const dataToSave = { 
        hero: heroData, 
        intro: introData,
        journey: journeyData,
        coreValues: valuesToSave,
        workflow: workflowToSave,
      };
      
      await setDoc(contentDocRef, dataToSave, { merge: true });

      setCoreValues(valuesToSave);
      setWorkflow(workflowToSave);

      toast({
        title: "Success",
        description: "About page content has been saved.",
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
        <h1 className="text-2xl font-bold">Admin Panel - About Page</h1>
        <p className="text-muted-foreground">Manage your about page content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Page Hero Section</CardTitle>
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
          <div className="space-y-2">
            <Label htmlFor="contentBackgroundImage">Content Background Image URL</Label>
            <Input id="contentBackgroundImage" value={heroData.contentBackgroundImage} onChange={handleHeroChange} />
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Intro Section</CardTitle>
          <CardDescription>Update the introductory paragraph for the about page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paragraph">Intro Paragraph</Label>
            <Textarea id="paragraph" value={introData.paragraph} onChange={handleIntroChange} rows={5} />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Our Journey Section</CardTitle>
          <CardDescription>Update the content of the journey section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input id="title" value={journeyData.title} onChange={handleJourneyChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Main Image URL</Label>
            <Input id="image" value={journeyData.image} onChange={handleJourneyChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="missionTitle">Mission Title</Label>
              <Input id="missionTitle" value={journeyData.missionTitle} onChange={handleJourneyChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionTitle">Vision Title</Label>
              <Input id="visionTitle" value={journeyData.visionTitle} onChange={handleJourneyChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="missionText">Mission Text</Label>
              <Textarea id="missionText" value={journeyData.missionText} onChange={handleJourneyChange} rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visionText">Vision Text</Label>
              <Textarea id="visionText" value={journeyData.visionText} onChange={handleJourneyChange} rows={5} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Core Values</CardTitle>
          <CardDescription>Manage the core values displayed on the about page. (Max 4)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((value, index) => (
              <div key={value.id} className="p-4 border rounded-md space-y-3 bg-slate-50 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleDeleteCoreValue(value.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold">Value {index + 1}</h4>
                <div className="space-y-1">
                  <Label htmlFor={`value-title-${index}`} className="text-xs">Title</Label>
                  <Input id={`value-title-${index}`} value={value.title} onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`value-desc-${index}`} className="text-xs">Description</Label>
                  <Textarea id={`value-desc-${index}`} value={value.description} onChange={(e) => handleCoreValueChange(index, 'description', e.target.value)} rows={3} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`value-img-${index}`} className="text-xs">Image URL</Label>
                  <Input id={`value-img-${index}`} value={value.image} onChange={(e) => handleCoreValueChange(index, 'image', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          {coreValues.length < 4 && (
            <Button onClick={handleAddNewCoreValue} className="mt-4">Add New Core Value</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Our Workflow</CardTitle>
          <CardDescription>Manage the steps in the "Our Workflow" timeline section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {workflow.map((step, index) => (
              <div key={step.id} className="p-4 border rounded-md space-y-3 bg-slate-50 relative">
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleDeleteWorkflowStep(step.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold">Step {index + 1}</h4>
                <div className="space-y-1">
                  <Label htmlFor={`wf-title-${index}`} className="text-xs">Title</Label>
                  <Input id={`wf-title-${index}`} value={step.title} onChange={(e) => handleWorkflowChange(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`wf-desc-${index}`} className="text-xs">Description</Label>
                  <Textarea id={`wf-desc-${index}`} value={step.description} onChange={(e) => handleWorkflowChange(index, 'description', e.target.value)} rows={3} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`wf-img-${index}`} className="text-xs">Image URL</Label>
                  <Input id={`wf-img-${index}`} value={step.image} onChange={(e) => handleWorkflowChange(index, 'image', e.target.value)} />
                </div>
              </div>
            ))}
          <Button onClick={handleAddNewWorkflowStep} className="mt-4">Add New Step</Button>
        </CardContent>
      </Card>


      <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
