
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitContactForm } from './actions';
import type { FormValues } from '@/lib/data';
import { formSchema } from '@/lib/data';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ContactHeroData {
  headline: string;
  heroImage: string;
}

async function getContactPageData(): Promise<ContactHeroData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'contact');
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            return data.hero as ContactHeroData;
        }
        return null;
    } catch (error) {
        console.error('Error fetching contact page data:', error);
        return null;
    }
}

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [heroData, setHeroData] = useState<ContactHeroData>({
    headline: "Contact Us",
    heroImage: "https://placehold.co/1920x1080.png"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactPageData().then(data => {
      if (data) {
        setHeroData(data);
      }
      setLoading(false);
    });
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      inquiryType: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await submitContactForm(values);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const heroSection = document.getElementById('hero-section-contact');
    if (heroSection) {
        const nextSection = heroSection.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <section id="hero-section-contact" className="h-[65vh] flex flex-col">
        <div 
          className="flex-1 flex items-center justify-center p-4 relative"
          style={{
              backgroundImage: `url(${heroData.heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
          }}
          data-ai-hint="serene beach"
        >
          <div className="relative text-center">
            <ScrollAnimation>
              <h1 className="text-5xl md:text-8xl font-bold font-headline uppercase tracking-widest text-foreground">
                {heroData.headline}
              </h1>
            </ScrollAnimation>
            <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center mt-12" aria-label="Scroll down">
              <motion.div
                  initial={{ height: '0%' }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  className="w-full bg-black"
              />
            </button>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-12">
        <Separator />
        <div className="text-sm text-muted-foreground py-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">||</span>
          <span>Contact</span>
        </div>
        <Separator />
      </div>

      <section className="py-28 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimation className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or ready to start planning your dream getaway? We're here to help. Fill out the form below, and one of our travel experts will be in touch shortly.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.2}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="form-item-border">
                        <FormControl>
                          <Input placeholder="Name *" {...field} className="form-input-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="form-item-border">
                        <FormControl>
                          <Input placeholder="Email *" {...field} className="form-input-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="form-item-border">
                        <FormControl>
                          <Input placeholder="Phone no" {...field} className="form-input-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="form-item-border">
                        <FormControl>
                          <Input placeholder="Country *" {...field} className="form-input-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="inquiryType"
                  render={({ field }) => (
                    <FormItem className="form-item-border">
                       <Select onValueChange={field.onChange} value={field.value} >
                        <FormControl>
                          <SelectTrigger className="form-input-border">
                            <SelectValue placeholder="Please select an inquiry type *" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                          <SelectItem value="booking-request">Booking Request</SelectItem>
                          <SelectItem value="custom-tour">Custom Tour Planning</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="form-item-border">
                      <FormControl>
                        <Textarea placeholder="Message *" {...field} className="form-input-border" rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-center pt-8">
                    <div className="button-wrapper-for-border inline-block">
                        <Button type="submit" size="lg" disabled={isPending}>
                          {isPending ? 'Submitting...' : 'Send Message'}
                        </Button>
                    </div>
                </div>
              </form>
            </Form>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
