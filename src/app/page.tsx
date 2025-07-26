
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { 
  ChevronDown,
  ConciergeBell, 
  Umbrella, 
  Plane, 
  Shield, 
  Instagram, 
  Facebook, 
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroData {
  headline: string;
  description: string;
  buttonPrimary: string;
  buttonSecondary: string;
  backgroundUrl: string;
  videoUrl: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
}

export default function HomePage() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end start"],
  });

  const gridScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(docSnap.data().hero as HeroData);
        } else {
           setHeroData({
            headline: "Curated Luxury Travel Experiences",
            description: "Where exceptional service meets breathtaking destinations. Your private escape awaits beyond the ordinary.",
            buttonPrimary: "Explore Collections",
            buttonSecondary: "Book Consultation",
            backgroundUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            videoUrl: "https://placehold.co/600x400.mp4/EAE3A4/287289?text=Tropical+Escape",
            imageUrl1: "https://placehold.co/400x400.png",
            imageUrl2: "https://placehold.co/300x300.png",
            imageUrl3: "https://placehold.co/300x400.png",
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }

        if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down hide the navbar
          setShowNav(false);
        } else { // if scroll up show the navbar
          setShowNav(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);


  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Destinations", href: "#destinations" },
    { name: "Experiences", href: "#" },
    { name: "Yachts", href: "#" },
    { name: "Contact", href: "#footer" },
  ];

  const destinations = [
    {
      badge: "Exclusive",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      imageHint: "maldives resort",
      title: "Private Island Resort, Maldives",
      description: "Your own overwater villa with private butler, infinity pool, and direct lagoon access. Includes helicopter transfer from Malé.",
      price: "From $2,500/night"
    },
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      imageHint: "swiss alps",
      title: "Alpine Chalet, Switzerland",
      description: "Luxury ski-in/ski-out chalet with private chef, spa, and panoramic mountain views. Includes concierge ski service.",
      price: "From $3,200/night"
    },
    {
      badge: "New",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      imageHint: "safari lodge",
      title: "Wildlife Reserve, Tanzania",
      description: "Ultra-luxury tented camp with private game drives, bush dinners, and star bed experience.",
      price: "From $1,800/night"
    }
  ];

  const services = [
    { icon: ConciergeBell, title: "24/7 Concierge", description: "Dedicated travel curator available around the clock to fulfill your every request." },
    { icon: Umbrella, title: "Villa Selection", description: "Access to 5,000+ private villas and residences unavailable to the public." },
    { icon: Plane, title: "Private Transfers", description: "Helicopters, yachts and luxury vehicles arranged for seamless transitions." },
    { icon: Shield, title: "Discretion", description: "Complete privacy protocols for high-profile clients and confidential travel." }
  ];

  const footerLinks = {
    destinations: ["Caribbean", "Mediterranean", "Alpine", "Asia", "Private Islands"],
    services: ["Luxury Villa Rentals", "Yacht Charters", "Private Jet Travel", "Event Travel", "Honeymoons"]
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'py-5 bg-deep-ocean shadow-lg' : 'py-[30px]'}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <a href="#" className="font-headline text-2xl font-bold text-white tracking-[2px]">
            Island Hopes<span className="text-muted">Travels</span>
          </a>
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-10">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white text-sm font-medium tracking-wider uppercase relative pb-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-muted after:transition-all after:duration-300 hover:after:w-full">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">
       {heroData ? (
          <div ref={scrollContainerRef} className="relative h-[200vh] w-full">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{backgroundImage: `url(${heroData.backgroundUrl})`}} />
              <div className="absolute inset-0 bg-deep-ocean/30" />
              <motion.div style={{ opacity: gridOpacity }} className="container relative mx-auto grid md:grid-cols-2 gap-8 items-center h-full pt-20 md:pt-0">
                {/* Left Column: Hero Content */}
                <div className="max-w-xl text-left">
                  <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight mb-5 text-white text-shadow">
                    {heroData.headline}
                  </h1>
                  <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl font-light">
                    {heroData.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <a href="#" className="group relative inline-block rounded-none py-4 px-10 font-semibold tracking-wider uppercase text-sm text-white border border-white overflow-hidden z-10 transition-all duration-300">
                        <span className="absolute top-0 left-0 w-0 h-full bg-accent -z-10 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                        <span className="relative">{heroData.buttonPrimary}</span>
                    </a>
                    <a href="#" className="inline-block rounded-none py-4 px-10 font-semibold tracking-wider uppercase text-sm bg-accent text-white border border-accent hover:bg-transparent hover:text-white transition-all duration-300">
                      {heroData.buttonSecondary}
                    </a>
                  </div>
                </div>

                {/* Right Column: Broken Grid with Video and Images */}
                <motion.div style={{ y: gridScrollY }} className="relative h-[150vh] min-h-[500px] hidden md:block">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="relative w-full h-full">
                      {/* Main Video */}
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="absolute top-0 left-0 w-2/3 h-2/3 shadow-2xl overflow-hidden rounded-lg">
                        <video
                          src={heroData.videoUrl}
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {/* Small Image 1 */}
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute bottom-1/4 right-0 w-[45%] h-1/2 shadow-xl overflow-hidden rounded-lg border-8 border-white">
                        <Image
                          src={heroData.imageUrl1}
                          alt="Luxury travel 1"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          data-ai-hint="luxury beach"
                        />
                      </motion.div>
                      {/* Small Image 2 */}
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute bottom-0 left-1/4 w-1/3 h-1/2 shadow-lg overflow-hidden rounded-lg border-4 border-white z-10">
                        <Image
                          src={heroData.imageUrl2}
                          alt="Luxury travel 2"
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                          data-ai-hint="yacht deck"
                        />
                      </motion.div>
                      {/* Small Image 3 */}
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="absolute top-2/3 right-1/4 w-1/3 h-1/3 shadow-lg overflow-hidden rounded-lg border-4 border-white z-20">
                        <Image
                          src={heroData.imageUrl3}
                          alt="Luxury travel 3"
                          width={300}
                          height={400}
                          className="w-full h-full object-cover"
                          data-ai-hint="resort interior"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ opacity: gridOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-2xl animate-bounce">
                  <ChevronDown />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center">Loading...</div>
        )}

        <section id="destinations" className="py-28 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl md:text-5xl text-deep-ocean mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-accent">
                Signature Destinations
              </h2>
              <p className="mt-8 text-lg text-primary max-w-3xl mx-auto font-light">
                Our most exclusive properties hand-selected for the discerning traveler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {destinations.map((dest, index) => (
                <div key={index} className="bg-white shadow-lg hover:shadow-2xl transition-all duration-400 group overflow-hidden hover:-translate-y-2">
                  <div className="relative">
                    {dest.badge && <div className="absolute top-5 right-5 bg-accent text-white py-1 px-4 text-xs uppercase tracking-widest z-10">{dest.badge}</div>}
                    <div className="h-72 overflow-hidden">
                      <Image
                        src={dest.image}
                        alt={dest.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                        data-ai-hint={dest.imageHint}
                      />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-headline text-2xl text-deep-ocean mb-2">{dest.title}</h3>
                    <p className="text-gray-600 mb-5 font-light h-24">{dest.description}</p>
                    <div className="font-headline text-2xl text-accent mb-6">{dest.price}</div>
                    <a href="#" className="inline-block py-3 px-8 bg-deep-ocean text-white font-medium text-sm tracking-wider uppercase transition-colors hover:bg-primary">
                      Request Availability
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-28 bg-white">
          <div className="container mx-auto px-4">
             <div className="text-center mb-20">
                <h2 className="font-headline text-4xl md:text-5xl text-deep-ocean mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-accent">
                  Our Services
                </h2>
                <p className="mt-8 text-lg text-primary max-w-3xl mx-auto font-light">
                  Tailored experiences designed around your preferences
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {services.map((service, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-8">
                    <service.icon className="w-9 h-9 text-deep-ocean" />
                  </div>
                  <h3 className="font-headline text-2xl mb-4 text-deep-ocean">{service.title}</h3>
                  <p className="text-gray-600 font-light">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="py-28 text-white bg-cover bg-center bg-fixed relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"}}>
          <div className="absolute inset-0 bg-deep-ocean/70 z-10"></div>
          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-2xl italic mb-8 leading-relaxed font-light">
                "Island Hopes Travels transformed our anniversary trip into something magical. Every detail was perfection - from the private yacht charter to the surprise sunset dinner on the cliffs of Santorini. This is why we only travel with them."
              </p>
              <div className="font-headline text-xl">James & Sophia Laurent</div>
              <div className="text-sm opacity-80 font-light">Paris, France</div>
            </div>
          </div>
        </section>

        <section id="newsletter" className="py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-headline text-4xl text-deep-ocean mb-5">Join Our Circle</h2>
              <p className="text-deep-ocean mb-10 font-light">
                Receive exclusive access to private villas, yachts, and experiences before they're available to the public.
              </p>
              <form className="flex flex-col md:flex-row max-w-lg mx-auto border border-deep-ocean">
                <input type="email" placeholder="Your email address" className="flex-1 p-5 border-none bg-transparent text-deep-ocean placeholder:text-deep-ocean/70 focus:outline-none" />
                <button type="submit" className="py-5 px-10 bg-deep-ocean text-white font-medium tracking-wider uppercase text-sm transition-colors hover:bg-primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-black text-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <a href="#" className="font-headline text-2xl mb-5 inline-block">
                Island Hopes<span className="text-muted">Travels</span>
              </a>
              <p className="text-sm text-gray-400 font-light mb-5">Specializing in ultra-luxury travel experiences since 2008.</p>
              <div className="flex gap-4">
                <a href="#" className="text-muted hover:text-accent"><Instagram size={18} /></a>
                <a href="#" className="text-muted hover:text-accent"><Facebook size={18} /></a>
                <a href="#" className="text-muted hover:text-accent"><Twitter size={18} /></a>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-xl text-muted mb-6 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-accent">Destinations</h3>
              <ul className="space-y-3.5">
                {footerLinks.destinations.map(link => (
                  <li key={link}><a href="#" className="text-gray-400 text-sm font-light transition-all hover:text-muted hover:pl-1.5">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-xl text-muted mb-6 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-accent">Services</h3>
              <ul className="space-y-3.5">
                {footerLinks.services.map(link => (
                  <li key={link}><a href="#" className="text-gray-400 text-sm font-light transition-all hover:text-muted hover:pl-1.5">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-xl text-muted mb-6 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-accent">Contact</h3>
              <ul className="space-y-4 text-sm font-light">
                <li className="flex items-center gap-3 text-gray-400"><Phone size={16} className="text-accent"/> +1 (555) 327-8888</li>
                <li className="flex items-center gap-3 text-gray-400"><Mail size={16} className="text-accent"/> concierge@islandhopestravels.com</li>
                <li className="flex items-center gap-3 text-gray-400"><MapPin size={16} className="text-accent"/> 1000 Brickell Ave, Miami</li>
                <li className="flex items-center gap-3 text-gray-400"><Clock size={16} className="text-accent"/> 24/7 Service</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-500/20 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Island Hopes Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
    
