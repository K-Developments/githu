'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useIsMobile } from './use-mobile';

export function useLenis() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const lenisOptions = {
        duration: isMobile ? 2.2 : 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const, // Use 'as const' to specify the literal type
        gestureOrientation: 'vertical' as const, // Use 'as const' to specify the literal type
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: true,
        touchMultiplier: isMobile ? 2.5 : 2,
        infinite: false,
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