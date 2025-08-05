
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import type { CoreValue } from '@/lib/data';

interface AboutPageData {
  hero: {
    headline: string;
    heroImage: string;
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
}

async function getAboutPageData(): Promise<AboutPageData> {
    try {
        const contentDocRef = doc(db, 'content', 'about');
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            // Ensure coreValues is an array and provide a default if it's missing
            const coreValues = Array.isArray(data.coreValues) ? data.coreValues : [];
            // Ensure we have exactly 4 core values for the grid, adding placeholders if necessary
            while (coreValues.length < 4) {
              coreValues.push({
                id: `placeholder-${coreValues.length + 1}`,
                title: 'Our Value',
                description: 'A description of this core value, emphasizing our commitment to excellence and customer satisfaction.',
                image: 'https://placehold.co/600x600.png',
                imageHint: 'abstract concept'
              });
            }

            return {
                hero: {
                  headline: data.hero?.headline || 'About Us',
                  heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
                },
                journey: {
                  title: data.journey?.title || 'Our Journey',
                  image: data.journey?.image || 'https://placehold.co/1200x800.png',
                  missionTitle: data.journey?.missionTitle || 'Our Mission',
                  missionText: data.journey?.missionText || 'To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world\'s most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it.',
                  visionTitle: data.journey?.visionTitle || 'Our Vision',
                  visionText: data.journey?.visionText || 'To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures and nature.',
                },
                coreValues: coreValues.slice(0, 4) // Ensure we only take 4
            };
        }
    } catch (error) {
        console.error('Error fetching about page data:', error);
    }

    // Default data if Firestore fetch fails or document doesn't exist
    const defaultCoreValues = Array(4).fill(0).map((_, i) => ({
        id: `default-${i + 1}`,
        title: 'Our Value',
        description: 'A description of this core value, emphasizing our commitment to excellence and customer satisfaction.',
        image: 'https://placehold.co/600x600.png',
        imageHint: 'abstract concept'
    }));
    
    return {
        hero: {
            headline: 'About Us',
            heroImage: 'https://placehold.co/1920x600.png',
        },
        journey: {
            title: 'Our Journey',
            image: 'https://placehold.co/1200x800.png',
            missionTitle: 'Our Mission',
            missionText: 'To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world\'s most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it.',
            visionTitle: 'Our Vision',
            visionText: 'To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures and nature.',
        },
        coreValues: defaultCoreValues,
    };
}


export default async function AboutPage() {
  const pageData = await getAboutPageData();
  const { hero, journey, coreValues } = pageData;

  return (
    <div>
        <section className="h-[70vh] flex flex-col bg-white">
          <div className="flex-[0.7] flex items-center justify-center p-4">
            <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground">
              {hero.headline}
            </h1>
          </div>
          <div className="flex-1 relative w-full">
            <Image
              src={hero.heroImage}
              alt="A diverse team collaborating on travel plans"
              fill
              className="object-cover"
              data-ai-hint="team collaboration"
            />
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
            <h2 className="text-4xl md:text-5xl font-headline text-left mb-12">{journey.title}</h2>
            
            <div className="mb-16 md:mb-24">
                <div className="w-full h-[40vh] md:h-[60vh] relative">
                    <Image 
                      src={journey.image}
                      alt="Landscape of a journey"
                      fill
                      className="object-cover rounded-md shadow-xl"
                      data-ai-hint="journey landscape"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              <div>
                <h3 className="text-3xl font-headline mb-4">{journey.missionTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {journey.missionText}
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-headline mb-4">{journey.visionTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {journey.visionText}
                </p>
              </div>
            </div>
        </section>

        <section className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 md:px-12">
                <h2 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                    <div
                    key={value.id}
                    className="flex flex-col border"
                    >
                    <div className={`relative aspect-square w-full ${index === 1 || index === 2 ? 'order-2' : 'order-1'}`}>
                        <Image
                        src={value.image}
                        alt={value.title}
                        fill
                        className="object-cover"
                        data-ai-hint={value.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h3 className="text-white text-3xl font-headline text-center p-4">
                            {value.title}
                        </h3>
                        </div>
                    </div>
                    <div className={`p-6 bg-card flex-grow flex flex-col justify-center ${index === 1 || index === 2 ? 'order-1' : 'order-2'}`}>
                        <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    </div>
  );
}
