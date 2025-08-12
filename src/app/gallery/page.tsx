
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import type { GalleryImage, GalleryCategory } from '@/lib/data';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Preloader } from '@/components/ui/preloader';

interface GalleryPageData {
  hero: {
    headline: string;
  };
  images: GalleryImage[];
  categories: GalleryCategory[];
}

async function getGalleryPageData(): Promise<GalleryPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'gallery');
        const contentDocSnap = await getDoc(contentDocRef);
        
        const heroData = contentDocSnap.exists() ? contentDocSnap.data().hero : {
            headline: 'Gallery',
        };

        const imagesSnap = await getDocs(collection(db, "galleryImages"));
        const imagesData = imagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
        
        const categoriesSnap = await getDocs(collection(db, "galleryCategories"));
        const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryCategory));

        return {
            hero: heroData,
            images: imagesData,
            categories: categoriesData,
        };
    } catch (error) {
        console.error('Error fetching gallery page data:', error);
        return null;
    }
}

export default function GalleryPage() {
    const [pageData, setPageData] = useState<GalleryPageData | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    useEffect(() => {
        getGalleryPageData().then(setPageData);
    }, []);

    const filteredImages = pageData?.images.filter(image => 
        activeFilter === 'all' || image.category === activeFilter
    ) || [];

    if (!pageData) {
        return <Preloader />; 
    }

    const { hero, categories } = pageData;
    
    const handleScrollDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const heroSection = document.getElementById('hero-section-gallery');
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
                id="hero-section-gallery"
            >
                <div 
                    className="flex-1 flex items-center justify-center p-4 relative"
                    data-ai-hint="art gallery museum"
                >
                    <div className="relative text-center">
                        <ScrollAnimation>
                            <h1 className="text-5xl md:text-8xl font-bold font-headline uppercase tracking-widest text-foreground">
                                {hero.headline}
                            </h1>
                        </ScrollAnimation>
                        <button onClick={handleScrollDown} className="absolute left-1/2 -translate-x-1/2 bottom-[-8vh] h-20 w-px flex items-end justify-center mt-12 top-[7rem]" aria-label="Scroll down">
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
                <div className="text-xs text-muted-foreground py-4">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span className="mx-2">||</span>
                    <span>Gallery</span>
                </div>
                <Separator />
            </div>

            <section className="py-28 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ScrollAnimation className="flex justify-center flex-wrap gap-8 md:gap-12 my-8">
                        <button 
                            className={cn('gallery-filter', activeFilter === 'all' && 'active')}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                             <button 
                                key={cat.id}
                                className={cn('gallery-filter', activeFilter === cat.id && 'active')}
                                onClick={() => setActiveFilter(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </ScrollAnimation>
                    
                    <div className="masonry-gallery">
                        {filteredImages.map((image, index) => (
                             <motion.div 
                                key={image.id} 
                                className="masonry-item group"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                             >
                                <Image
                                    src={image.imageUrl}
                                    alt={image.title}
                                    width={500}
                                    height={700}
                                    className="object-cover w-full h-auto rounded-lg shadow-md"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                                    <h3 className="text-white text-xl font-headline">{image.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                     {filteredImages.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No images found for this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
