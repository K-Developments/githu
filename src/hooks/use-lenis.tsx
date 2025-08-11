'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useIsMobile } from './use-mobile';

export function useLenis() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const lenisOptions = {
        duration: isMobile ? 6.5 : 1.5, // Very long duration for mobile
        easing: (t: number) => isMobile 
          ? Math.min(1, 1.001 - Math.pow(2, -2 * t)) // Ultra-gentle easing for mobile
          : Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const,
        gestureOrientation: 'vertical' as const,
        smoothWheel: true,
        wheelMultiplier: isMobile ? 0.2 : 1, // Very slow wheel scrolling on mobile
        syncTouch: true,
        touchMultiplier: isMobile ? 0.4 : 2, // Very low touch sensitivity for extremely smooth mobile scroll
        infinite: false,
        lerp: isMobile ? 0.015 : 0.1, // Ultra-slow lerp for maximum smoothness
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