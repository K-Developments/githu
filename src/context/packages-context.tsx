
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Package } from '@/lib/data';

interface PackagesContextType {
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
  nextPackage: () => void;
  prevPackage: () => void;
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

export function PackagesProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const router = useRouter();

  const navigateToPackage = useCallback((pkg: Package) => {
    const newUrl = `/packages?package=${pkg.id}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  const nextPackage = useCallback(() => {
    if (!selectedPackage || packages.length <= 1) return;
    const currentIndex = packages.findIndex(p => p.id === selectedPackage.id);
    const nextIndex = (currentIndex + 1) % packages.length;
    navigateToPackage(packages[nextIndex]);
  }, [selectedPackage, packages, navigateToPackage]);

  const prevPackage = useCallback(() => {
    if (!selectedPackage || packages.length <= 1) return;
    const currentIndex = packages.findIndex(p => p.id === selectedPackage.id);
    const prevIndex = (currentIndex - 1 + packages.length) % packages.length;
    navigateToPackage(packages[prevIndex]);
  }, [selectedPackage, packages, navigateToPackage]);

  return (
    <PackagesContext.Provider value={{
      packages,
      setPackages,
      selectedPackage,
      setSelectedPackage,
      nextPackage,
      prevPackage
    }}>
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackagesContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
}
