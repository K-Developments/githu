
'use client';

import React, { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <>
      <MobileNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <header>
          <div className="header-left">
              <a href="/" className="logo">ISLAND<span>HOPES</span></a>
          </div>
          <div className="header-center">
              <nav className="desktop-nav">
                  <ul>
                      <li><a href="#">Destinations</a></li>
                      <li><a href="#">Packages</a></li>
                      <li><a href="#">About</a></li>
                      <li><a href="#">Contact</a></li>
                  </ul>
              </nav>
              <div className="desktop-only">
                 <DropdownMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                           {isDesktopMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><a href="#">FAQs</a></DropdownMenuItem>
                        <DropdownMenuItem><a href="#">Gallery</a></DropdownMenuItem>
                        <DropdownMenuItem><a href="#">Blog & News</a></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
          <div className="header-right">
              <Button asChild><a href="#">Plan Trip</a></Button>
              <button className="search-button desktop-only" aria-label="Search">
                  <Search size={20} />
              </button>
              <div className="hamburger-button">
                 <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                 </button>
              </div>
          </div>
      </header>
    </>
  );
}
