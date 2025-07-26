"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { packages as allPackages, type Package } from "@/lib/data";
import {
  Facebook,
  Twitter,
  Instagram,
  Headset,
  HandCoins,
  Leaf,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";


export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };
  
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Destinations", href: "#destinations" },
    { name: "Deals", href: "#" },
    { name: "About", href: "#features" },
    { name: "Contact", href: "#footer" },
  ];

  const featuredPackages = allPackages.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-50 w-full bg-primary shadow-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <a href="#home" className="text-2xl font-bold text-white font-headline">
            Travel<span className="text-muted">Escape</span>
          </a>
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
               <a key={link.name} href={link.href} className="font-semibold text-white transition-colors hover:text-muted">
                 {link.name}
               </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="relative h-screen w-full flex items-center text-center text-white pt-20">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Tropical beach paradise"
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority
          />
          <div className="absolute inset-0 bg-primary/70 z-10" />
          <div className="container relative z-20 px-4 md:px-6">
              <h1 className="font-headline text-6xl font-bold !text-white drop-shadow-lg">
                Discover Your Dream Escape
              </h1>
              <p className="font-headline mt-4 max-w-2xl mx-auto text-2xl italic !text-muted drop-shadow-md">
                Luxury resorts, hidden gems & eco-adventures
              </p>
              <div className="mt-10 flex justify-center gap-5 flex-col sm:flex-row items-center">
                <Button size="lg" variant="accent" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-2 border-accent hover:bg-transparent hover:text-white">
                  Explore Destinations
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-white text-white bg-transparent hover:bg-white hover:text-foreground">
                  Learn More
                </Button>
              </div>
          </div>
        </section>

        <section id="destinations" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-bold text-black">Featured Destinations</h2>
              <p className="mt-2 text-lg text-primary max-w-3xl mx-auto">
                Explore our most popular travel packages handpicked for unforgettable experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden transition-transform duration-300 hover:-translate-y-2.5 rounded-lg shadow-lg bg-white">
                  <div className="h-52 overflow-hidden">
                    <Image
                      src={pkg.images[0]}
                      alt={pkg.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={pkg.imageHints[0]}
                    />
                  </div>
                  <CardContent className="p-5">
                    <CardTitle className="font-headline text-2xl text-black mb-2">{pkg.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4 h-16">{pkg.description}</CardDescription>
                     <div className="font-bold text-2xl text-accent mb-4">${pkg.price.toLocaleString()}</div>
                    <Button variant="secondary" onClick={() => handleViewDetails(pkg)} className="w-full rounded-md font-semibold text-base">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-muted">
             <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-16">
                    <h2 className="font-headline text-4xl font-bold text-black">Why Choose Us?</h2>
                    <p className="mt-2 text-lg text-primary max-w-3xl mx-auto">
                        We're committed to making your travel experience seamless and memorable.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="text-center p-8 rounded-lg bg-white shadow-md">
                        <Headset className="mx-auto h-12 w-12 text-primary mb-5" />
                        <h3 className="text-xl font-bold text-black mb-3">24/7 Support</h3>
                        <p className="text-gray-600">Our travel experts are available round the clock to assist you</p>
                    </Card>
                     <Card className="text-center p-8 rounded-lg bg-white shadow-md">
                        <HandCoins className="mx-auto h-12 w-12 text-primary mb-5" />
                        <h3 className="text-xl font-bold text-black mb-3">Best Price Guarantee</h3>
                        <p className="text-gray-600">We'll match any lower price you find for the same package</p>
                    </Card>
                     <Card className="text-center p-8 rounded-lg bg-white shadow-md">
                        <Leaf className="mx-auto h-12 w-12 text-primary mb-5" />
                        <h3 className="text-xl font-bold text-black mb-3">Eco-Friendly Stays</h3>
                        <p className="text-gray-600">Carefully selected sustainable accommodations</p>
                    </Card>
                     <Card className="text-center p-8 rounded-lg bg-white shadow-md">
                        <MapPin className="mx-auto h-12 w-12 text-primary mb-5" />
                        <h3 className="text-xl font-bold text-black mb-3">Local Experts</h3>
                        <p className="text-gray-600">Authentic experiences guided by destination specialists</p>
                    </Card>
                </div>
             </div>
        </section>

        <section className="py-20 bg-secondary text-white text-center">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-4xl font-bold mb-5 text-black">Get Travel Deals & Updates</h2>
                <p className="max-w-xl mx-auto mb-8">Subscribe to our newsletter for exclusive offers and travel inspiration</p>
                <form className="flex max-w-md mx-auto">
                    <Input type="email" placeholder="Your email address" className="flex-1 !rounded-l-full !rounded-r-none text-black" />
                    <Button type="submit" variant="accent" className="!rounded-r-full !rounded-l-none font-bold hover:bg-foreground">Subscribe</Button>
                </form>
            </div>
        </section>
      </main>

      <footer id="footer" className="bg-accent text-muted py-16">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
                <div>
                    <h3 className="text-white text-xl font-bold mb-5">TravelEscape</h3>
                    <p className="mb-5">Making dream vacations a reality since 2010. We specialize in personalized travel experiences.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-secondary hover:text-white"><Facebook /></a>
                        <a href="#" className="text-secondary hover:text-white"><Instagram /></a>
                        <a href="#" className="text-secondary hover:text-white"><Twitter /></a>
                    </div>
                </div>
                 <div>
                    <h3 className="text-white text-xl font-bold mb-5">Quick Links</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-white">Home</a></li>
                        <li><a href="#" className="hover:text-white">Destinations</a></li>
                        <li><a href="#" className="hover:text-white">Special Offers</a></li>
                        <li><a href="#" className="hover:text-white">Travel Blog</a></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-xl font-bold mb-5">Support</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                        <li><a href="#" className="hover:text-white">Booking Terms</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-white text-xl font-bold mb-5">Contact Info</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-secondary" /> 123 Beach Road, Miami, FL</li>
                        <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-secondary" /> +1 (555) 123-4567</li>
                        <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-secondary" /> info@travelescape.com</li>
                    </ul>
                </div>
            </div>
            <div className="text-center pt-8 border-t border-primary">
                <p>&copy; {new Date().getFullYear()} TravelEscape. All rights reserved.</p>
            </div>
        </div>
      </footer>

      {selectedPackage && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl p-0">
             <DialogHeader className="p-6 pb-4">
               <DialogTitle className="font-headline text-3xl text-black">{selectedPackage.title}</DialogTitle>
               <DialogDescription>{selectedPackage.location}</DialogDescription>
             </DialogHeader>
            <div className="px-6 pb-6">
                <Image src={selectedPackage.images[0]} data-ai-hint={selectedPackage.imageHints[0]} alt={selectedPackage.title} width={800} height={600} className="rounded-lg object-cover w-full mb-4" />
                <p className="text-foreground/90">{selectedPackage.longDescription}</p>
                 <div className="mt-4 font-bold text-2xl text-accent">${selectedPackage.price.toLocaleString()}</div>
            </div>
            <div className="p-6 bg-gray-100 flex justify-end">
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
