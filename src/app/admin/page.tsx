
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your website content here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home Page Settings</CardTitle>
          <CardDescription>Update the content of the home page hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-headline">Headline</Label>
            <Input id="hero-headline" defaultValue="Curated Luxury Travel Experiences" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-description">Description</Label>
            <Textarea id="hero-description" defaultValue="Where exceptional service meets breathtaking destinations. Your private escape awaits beyond the ordinary." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hero-button-primary">Primary Button Text</Label>
              <Input id="hero-button-primary" defaultValue="Explore Collections" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-button-secondary">Secondary Button Text</Label>
              <Input id="hero-button-secondary" defaultValue="Book Consultation" />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="hero-background">Background Image URL</Label>
            <Input id="hero-background" defaultValue="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
