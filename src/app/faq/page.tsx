
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { FAQItem } from '@/lib/data';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQPageData {
  hero: {
    headline: string;
    heroImage: string;
  };
  faqItems: FAQItem[];
}

async function getFaqPageData(): Promise<FAQPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'faq');
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            const faqItems = Array.isArray(data.faqItems) ? data.faqItems : [];
            return {
                hero: {
                  headline: data.hero?.headline || 'FAQs',
                  heroImage: data.hero?.heroImage || 'https://placehold.co/1920x1080.png',
                },
                faqItems,
            };
        }
        return {
            hero: {
                headline: 'FAQs',
                heroImage: 'https://placehold.co/1920x1080.png',
            },
            faqItems: []
        };
    } catch (error) {
        console.error('Error fetching FAQ page data:', error);
        return null;
    }
}

export default function FaqPage() {
    const [pageData, setPageData] = useState<FAQPageData | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        getFaqPageData().then(setPageData);
    }, []);

    if (!pageData) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>; 
    }

    const { hero, faqItems } = pageData;
    
    const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const heroSection = document.getElementById('hero-section-faq');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div>
            <section
                className="h-[65vh] flex flex-col"
                id="hero-section-faq"
            >
                <div 
                    className="flex-1 flex items-center justify-center p-4 relative"
                    style={{
                        backgroundImage: `url(${hero.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    data-ai-hint="library books"
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative text-center">
                        <ScrollAnimation>
                            <h1 className="text-5xl md:text-8xl font-bold font-headline uppercase tracking-widest text-white">
                            {hero.headline}
                            </h1>
                        </ScrollAnimation>
                        <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center" aria-label="Scroll down">
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
                    <span>FAQ</span>
                </div>
                <Separator />
            </div>

            <section className="py-28 px-4 md:px-12">
                <div className="max-w-4xl mx-auto">
                    {faqItems.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full space-y-6">
                            {faqItems.map((item, index) => (
                                <ScrollAnimation key={item.id} delay={index * 0.1}>
                                    <AccordionItem value={item.id} className="border-b">
                                        <AccordionTrigger
                                            onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                                            className="text-left hover:no-underline"
                                        >
                                            <span className="text-2xl md:text-3xl font-light flex-1 pr-4">{item.question}</span>
                                            <div className="relative h-8 w-8 flex-shrink-0">
                                                <AnimatePresence initial={false}>
                                                    {openAccordion !== item.id && (
                                                        <motion.div
                                                            key="plus"
                                                            initial={{ rotate: -90, opacity: 0 }}
                                                            animate={{ rotate: 0, opacity: 1 }}
                                                            exit={{ rotate: 90, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute inset-0"
                                                        >
                                                            <Plus className="h-8 w-8 text-muted-foreground" />
                                                        </motion.div>
                                                    )}
                                                    {openAccordion === item.id && (
                                                         <motion.div
                                                            key="minus"
                                                            initial={{ rotate: 90, opacity: 0 }}
                                                            animate={{ rotate: 0, opacity: 1 }}
                                                            exit={{ rotate: -90, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute inset-0"
                                                        >
                                                            <Minus className="h-8 w-8 text-primary" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="pt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </ScrollAnimation>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No frequently asked questions have been added yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
