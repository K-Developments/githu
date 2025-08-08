
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "@/components/ui/mobile-nav";
import { AnimatedHamburgerButton } from "@/components/ui/animated-hamburger";

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const Logo = () => (
    <Link href="/" className="logo block relative w-20 h-16" onClick={() => setIsMenuOpen(false)}>
      {logoUrl ? (
        <Image 
          src={logoUrl} 
          alt="Island Hopes Logo" 
          fill 
          style={{ objectFit: 'contain' }} 
        />
      ) : (
        <span className="text-foreground font-bold text-lg tracking-widest">ISLAND</span>
      )}
    </Link>
  );

  if (!isClient) {
    return null; 
  }

  return (
    <>
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} logoUrl={logoUrl} />
      <div className="fixed top-4 right-4 z-[101] flex flex-col items-center gap-4 p-2 bg-background/80 backdrop-blur-sm rounded-lg border">
         <Logo />
         <AnimatedHamburgerButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            width={28} 
            height={20}
            color="hsl(var(--foreground))"
          />
      </div>
    </>
  );
}
