
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Packages', href: '/packages' },
    { title: 'Destinations', href: '/destinations' },
    { title: 'Services', href: '/services' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="site-footer border-t py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12 text-center py-4 bg-[#f5f5f5]">
        
        <h2 className="text-3xl md:text-4xl font-headline tracking-widest uppercase mb-4">
          Island Hopes Travels
        </h2>

        {logoUrl && (
          <div className="flex justify-center my-8">
            <Link href="/" className="logo block relative w-[150px] h-[40px]">
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

        <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>&copy; {year} Island Hopes. All rights reserved.</p>
            <p>Design and Developed by Limidora</p>
        </div>

      </div>
    </footer>
  );
}
