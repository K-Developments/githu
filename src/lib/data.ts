
export type Destination = {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  imageHint?: string;
  linkUrl?: string;
};

export type Package = {
  id: string;
  categoryId: string;
  title: string;
  location: string;
  description: string;
  images: string[];
  imageHints?: string[];
  linkUrl?: string;
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
  imageHint?: string;
};
