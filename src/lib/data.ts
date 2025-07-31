export type Package = {
  id: string;
  title: string;
  location: string;
  theme?: "Relaxation" | "Adventure" | "Romance" | "Culture";
  price?: number;
  duration?: number; // in days
  description: string;
  longDescription?: string;
  images: string[];
  imageHints?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  reviews?: { name: string; rating: number; text: string }[];
};

// This data is now seeded into Firestore and managed from the admin panel.
// It is kept here as a reference or for potential future use if Firestore is empty.
export const packages: Package[] = [
  {
    id: "maldives-bliss",
    title: "Maldivian Water Villa Bliss",
    location: "Maldives",
    theme: "Relaxation",
    price: 4500,
    duration: 7,
    description: "Escape to an overwater bungalow in the Maldives. Enjoy crystal-clear waters, pristine beaches, and ultimate relaxation.",
    longDescription: "Indulge in the ultimate luxury experience with a stay in a private overwater villa. Your days will be filled with sunbathing on your private deck, snorkeling in the vibrant house reef, and enjoying world-class cuisine with your feet in the sand. This package is designed for maximum tranquility and rejuvenation.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["maldives resort", "overwater bungalow"],
    itinerary: [
      { day: 1, title: "Arrival in Malé", description: "Transfer by seaplane to your private island resort. Settle in and enjoy a sunset cocktail." },
      { day: 2, title: "Snorkeling Adventure", description: "Explore the vibrant coral reefs and swim with tropical fish right from your villa." },
      { day: 3, title: "Spa & Wellness", description: "Indulge in a rejuvenating spa treatment at the award-winning wellness center." },
      { day: 4, title: "Private Beach Dinner", description: "Experience a romantic dinner under the stars on a secluded sandbank." },
      { day: 5, title: "Dolphin Cruise", description: "Embark on a sunset cruise to spot playful dolphins in their natural habitat." },
      { day: 6, title: "Leisure Day", description: "Enjoy the resort facilities at your own pace, from the infinity pool to water sports." },
      { day: 7, title: "Departure", description: "Enjoy a final breakfast before your seaplane transfer back to Malé." },
    ],
    reviews: [
      { name: "Alice & Bob", rating: 5, text: "Absolute paradise! The most relaxing week of our lives." },
      { name: "Clara", rating: 5, text: "The service was impeccable and the views were breathtaking." },
    ],
  },
  {
    id: "costa-rica-jungle",
    title: "Costa Rican Jungle & Coast",
    location: "Costa Rica",
    theme: "Adventure",
    price: 2800,
    duration: 10,
    description: "Immerse yourself in the 'Pura Vida' lifestyle with thrilling ziplines, lush rainforests, and stunning Pacific beaches.",
    longDescription: "This adventure-packed tour takes you from the misty cloud forests of Monteverde to the sun-drenched beaches of Manuel Antonio. You'll hike to volcanic craters, zipline through the canopy, spot incredible wildlife like sloths and monkeys, and learn to surf on the Pacific waves. Perfect for the thrill-seeker and nature lover.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["costa rica jungle", "zip line"],
    itinerary: [
      { day: 1, title: "Arrival in San José", description: "Arrive and transfer to your hotel. Explore the capital city." },
      { day: 2, title: "Arenal Volcano", description: "Travel to La Fortuna and hike the trails around the majestic Arenal Volcano." },
      { day: 3, title: "Zipline & Hot Springs", description: "Fly through the rainforest canopy on a zipline tour, then relax in volcanic hot springs." },
      { day: 4, title: "Monteverde Cloud Forest", description: "Journey to Monteverde and walk across the famous hanging bridges." },
      { day: 5, title: "Wildlife Night Walk", description: "Discover the nocturnal creatures of the cloud forest with an expert guide." },
      { day: 6, title: "Travel to Manuel Antonio", description: "Head to the Pacific coast and check into your beachside hotel." },
      { day: 7, title: "National Park Tour", description: "Explore Manuel Antonio National Park, famous for its sloths, monkeys, and beautiful beaches." },
      { day: 8, title: "Surf Lesson", description: "Learn to ride the waves with a professional surf instructor." },
      { day: 9, title: "Catamaran Cruise", description: "Enjoy a day on the water with a catamaran tour, including snorkeling and lunch." },
      { day: 10, title: "Departure", description: "Transfer back to San José for your flight home." },
    ],
    reviews: [
      { name: "David", rating: 5, text: "An unforgettable adventure! Every day was a new thrill." },
      { name: "Emily", rating: 4, text: "Saw so much wildlife! The guides were fantastic." },
    ],
  },
  {
    id: "santorini-sunset",
    title: "Santorini Sunset Romance",
    location: "Santorini, Greece",
    theme: "Romance",
    price: 3500,
    duration: 8,
    description: "Experience the magic of Santorini with its iconic white-washed villages, blue-domed churches, and world-famous sunsets.",
    longDescription: "Stay in a stunning cliffside hotel in Oia, offering panoramic views of the Aegean Sea. This romantic getaway includes a private catamaran cruise, wine tasting at local vineyards, and exploring ancient ruins. It's the perfect setting for a honeymoon, anniversary, or a special trip with your loved one.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["santorini sunset", "greece cliffside"],
    itinerary: [
      { day: 1, title: "Arrival in Santorini", description: "Arrive and transfer to your cliffside hotel in Oia. Enjoy the stunning caldera view." },
      { day: 2, title: "Oia Exploration", description: "Wander through the charming alleys of Oia and discover its iconic photo spots." },
      { day: 3, title: "Catamaran Cruise", description: "Sail around the caldera, swim in hot springs, and watch the sunset from the water." },
      { day: 4, title: "Wine Tasting Tour", description: "Visit traditional wineries and taste Santorini's unique Assyrtiko wines." },
      { day: 5, title: "Ancient Akrotiri", description: "Explore the remarkably preserved prehistoric city of Akrotiri, the 'Minoan Pompeii'." },
      { day: 6, title: "Fira & Cable Car", description: "Visit the island's capital, Fira, and take a cable car ride down to the old port." },
      { day: 7, title: "Red & Black Beaches", description: "Discover the unique volcanic beaches of Santorini, including the famous Red Beach." },
      { day: 8, title: "Departure", description: "Enjoy a last Greek coffee before heading to the airport for your departure." },
    ],
    reviews: [
      { name: "Frank & Grace", rating: 5, text: "The most romantic place on Earth. Island Hopes made it perfect." },
      { name: "Heidi", rating: 5, text: "A dream come true. The sunset cruise was a highlight!" },
    ],
  },
  {
    id: "bali-culture",
    title: "Bali's Cultural Heart",
    location: "Bali, Indonesia",
    theme: "Culture",
    price: 2200,
    duration: 9,
    description: "Discover the spiritual and cultural heart of Bali. Explore ancient temples, lush rice paddies, and vibrant local arts scenes.",
    longDescription: "Based in the artistic town of Ubud, this journey immerses you in Balinese culture. You'll witness traditional dance performances, take a cooking class, visit sacred temples like Uluwatu and Tanah Lot, and cycle through picturesque rice terraces. This is a journey for the soul, connecting you with the unique spirit of the Island of the Gods.",
    images: ["https://placehold.co/600x400.png", "https://placehold.co/600x400.png"],
    imageHints: ["bali temple", "rice paddies"],
    itinerary: [
      { day: 1, title: "Arrival in Denpasar", description: "Arrive and transfer to your boutique hotel in Ubud." },
      { day: 2, title: "Ubud Monkey Forest & Market", description: "Visit the sacred Monkey Forest and explore the vibrant Ubud art market." },
      { day: 3, title: "Balinese Cooking Class", description: "Learn the secrets of Balinese cuisine with a hands-on cooking class." },
      { day: 4, title: "Tegalalang Rice Terraces", description: "Cycle through the stunning Tegalalang rice paddies and visit a coffee plantation." },
      { day: 5, title: "Sacred Water Temple", description: "Participate in a purification ritual at Tirta Empul, the holy water temple." },
      { day: 6, title: "Kintamani Volcano", description: "Enjoy breathtaking views of Mount Batur volcano and its crater lake." },
      { day: 7, title: "Travel to Seminyak", description: "Move to the chic coastal town of Seminyak for some beach time." },
      { day: 8, title: "Tanah Lot & Uluwatu", description: "Visit the iconic sea temples of Tanah Lot and Uluwatu, and watch a Kecak fire dance at sunset." },
      { day: 9, "title": "Departure", "description": "Enjoy a final morning on the beach before your flight home." },
    ],
    reviews: [
      { name: "Irene", rating: 5, text: "A deeply moving and beautiful cultural experience." },
      { name: "Jake", rating: 4, text: "Ubud was amazing. A bit touristy in places, but the culture is rich." },
    ],
  },
];
