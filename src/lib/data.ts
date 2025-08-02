export type Package = {
  id: string;
  title: string;
  location: string;
  description: string;
  images: string[];
  imageHints?: string[];
};

// This data is now seeded into Firestore and managed from the admin panel.
// It is kept here as a reference or for potential future use if Firestore is empty.
export const packages: Package[] = [
  {
    id: "maldives-bliss",
    title: "Maldivian Water Villa Bliss",
    location: "Maldives",
    description: "Escape to an overwater bungalow in the Maldives. Enjoy crystal-clear waters, pristine beaches, and ultimate relaxation.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["maldives resort", "overwater bungalow"],
  },
  {
    id: "costa-rica-jungle",
    title: "Costa Rican Jungle & Coast",
    location: "Costa Rica",
    description: "Immerse yourself in the 'Pura Vida' lifestyle with thrilling ziplines, lush rainforests, and stunning Pacific beaches.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["costa rica jungle", "zip line"],
  },
  {
    id: "santorini-sunset",
    title: "Santorini Sunset Romance",
    location: "Santorini, Greece",
    description: "Experience the magic of Santorini with its iconic white-washed villages, blue-domed churches, and world-famous sunsets.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["santorini sunset", "greece cliffside"],
  },
  {
    id: "bali-culture",
    title: "Bali's Cultural Heart",
    location: "Bali, Indonesia",
    description: "Discover the spiritual and cultural heart of Bali. Explore ancient temples, lush rice paddies, and vibrant local arts scenes.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["bali temple", "rice paddies"],
  },
];
