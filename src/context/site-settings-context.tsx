
"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { SiteSettings } from '@/lib/data';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children, settings }: { children: ReactNode; settings: SiteSettings | null }) {
  return (
    <SiteSettingsContext.Provider value={{ settings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context.settings;
}
