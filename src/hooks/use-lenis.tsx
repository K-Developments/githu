'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.5, // Increased duration for a slower, smoother scroll
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical', // Changed from 'direction' to 'orientation'
        gestureOrientation: 'vertical', // Changed from 'gestureDirection' to 'gestureOrientation'
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: true, // Ensure this is true for mobile smoothness
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy();
    };
  }, [])
}