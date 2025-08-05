
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { Package, Category, Destination, Testimonial, CtaData } from "@/lib/data";
import HomeClient from "./home-client";

// Define interfaces for the fetched data
interface HeroData {
  headline: string;
  description: string;
  sliderImages: string[];
}

interface IntroData {
  headline:string;
  paragraph: string;
  linkText: string;
  linkUrl: string;
  portraitImage: string;
  landscapeImage: string;
}

interface QuoteData {
  text: string;
  image: string;
}

interface DestinationsData {
  title: string;
  subtitle: string;
  buttonUrl: string;
}

interface FeaturedPackagesData {
    packageIds: string[];
}

async function getHomePageData() {
    try {
        // Fetch content from the 'home' document
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        
        let heroData: HeroData | null = null;
        let introData: IntroData | null = null;
        let quoteData: QuoteData | null = null;
        let destinationsData: DestinationsData | null = null;
        let ctaData: CtaData | null = null;
        let featuredPackageIds: string[] = [];

        if (contentDocSnap.exists()) {
          const data = contentDocSnap.data();
          heroData = data.hero as HeroData;
          introData = data.intro as IntroData;
          quoteData = data.quote as QuoteData;
          destinationsData = data.destinations as DestinationsData;
          const cta = data.cta as CtaData;
          if (cta && !cta.interactiveItems) {
            cta.interactiveItems = [];
          }
          ctaData = cta;
          const featuredPackages = data.featuredPackages as FeaturedPackagesData;
          if (featuredPackages && featuredPackages.packageIds) {
            featuredPackageIds = featuredPackages.packageIds;
          }
        }

        // Fetch collections
        const destinationsSnap = await getDocs(collection(db, "destinations"));
        const destinations = destinationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));

        const categoriesSnap = await getDocs(collection(db, "categories"));
        const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        let packages: Package[] = [];
        if (featuredPackageIds.length > 0) {
            const packagesQuery = query(collection(db, "packages"), where('__name__', 'in', featuredPackageIds));
            const packagesSnap = await getDocs(packagesQuery);
            packages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        }

        const testimonialsSnap = await getDocs(collection(db, "testimonials"));
        const testimonials = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));

        return {
          heroData,
          introData,
          quoteData,
          destinationsData,
          ctaData,
          destinations,
          packages,
          categories,
          testimonials,
        };

      } catch (error) {
        console.error("Error fetching homepage data:", error);
        return {
            heroData: null,
            introData: null,
            quoteData: null,
            destinationsData: null,
            ctaData: null,
            destinations: [],
            packages: [],
            categories: [],
            testimonials: [],
        }
      }
}


// Main component for the homepage
export default async function HomePage() {
  const pageData = await getHomePageData();

  return <HomeClient {...pageData} />;
}
