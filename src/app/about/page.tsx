
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
    <div>
      <div>
        <section className="h-[60vh] flex flex-col bg-white">
          <div className="flex-[0.7] flex items-center justify-center p-4">
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

        <section className="py-20 px-4 md:px-12 bg-white">
            <h2 className="text-4xl md:text-5xl font-headline text-left mb-12">Our Journey</h2>
            
            <div className="relative mb-16 md:mb-24">
                <div className="w-full md:w-4/5 h-[40vh] md:h-[50vh] ml-auto">
                    <Image 
                      src="https://placehold.co/1200x800.png"
                      alt="Landscape of a journey"
                      fill
                      className="object-cover rounded-md shadow-xl"
                      data-ai-hint="journey landscape"
                    />
                </div>
                <div className="absolute bottom-[-10%] left-0 w-1/2 md:w-1/3 h-[30vh] md:h-[40vh]">
                     <Image 
                      src="https://placehold.co/800x1000.png"
                      alt="Portrait detail of the journey"
                      fill
                      className="object-cover rounded-md shadow-2xl border-4 border-white"
                      data-ai-hint="journey portrait"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 pt-12">
              <div className="md:pl-[35%]">
                <h3 className="text-3xl font-headline mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To craft unparalleled, bespoke travel experiences that transform moments into cherished memories. We are dedicated to unveiling the world's most exclusive destinations, ensuring every journey is as unique as the traveler embarking on it.
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-headline mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and innovative name in luxury travel, setting the standard for personalized service and extraordinary adventures. We envision a world where travel transcends the ordinary, connecting people with cultures and nature.
                </p>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}
