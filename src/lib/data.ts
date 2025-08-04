
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


// This data is now seeded into Firestore and managed from the admin panel.
// This file only defines the data shapes (types).
