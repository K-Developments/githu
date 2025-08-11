'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useIsMobile } from './use-mobile';

export function useLenis() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const lenisOptions = {
        duration: isMobile ? 3.5 : 1.5, // Much longer duration for mobile
        easing: (t: number) => isMobile 
          ? Math.min(1, 1.001 - Math.pow(2, -6 * t)) // Gentler easing for mobile
          : Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const,
        gestureOrientation: 'vertical' as const,
        smoothWheel: true,
        wheelMultiplier: isMobile ? 0.6 : 1, // Slower wheel scrolling on mobile
        syncTouch: true,
        touchMultiplier: isMobile ? 1.2 : 2, // Much lower touch sensitivity for smoother mobile scroll
        infinite: false,
        lerp: isMobile ? 0.05 : 0.1, // Much slower lerp for ultra-smooth mobile scrolling
    };

    const lenis = new Lenis(lenisOptions);

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy();
    };
  }, [isMobile])
}