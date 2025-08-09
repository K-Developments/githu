
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/context/site-settings-context";
import { useIsMobile } from "@/hooks/use-mobile";

export function BottomBar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const settings = useSiteSettings();
  const isMobile = useIsMobile();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isAtBottom = latest + window.innerHeight >= document.body.scrollHeight - 100;
    const isAtTop = latest < 200;

    if (isAtTop || isAtBottom) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
      { title: "Home", href: "/" },
      { title: "Destinations", href: "/destinations" },
      { title: "Packages", href: "/packages" },
      { title: "Contact", href: "/contact" },
  ];

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: "110%" },
  };

  return (
    <motion.div
      variants={variants}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bottom-bar"
    >
      <div className="bottom-bar-content">
        <nav className="bottom-bar-nav hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="bottom-bar-icons flex items-center gap-6">
          {settings?.phoneNumber && (
            <a href={`tel:${settings.phoneNumber}`} aria-label="Call us">
              <Phone size={24} />
            </a>
          )}
          {settings?.whatsappNumber && (
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp">
              <MessageCircle size={24} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

    