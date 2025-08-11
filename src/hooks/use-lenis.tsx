'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useIsMobile } from './use-mobile';

export function useLenis() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const lenisOptions = {
        duration: isMobile ? 4.5 : 1.5, // Even longer duration for mobile
        easing: (t: number) => isMobile 
          ? Math.min(1, 1.001 - Math.pow(2, -4 * t)) // Much gentler easing for mobile
          : Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const,
        gestureOrientation: 'vertical' as const,
        smoothWheel: true,
        wheelMultiplier: isMobile ? 0.4 : 1, // Even slower wheel scrolling on mobile
        syncTouch: true,
        touchMultiplier: isMobile ? 0.8 : 2, // Much lower touch sensitivity for very smooth mobile scroll
        infinite: false,
        lerp: isMobile ? 0.03 : 0.1, // Ultra-slow lerp for buttery smooth mobile scrolling
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