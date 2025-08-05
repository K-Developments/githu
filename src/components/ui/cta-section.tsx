
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import type { CtaData } from "@/lib/data";

export function CtaSection({ data }: { data: CtaData }) {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const getBackgroundImage = () => {
        if (hoveredItem !== null && data.interactiveItems && data.interactiveItems[hoveredItem]) {
            return data.interactiveItems[hoveredItem].backgroundImage;
        }
        return data.backgroundImage;
    };
    
    const interactiveItems = data.interactiveItems || [];

    return (
        <section className="home-page-call-to-action-section">
            <AnimatePresence>
                <motion.div
                    key={getBackgroundImage()}
                    className="cta-background-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <Image 
                        src={getBackgroundImage() || "https://placehold.co/1920x1080.png"} 
                        alt="Serene travel destination" 
                        fill 
                        className="object-cover" 
                        data-ai-hint="tropical beach"
                    />
                </motion.div>
            </AnimatePresence>
            <div className="cta-overlay"></div>

            <div className="cta-content-container">
                <ScrollAnimation>
                    <div className="cta-content">
                        <h2 className="cta-title">{data.title}</h2>
                        <div className="button-wrapper-for-border">
                            <Button asChild size="lg" className="w-full md:w-auto">
                                <Link href={data.buttonUrl}>{data.buttonText}</Link>
                            </Button>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
            
            <div className="cta-interactive-panel" onMouseLeave={() => setHoveredItem(null)}>
                {interactiveItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.linkUrl || '#'}
                        className="cta-interactive-item"
                        onMouseEnter={() => setHoveredItem(index)}
                    >
                        <h3 className="cta-item-title">{item.title}</h3>
                        <p className="cta-item-description">{item.description}</p>
                    </Link>
                ))}
            </div>

            <div className="cta-mobile-panel">
                {interactiveItems.map((item, index) => (
                    <Link key={index} href={item.linkUrl || '#'} className="cta-mobile-card">
                        <Image 
                            src={item.backgroundImage || "https://placehold.co/1920x1080.png"} 
                            alt={item.title}
                            fill
                            className="object-cover -z-10"
                        />
                        <div className="cta-mobile-card-overlay"></div>
                        <h3 className="cta-item-title">{item.title}</h3>
                        <p className="cta-item-description">{item.description}</p>
                    </Link>
                ))}
            </div>

        </section>
    );
}
