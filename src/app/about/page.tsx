
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import type { CoreValue, WorkflowStep, CtaData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { WorkflowCarousel } from '@/components/ui/workflow-carousel';
import { CtaSection } from '@/components/ui/cta-section';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowDown } from 'lucide-react';
import { AnimatedText } from '@/components/ui/animated-text';

interface AboutPageData {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
  };
  intro: {
    paragraph: string;
  };
  journey: {
    title: string;
    image: string;
    secondaryImage: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
  };
  coreValues: CoreValue[];
  workflow: WorkflowStep[];
  ctaData: CtaData | null;
}

async function getAboutPageData(): Promise<AboutPageData | null> {
    try {
        const contentDocRef = doc(db, 'content', 'about');
        const contentDocSnap = await getDoc(contentDocRef);

        const homeContentDocRef = doc(db, "content", "home");
        const homeContentDocSnap = await getDoc(homeContentDocRef);
        
        let ctaData: CtaData | null = null;

        if (homeContentDocSnap.exists()) {
            const homeData = homeContentDocSnap.data();
            const cta = homeData.cta as CtaData;
            if (cta && !cta.interactiveItems) {
                cta.interactiveItems = [];
            }
            ctaData = cta;
        }

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            const coreValues = Array.isArray(data.coreValues) ? data.coreValues : [];
            const workflow = Array.isArray(data.workflow) ? data.workflow : [];
            
            return {
                hero: {
                  headline: data.hero?.headline || 'About Us',
                  heroImage: data.hero?.heroImage || 'https://placehold.co/1920x1080.png',
                  contentBackgroundImage: data.hero?.contentBackgroundImage || '',
                },
                intro: {
                  paragraph: data.intro?.paragraph || '',
                },
                journey: {
                  title: data.journey?.title || 'Our Journey',
                  image: data.journey?.image || 'https://placehold.co/1200x800.png',
                  secondaryImage: data.journey?.secondaryImage || 'https://placehold.co/600x800.png',
                  missionTitle: data.journey?.missionTitle || 'Our Mission',
                  missionText: data.journey?.missionText || 'To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world\'s most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it.',
                  visionTitle: data.journey?.visionTitle || 'Our Vision',
                  visionText: data.journey?.visionText || 'To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures and nature.',
                },
                coreValues,
                workflow,
                ctaData
            };
        } else {
             return {
                hero: {
                    headline: 'About Us',
                    heroImage: 'https://placehold.co/1920x1080.png',
                    contentBackgroundImage: '',
                },
                intro: {
                  paragraph: '',
                },
                journey: {
                    title: 'Our Journey',
                    image: 'https://placehold.co/1200x800.png',
                    secondaryImage: 'https://placehold.co/600x800.png',
                    missionTitle: 'Our Mission',
                    missionText: 'To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world\'s most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it.',
                    visionTitle: 'Our Vision',
                    visionText: 'To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures and nature.',
                },
                coreValues: [],
                workflow: [],
                ctaData,
            };
        }
    } catch (error) {
        console.error('Error fetching about page data:', error);
         return null;
    }
}

export default function AboutPage() {
    const [pageData, setPageData] = useState<AboutPageData | null>(null);

    useEffect(() => {
        getAboutPageData().then(setPageData);
    }, []);

    if (!pageData) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>; 
    }

    const { hero, intro, journey, coreValues, workflow, ctaData } = pageData;

    return (
        <div>
            <section
                className="h-[40vh] flex flex-col bg-white"
                id="journey-section"
            >
                <div 
                    className="flex-1 flex items-center justify-center p-4 relative"
                    style={{
                        backgroundImage: hero.contentBackgroundImage ? `url(${hero.contentBackgroundImage})` : `url(${hero.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <ScrollAnimation>
                        <h1 className="relative text-5xl md:text-8xl font-bold font-headline uppercase tracking-widest text-white">
                        {hero.headline}
                        </h1>
                    </ScrollAnimation>
                </div>
            </section>
            
            <div className="bg-white px-4 md:px-12">
                <Separator />
                <div className="text-sm text-muted-foreground py-4">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span className="mx-2">||</span>
                    <span>About</span>
                </div>
                <Separator />
            </div>

            {intro.paragraph && (
                <section className="py-16 md:py-24 px-4 md:px-12 bg-white">
                   <AnimatedText text={intro.paragraph} />
                </section>
            )}
            
            <section className="py-16 md:py-32 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-12">
                    <ScrollAnimation>
                        <Separator />
                        <h2 className="text-4xl md:text-5xl font-headline text-center my-8 md:my-12">{journey.title}</h2>
                        <Separator />
                    </ScrollAnimation>
                    
                    <div className="mt-16 md:mt-24 grid grid-cols-12 gap-x-8">
                        <div className="col-span-12 md:col-start-2 md:col-span-8 mb-8 md:mb-0">
                            <ScrollAnimation>
                                <div className="relative aspect-[16/11]">
                                    <Image
                                        src={journey.image}
                                        alt="Primary journey image"
                                        fill
                                        className="object-cover rounded-md shadow-xl"
                                        data-ai-hint="mountain landscape"
                                    />
                                </div>
                            </ScrollAnimation>
                        </div>
                        <div className="col-span-8 col-start-3 md:col-start-1 md:col-span-3 self-end">
                            <ScrollAnimation delay={0.2}>
                                <div className="relative aspect-[3/4] -mt-16 md:mt-0">
                                     <Image
                                        src={journey.secondaryImage}
                                        alt="Secondary journey image"
                                        fill
                                        className="object-cover rounded-md shadow-xl"
                                        data-ai-hint="travel detail person"
                                    />
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </div>
                <div className="bg-white py-16 md:py-24 -mt-24 md:-mt-32">
                    <div className="max-w-4xl mx-auto px-4 md:px-12 pt-16 md:pt-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <ScrollAnimation>
                                <div>
                                    <h3 className="text-3xl font-headline mb-4">{journey.missionTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{journey.missionText}</p>
                                </div>
                            </ScrollAnimation>
                            <ScrollAnimation delay={0.2}>
                                <div>
                                    <h3 className="text-3xl font-headline mb-4">{journey.visionTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{journey.visionText}</p>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </div>
            </section>

            {coreValues.length > 0 && (
                <section className="bg-background py-16 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 md:px-12">
                        <ScrollAnimation>
                            <h2 className="text-4xl md:text-5xl font-headline text-center mb-16 md:mb-24">Our Core Values</h2>
                        </ScrollAnimation>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-x-12 md:gap-y-24">
                        {coreValues.map((value, index) => (
                            <ScrollAnimation key={value.id} delay={index * 0.1}>
                                <div
                                className={cn(
                                    "relative",
                                    index % 2 !== 0 && "md:mt-16"
                                )}
                                >
                                    <div className="relative aspect-[4/3]">
                                        <Image
                                            src={value.image}
                                            alt={value.title}
                                            fill
                                            className="object-cover rounded-md shadow-lg"
                                            data-ai-hint="abstract texture"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-end justify-start p-6">
                                            <h3 className="text-white text-3xl font-headline">
                                                {value.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "bg-card p-6 md:p-8 rounded-md shadow-xl border -mt-8 md:w-4/5 relative z-10",
                                         index % 2 === 0 ? "ml-auto" : "mr-auto md:-ml-8"
                                    )}>
                                        <p className="text-muted-foreground leading-relaxed">
                                        {value.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        ))}
                        </div>
                    </div>
                </section>
            )}

            {workflow.length > 0 && (
                <section className="py-16 md:py-32 bg-white">
                    <div className="max-w-5xl mx-auto px-4 md:px-12">
                        <ScrollAnimation>
                            <h2 className="text-4xl md:text-5xl font-headline text-center mb-16 md:mb-20">Our Workflow</h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <WorkflowCarousel steps={workflow} />
                        </ScrollAnimation>
                    </div>
                </section>
            )}
            {ctaData && <CtaSection data={ctaData} />}
        </div>
    );
}
