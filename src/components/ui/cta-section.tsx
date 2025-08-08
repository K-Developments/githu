
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import type { CtaData } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaSection({ data }: { data: CtaData }) {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    
    const interactiveItems = data.interactiveItems || [];

    return (
        <section className="home-page-call-to-action-section">
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto w-full">
                <div className="cta-content-panel" onMouseLeave={() => setHoveredItem(null)}>
                    <ScrollAnimation>
                        <h2 className="cta-title">{data.title}</h2>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <div className="button-wrapper-for-border">
                            <Button asChild size="lg">
                                <Link href={data.buttonUrl}>{data.buttonText}</Link>
                            </Button>
                        </div>
                    </ScrollAnimation>
                    
                    <div className="cta-interactive-list">
                        {interactiveItems.map((item, index) => (
                             <ScrollAnimation delay={0.2 + (index * 0.1)} key={index}>
                                <Link
                                    href={item.linkUrl || '#'}
                                    className={cn(
                                        "cta-interactive-list-item group",
                                        hoveredItem === index && "is-hovered"
                                    )}
                                    onMouseEnter={() => setHoveredItem(index)}
                                >
                                    <div className="flex-grow">
                                        <h3 className="cta-item-title">{item.title}</h3>
                                        <p className="cta-item-description">{item.description}</p>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-2 group-hover:text-primary" />
                                </Link>
                             </ScrollAnimation>
                        ))}
                    </div>
                </div>
                <div className="cta-image-panel">
                    <AnimatePresence>
                        {hoveredItem !== null && (
                            <motion.div
                                key={hoveredItem}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="w-full h-full"
                            >
                                <Image 
                                    src={interactiveItems[hoveredItem].backgroundImage || "https://placehold.co/800x1000.png"} 
                                    alt={interactiveItems[hoveredItem].title}
                                    fill 
                                    className="object-cover rounded-lg" 
                                    data-ai-hint="tropical beach"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

             {/* Mobile Layout */}
            <div className="md:hidden w-full px-4">
                 <ScrollAnimation>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-headline mb-4">{data.title}</h2>
                         <div className="button-wrapper-for-border inline-block">
                            <Button asChild size="lg">
                                <Link href={data.buttonUrl}>{data.buttonText}</Link>
                            </Button>
                        </div>
                    </div>
                </ScrollAnimation>
                <div className="cta-mobile-panel">
                    {interactiveItems.map((item, index) => (
                        <ScrollAnimation delay={index * 0.1} key={index}>
                            <Link href={item.linkUrl || '#'} className="cta-mobile-card">
                                <Image 
                                    src={item.backgroundImage || "https://placehold.co/1920x1080.png"} 
                                    alt={item.title}
                                    fill
                                    className="object-cover -z-10 rounded-lg"
                                />
                                <div className="cta-mobile-card-overlay"></div>
                                <h3 className="cta-item-title-mobile">{item.title}</h3>
                                <p className="cta-item-description-mobile">{item.description}</p>
                            </Link>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}
