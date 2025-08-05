
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AboutHeroData {
  headline: string;
  heroImage: string;
}

async function getAboutPageData(): Promise<AboutHeroData> {
    try {
        const contentDocRef = doc(db, 'content', 'about');
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            return {
                headline: data.hero?.headline || 'About Us',
                heroImage: data.hero?.heroImage || 'https://placehold.co/1920x600.png',
            };
        }
    } catch (error) {
        console.error('Error fetching about page data:', error);
    }

    return {
        headline: 'About Us',
        heroImage: 'https://placehold.co/1920x600.png',
    };
}


export default async function AboutPage() {
  const heroData = await getAboutPageData();

  return (
    <>
      <section className="h-[60vh] flex flex-col bg-white">
        <div className="flex-[0.7] flex items-center justify-center">
          <h1 className="text-6xl md:text-8xl font-bold font-headline text-center uppercase tracking-widest text-foreground">
            {heroData.headline}
          </h1>
        </div>
        <div className="flex-1 relative w-full">
          <Image
            src={heroData.heroImage}
            alt="A diverse team collaborating on travel plans"
            fill
            className="object-cover"
            data-ai-hint="team collaboration"
          />
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-left mb-12">Our Journey</h2>
          
          <div className="relative w-[60vw] h-[30vh] mx-auto mb-20">
            <Image 
              src="https://placehold.co/1200x400.png"
              alt="Our Journey"
              fill
              className="object-cover rounded-lg shadow-xl"
              data-ai-hint="journey path"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-headline mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world's most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it. Through meticulous planning, local expertise, and a commitment to luxury, we aim to inspire and fulfill the dreams of the modern explorer.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-headline mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures, nature, and themselves in profound ways. We strive to build a legacy of sustainable tourism and create a global community of passionate travelers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
