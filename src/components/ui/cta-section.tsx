
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import type { CtaData } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaSection({ data }: { data: CtaData }) {
    const interactiveItems = data.interactiveItems || [];

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.8,
                ease: "easeOut",
            },
        }),
    };

    return (
        <section className="py-28 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <ScrollAnimation className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-headline mb-6">{data.title}</h2>
                    <div className="button-wrapper-for-border inline-block">
                        <Button asChild size="lg">
                            <Link href={data.buttonUrl}>{data.buttonText}</Link>
                        </Button>
                    </div>
                </ScrollAnimation>

                <div className="space-y-20 md:space-y-32">
                    {interactiveItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="cta-item-row group"
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={itemVariants}
                        >
                            <div className="cta-item-content">
                                <span className="text-sm text-primary font-semibold tracking-widest">0{index + 1}</span>
                                <h3 className="text-3xl md:text-5xl font-headline my-4">{item.title}</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">{item.description}</p>
                                <Link href={item.linkUrl || '#'} className="standard-link">
                                    <span>Learn More</span>
                                </Link>
                            </div>
                            <div className="cta-item-image-wrapper">
                                 <div className="cta-item-line"></div>
                                <div className="cta-item-image">
                                    <Image
                                        src={item.backgroundImage || "https://placehold.co/800x1000.png"}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                        sizes="(min-width: 768px) 40vw, 90vw"
                                        data-ai-hint="tropical beach"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
