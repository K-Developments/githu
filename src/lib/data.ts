
import * as z from 'zod';

export type SiteSettings = {
  logoUrl?: string;
  siteTitle?: string;
  siteDescription?: string;
  introBackgroundImage?: string;
  quoteBackgroundImage?: string;
  destinationsBackgroundImage?: string;
  packagesBackgroundImage?: string;
  testimonialsBackgroundImage?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
};

export type Destination = {
  id: string;
  title: string;
  location: string;
  description: string;
  longDescription?: string;
  image: string;
  galleryImages?: string[];
  highlights?: string[];
  linkUrl?: string;
};

export type ItineraryDay = {
  title: string;
  activities: string[];
};

export type Package = {
  id: string;
  categoryId: string;
  title: string;
  location: string;
  overview: string;
  itinerary: ItineraryDay[];
  images: string[];
  linkUrl?: string;
  inclusions?: string[];
  exclusions?: string[];
  isFeatured?: boolean;
  duration?: string;
  groupSize?: string;
  destinationsCount?: string;
  rating?: string;
  reviewsCount?: string;
};

export type Category = {
    id: string;
    name: string;
};

export type Testimonial = {
  id: string;
  text: string;
  author: string;
  location: string;
  image: string;
};

export type CtaInteractiveItem = {
    title: string;
    description: string;
    linkUrl: string;
    backgroundImage: string;
};

export type CtaData = {
  title: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  interactiveItems: CtaInteractiveItem[];
};

export type CoreValue = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type WorkflowStep = {
  id:string;
  title: string;
  description: string;
  image: string;
};

export type TourPackage = {
    id: string;
    name: string;
    overview: string;
    itinerary: string;
    inclusions: string[];
    exclusions: string[];
    images: string[];
    category: string;
};

export type PackagesCtaData = {
  title: string;
  description: string;
  image: string;
};


export type HeroData = {
  headline: string;
  subtitle: string;
  sliderImages: string[];
  contentBackgroundImage?: string;
};
    
export type JourneyData = {
    title: string;
    image: string;
    secondaryImage: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
};

export type GalleryCategory = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};


export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  country: z.string().min(2, { message: "Please select your country." }),
  inquiryType: z.string().min(1, { message: "Please select an inquiry type." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type FormValues = z.infer<typeof formSchema>;
