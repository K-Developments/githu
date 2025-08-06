
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnimatedHamburgerButton } from "@/components/ui/animated-hamburger";


export function Header({ logoUrl }: { logoUrl?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const Logo = () => (
    <Link href="/" className="logo">
      {logoUrl ? (
        <div style={{ position: 'relative', width: '150px', height: '40px' }}>
          <Image src={logoUrl} alt="Island Hopes Logo" fill style={{ objectFit: 'contain' }} />
        </div>
      ) : (
        <>ISLAND<span>HOPES</span></>
      )}
    </Link>
  );

  if (!isClient) {
    return (
        <header>
            <div className="header-left">
                <a href="/" className="logo">ISLAND<span>HOPES</span></a>
            </div>
            <div className="header-center">
                <nav className="desktop-nav">
                    <ul>
                        <li><a href="/destinations">Destinations</a></li>
                        <li><a href="/packages">Packages</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </div>
             <div className="header-right">
                <Button asChild><a href="#">Plan Trip</a></Button>
                <button className="search-button desktop-only" aria-label="Search">
                    <Search size={20} />
                </button>
            </div>
        </header>
    )
  }

  return (
    <>
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} logoUrl={logoUrl} />
      <header>
          <div className="header-left">
              <Logo />
          </div>
          <div className="header-center">
              <nav className="desktop-nav">
                  <ul>
                      <li><Link href="/destinations">Destinations</Link></li>
                      <li><Link href="/packages">Packages</Link></li>
                      <li><Link href="/about">About</Link></li>
                      <li><Link href="#">Contact</Link></li>
                  </ul>
              </nav>
              <div className="desktop-only ml-[1rem] flex items-center justify-center">
                 <DropdownMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
                    <DropdownMenuTrigger asChild>
                       <AnimatedHamburgerButton isOpen={isDesktopMenuOpen} width={20} height={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={16} alignOffset={-104}>
                        <DropdownMenuItem><Link href="#">FAQs</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="#">Gallery</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="#">Blog & News</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
          <div className="header-right">
              <Button asChild><Link href="#">Plan Trip</Link></Button>
              <button className="search-button desktop-only" aria-label="Search">
                  <Search size={20} />
              </button>
              <div className="hamburger-button">
                 <AnimatedHamburgerButton
                    isOpen={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    width={20} 
                    height={20}
                  />
              </div>
          </div>
      </header>
    </>
  );
}
