
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

interface AboutPageData {
  hero: {
    headline: string;
    heroImage: string;
    contentBackgroundImage?: string;
  };
  journey: {
    title: string;
    image: string;
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
                  heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
                  contentBackgroundImage: data.hero?.contentBackgroundImage || '',
                },
                journey: {
                  title: data.journey?.title || 'Our Journey',
                  image: data.journey?.image || 'https://placehold.co/1200x800.png',
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
                    heroImage: 'https://placehold.co/1920x600.png',
                    contentBackgroundImage: '',
                },
                journey: {
                    title: 'Our Journey',
                    image: 'https://placehold.co/1200x800.png',
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


export default async function AboutPage() {
  const pageData = await getAboutPageData();

  if (!pageData) {
      return <div>Error loading page data.</div>;
  }

  const { hero, journey, coreValues, workflow, ctaData } = pageData;

  return (
    <div>
        <section className="h-[70vh] flex flex-col bg-white">
            <div 
                className="flex-[0.7] flex items-center justify-center p-4 relative"
                style={{
                    backgroundImage: hero.contentBackgroundImage ? `url(${hero.contentBackgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {hero.contentBackgroundImage && <div className="absolute inset-0 bg-black/20"></div>}
                <ScrollAnimation>
                    <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-white relative">
                    {hero.headline}
                    </h1>
                </ScrollAnimation>
            </div>
            <div className="flex-1 relative w-full">
                <ScrollAnimation>
                    <Image
                    src={hero.heroImage}
                    alt="A diverse team collaborating on travel plans"
                    fill
                    className="object-cover"
                    />
                </ScrollAnimation>
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
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

        <section className="py-12 px-4 md:px-12 bg-white">
            <ScrollAnimation>
                <h2 className="text-4xl md:text-5xl font-headline text-left mb-12">{journey.title}</h2>
            </ScrollAnimation>
            
            <div className="mb-16 md:mb-24">
                <ScrollAnimation>
                    <div className="w-full h-[40vh] md:h-[60vh] relative">
                        <Image 
                        src={journey.image}
                        alt="Landscape of a journey"
                        fill
                        className="object-cover rounded-md shadow-xl"
                        />
                    </div>
                </ScrollAnimation>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              <ScrollAnimation>
                <div>
                  <h3 className="text-3xl font-headline mb-4">{journey.missionTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {journey.missionText}
                  </p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.2}>
                <div>
                  <h3 className="text-3xl font-headline mb-4">{journey.visionTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {journey.visionText}
                  </p>
                </div>
              </ScrollAnimation>
            </div>
        </section>

        {coreValues.length > 0 && (
            <section className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 md:px-12">
                    <ScrollAnimation>
                        <h2 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Core Values</h2>
                    </ScrollAnimation>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coreValues.map((value, index) => (
                        <ScrollAnimation key={value.id} delay={index * 0.1}>
                            <div
                            className="flex flex-col border"
                            >
                            <div className={cn('relative aspect-square w-full', (index === 1 || index === 3) && 'sm:order-2')}>
                                <Image
                                src={value.image}
                                alt={value.title}
                                fill
                                className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h3 className="text-white text-3xl font-headline text-center p-4">
                                    {value.title}
                                </h3>
                                </div>
                            </div>
                            <div className={cn('p-6 bg-card flex-grow flex flex-col justify-center', (index === 1 || index === 3) && 'sm:order-1')}>
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
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 md:px-12">
                    <ScrollAnimation>
                        <h2 className="text-4xl md:text-5xl font-headline text-center mb-20">Our Workflow</h2>
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

    