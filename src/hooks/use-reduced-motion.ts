"use client";

import { useState, useEffect } from 'react';

// Fixed useIsMobile hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Return false during SSR to prevent hydration mismatches
  return isClient ? isMobile : false;
}

// Fixed useReducedMotion hook - CRITICAL FIX: Always call useIsMobile
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(true); // Default to true for SSR
  const [isClient, setIsClient] = useState(false);
  
  // IMPORTANT: Always call this hook, never conditionally
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
    
    // Check if matchMedia is available
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReduced(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      
      // Use the newer addEventListener if available, fallback to addListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    }
  }, []);

  // Always return the same logic path - never early return before all hooks are called
  if (!isClient) {
    return true; // Conservative default during SSR
  }

  return prefersReduced || isMobile;
}