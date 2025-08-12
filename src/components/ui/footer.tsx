
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Packages', href: '/packages' },
    { title: 'Destinations', href: '/destinations' },
    { title: 'Services', href: '/services' },
    { title: 'Gallery', href: '/gallery' },
    { title: 'FAQ', href: '/faq' },
    { title: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
      { Icon: Facebook, href: '#' },
      { Icon: Twitter, href: '#' },
      { Icon: Instagram, href: '#' },
  ]

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="site-footer border-t py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4 bg-[#f5f5f5]">
        
        <div className="back-to-top-container mb-12">
          <button onClick={handleScrollTop} className="w-full h-full flex items-center justify-center">
            <span className="back-to-top-text">Back to Top</span>
            <div className="back-to-top-line"></div>
            <motion.div 
                className="back-to-top-arrow"
                initial={{ y: "100%", opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
            >
                <ArrowUp size={24} />
            </motion.div>
          </button>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-headline tracking-widest uppercase mb-4 text-center">
          Island Hopes Travels
        </h2>

        {logoUrl && (
          <div className="flex justify-center my-8">
            <Link href="/" className="logo block relative w-[5rem] h-[5rem]">
              <Image 
                src={logoUrl} 
                alt="Island Hopes Logo" 
                fill 
                style={{ objectFit: 'contain' }} 
              />
            </Link>
          </div>
        )}

        <div className="my-12">
          <Separator />
          <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 md:gap-x-8 py-4">
            {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="px-2 py-2 text-base md:text-lg font-light text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4 hover:decoration-black transition-colors"
                >
                  {link.title}
                </Link>
            ))}
          </nav>
          <Separator />
        </div>
        
        <div className="flex justify-center items-center gap-6 my-10">
            {socialLinks.map(({Icon, href}, index) => (
                 <a 
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Follow us on ${Icon.displayName}`}
                 >
                     <Icon size={24} />
                 </a>
            ))}
        </div>

        <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>&copy; {year} Island Hopes. All rights reserved.</p>
            <p>Design and Developed by Limidora</p>
        </div>

      </div>
    </footer>
  );
}
