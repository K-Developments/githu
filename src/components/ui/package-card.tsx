
"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Package } from '@/lib/data';
import { cn } from '@/lib/utils';

export function PackageCard({ pkg, isMobile }: { pkg: Package, isMobile: boolean }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = isMobile ? 0 : useTransform(scrollYProgress, [0, 1], [-100, 100]);

    return (
        <Link href={`/packages?package=${pkg.id}`} passHref>
             <motion.div 
                ref={ref}
                className={cn(isMobile ? "package-card-v2-style" : "package-card group")}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                layout
            >
                <div className={cn(isMobile ? "package-card-v2-image" : "package-card-image-container")}>
                    <motion.div className="relative w-full h-full" style={{ y }}>
                        <Image
                            src={(pkg.images && pkg.images[0]) || "https://placehold.co/600x600.png"}
                            alt={`Image of ${pkg.title} package in ${pkg.location}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                        />
                    </motion.div>
                </div>
                 {isMobile ? (
                    <div className="package-card-v2-content">
                        <h3 className="package-card-title">{pkg.title}</h3>
                        <p className="package-card-location">{pkg.location}</p>
                    </div>
                ) : (
                    <>
                        <div className="package-card-overlay" />
                        <div className="package-card-content">
                            <h3 className="package-card-title">{pkg.title}</h3>
                            <p className="package-card-location">{pkg.location}</p>
                        </div>
                    </>
                )}
            </motion.div>
        </Link>
    );
}
