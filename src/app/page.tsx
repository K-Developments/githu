"use client";

import { useState, useMemo, type SVGProps } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { packages as allPackages, type Package } from "@/lib/data";
import {
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Plane,
  Send,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  User,
  Wind,
  Bed,
  Utensils,
  Ship,
  ChevronRight,
} from "lucide-react";

// Logo Component
function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z" />
      <path d="M12 18c-3.14 0-6-1.66-6-4.5 0-2.84 2.86-5.5 6-5.5s6 2.66 6 5.5c0 2.84-2.86 4.5-6 4.5z" />
      <path d="M12 12.5c-3.14 0-6-1.66-6-4.5S8.86 3.5 12 3.5s6 2.66 6 5.5" />
    </svg>
  );
}

// Zod schema for booking form
const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  destination: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }),
});

// Zod schema for recommendation form
const recommendationInterests = [
    { id: "beaches", label: "Beaches" },
    { id: "hiking", label: "Hiking" },
    { id: "diving", label: "Diving" },
    { id: "cuisine", label: "Cuisine" },
    { id: "history", label: "History" },
    { id: "nightlife", label: "Nightlife" },
] as const;

const recommendationSchema = z.object({
  travelStyle: z.enum(["Adventure", "Relaxation", "Romance", "Culture"], { required_error: "Please select a travel style." }),
  budget: z.enum(["economy", "standard", "luxury"], { required_error: "Please select a budget." }),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one interest.",
  }),
});

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmittingBooking, setSubmittingBooking] = useState(false);
  const [isGeneratingRecommendation, setGeneratingRecommendation] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<Package | null>(null);

  const { toast } = useToast();

  const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { name: "", email: "", destination: "", message: "" },
  });

  const recommendationForm = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: { interests: ["beaches"] },
  });

  const filteredPackages = useMemo(() => {
    return allPackages
      .filter((p) => selectedTheme === "All" || p.theme === selectedTheme)
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, selectedTheme]);

  const handleViewDetails = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };

  const handleBookingSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    setSubmittingBooking(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setSubmittingBooking(false);
    toast({
      title: "Inquiry Sent!",
      description: "Thank you for your interest. We'll get back to you within 24 hours.",
    });
    bookingForm.reset();
  };

  const handleRecommendationSubmit = async (values: z.infer<typeof recommendationSchema>) => {
    setGeneratingRecommendation(true);
    setRecommendationResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI call
    // Simple logic to pick a "recommended" package
    const recommended = allPackages.find(p => p.theme === values.travelStyle) || allPackages[0];
    setRecommendationResult(recommended);
    setGeneratingRecommendation(false);
  };
  
  const navLinks = [
    { name: "Destinations", href: "#destinations" },
    { name: "Recommendations", href: "#recommendations" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href="#home" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold text-primary-foreground tracking-wide">
              Island Hopes Escapes
            </span>
          </a>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
               <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                 {link.name}
               </a>
            ))}
          </nav>
          <a href="#contact">
            <Button size="sm" className="hidden md:flex">Book Now</Button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="relative h-[60vh] md:h-[80vh] w-full">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Tropical beach paradise"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            data-ai-hint="tropical beach"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="container px-4 md:px-6 text-white">
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-white drop-shadow-lg">
                Your Dream Island Awaits
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-gray-200 drop-shadow-md">
                Discover curated travel packages to the world's most serene and breathtaking islands.
              </p>
              <a href="#destinations">
                <Button size="lg" className="mt-8">
                  Explore Packages
                  <Plane className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section id="destinations" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-black">Curated Island Getaways</h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our hand-picked selection of island adventures, relaxing retreats, and romantic escapes.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Input
                placeholder="Search by destination or package..."
                className="flex-grow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder="Filter by theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Themes</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Relaxation">Relaxation</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <Image
                      src={pkg.images[0]}
                      alt={pkg.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                      data-ai-hint={pkg.imageHints[0]}
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge variant="accent" className="mb-2">{pkg.theme}</Badge>
                    <CardTitle className="font-headline text-2xl text-black">{pkg.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent" /> {pkg.location}
                    </CardDescription>
                    <p className="mt-4 text-sm text-foreground/80 leading-relaxed line-clamp-3">{pkg.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="font-bold text-xl text-primary">${pkg.price.toLocaleString()}</div>
                    <Button onClick={() => handleViewDetails(pkg)}>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="recommendations" className="bg-background/70 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-12">
                    <Sparkles className="mx-auto h-10 w-10 text-primary mb-2" />
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-black">Find Your Perfect Escape</h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let our AI guide you to the island destination that perfectly matches your desires.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <Form {...recommendationForm}>
                                <form onSubmit={recommendationForm.handleSubmit(handleRecommendationSubmit)} className="space-y-8">
                                    <FormField
                                        control={recommendationForm.control}
                                        name="travelStyle"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-lg font-semibold">What's your travel style?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Adventure" /></FormControl>
                                                            <FormLabel className="font-normal flex items-center gap-2"><Wind className="h-4 w-4 text-accent"/>Adventure</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Relaxation" /></FormControl>
                                                            <FormLabel className="font-normal flex items-center gap-2"><Sun className="h-4 w-4 text-accent"/>Relaxation</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Romance" /></FormControl>
                                                            <FormLabel className="font-normal flex items-center gap-2"><Heart className="h-4 w-4 text-accent"/>Romance</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Culture" /></FormControl>
                                                            <FormLabel className="font-normal flex items-center gap-2"><Palette className="h-4 w-4 text-accent"/>Culture</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={recommendationForm.control}
                                        name="interests"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold">What are your interests?</FormLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {recommendationInterests.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={recommendationForm.control}
                                                            name="interests"
                                                            render={({ field }) => (
                                                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isGeneratingRecommendation}>
                                        {isGeneratingRecommendation ? 'Generating...' : 'Get Recommendation'}
                                        <Sparkles className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </Form>
                            <div className="relative border-l border-dashed pl-8 min-h-[200px] flex items-center justify-center">
                                 {isGeneratingRecommendation && <div className="text-center text-muted-foreground">Finding your perfect paradise...</div>}
                                 {!isGeneratingRecommendation && recommendationResult && (
                                     <Card className="w-full bg-background transition-all animate-in fade-in-50">
                                         <CardHeader>
                                             <CardTitle className="font-headline text-black">{recommendationResult.title}</CardTitle>
                                             <CardDescription className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent"/>{recommendationResult.location}</CardDescription>
                                         </CardHeader>
                                         <CardContent>
                                             <Image src={recommendationResult.images[0]} data-ai-hint={recommendationResult.imageHints[0]} alt={recommendationResult.title} width={400} height={250} className="rounded-lg object-cover w-full h-40" />
                                             <p className="text-sm mt-4">{recommendationResult.description}</p>
                                         </CardContent>
                                         <CardFooter>
                                             <Button className="w-full" onClick={() => handleViewDetails(recommendationResult)}>View Full Package</Button>
                                         </CardFooter>
                                     </Card>
                                 )}
                                 {!isGeneratingRecommendation && !recommendationResult && (
                                    <div className="text-center text-muted-foreground">Your personalized recommendation will appear here.</div>
                                 )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

        <section id="contact" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-black">Ready for an Adventure?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our travel experts are here to help you plan the perfect island getaway. Fill out the form, and we'll craft a personalized itinerary just for you.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full"><TrendingUp className="h-6 w-6 text-primary"/></div>
                    <p><span className="font-bold">Personalized Planning:</span> Tailored itineraries to match your travel style.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full"><Star className="h-6 w-6 text-primary"/></div>
                    <p><span className="font-bold">Expert Support:</span> 24/7 assistance from our experienced travel agents.</p>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Inquiry</CardTitle>
                  <CardDescription>Send us a message, and we'll be in touch shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...bookingForm}>
                    <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-4">
                      <FormField control={bookingForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={bookingForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="you@example.com" {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={bookingForm.control} name="destination" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination of Interest (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="e.g., Maldives" {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={bookingForm.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about your dream vacation..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmittingBooking}>
                        {isSubmittingBooking ? "Sending..." : "Send Inquiry"}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-accent-foreground py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <a href="#home" className="flex items-center justify-center gap-2 mb-4">
                <Logo className="h-8 w-8" />
                <span className="font-headline text-xl font-bold tracking-wide">
                    Island Hopes Escapes
                </span>
            </a>
            <p className="text-sm text-accent-foreground/80">&copy; {new Date().getFullYear()} Island Hopes Escapes. All rights reserved.</p>
        </div>
      </footer>

      {selectedPackage && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] grid-rows-[auto_1fr_auto] p-0">
             <DialogHeader className="p-6 pb-0">
               <DialogTitle className="font-headline text-3xl text-black">{selectedPackage.title}</DialogTitle>
               <DialogDescription className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{selectedPackage.location}</DialogDescription>
             </DialogHeader>
            <div className="overflow-y-auto px-6">
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <Image src={selectedPackage.images[0]} data-ai-hint={selectedPackage.imageHints[0]} alt={selectedPackage.title} width={800} height={600} className="rounded-lg object-cover w-full mb-4" />
                        <p className="text-foreground/90">{selectedPackage.longDescription}</p>
                        <div className="mt-4 flex gap-4 text-sm">
                            <Badge variant="default" className="text-base">${selectedPackage.price.toLocaleString()}</Badge>
                            <Badge variant="accent" className="text-base">{selectedPackage.duration} Days</Badge>
                            <Badge variant="outline" className="text-base">{selectedPackage.theme}</Badge>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2 text-black">Itinerary</h3>
                        <div className="space-y-4">
                            {selectedPackage.itinerary.map(item => (
                                <div key={item.day} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">{item.day}</div>
                                        <div className="border-l-2 border-dashed border-border h-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="mt-6">
                    <h3 className="font-headline text-xl font-semibold mb-4 text-black">Reviews</h3>
                    <div className="space-y-4">
                    {selectedPackage.reviews.map((review, i) => (
                        <div key={i} className="bg-background p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{review.name}</p>
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => <Star key={j} className={`h-4 w-4 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>)}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <div className="p-6 bg-background/50 border-t flex justify-end">
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
