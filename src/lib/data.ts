
export type Destination = {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
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

    