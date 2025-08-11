
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
      <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
        
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
          <div className="grid grid-flow-col auto-cols-auto justify-center items-center">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link href={link.href} className="px-4 md:px-8 py-4 text-lg md:text-xl font-light text-muted-foreground hover:text-primary transition-colors">
                  {link.title}
                </Link>
                {index < navLinks.length - 1 && (
                  <Separator orientation="vertical" className="h-6" />
                )}
              </React.Fragment>
            ))}
          </div>
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
