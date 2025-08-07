
'use client';

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ScrollRestoration } from "@/components/ui/scroll-restoration";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/data";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { useLenis } from "@/hooks/use-lenis";
import { useEffect, useState } from "react";


// Since metadata can't be exported from a client component, 
// we can define it in a separate async function and export it from the page.
// This is a common pattern for pages that need both client-side interactivity and server-generated metadata.
// However, for a layout, we must lift the metadata export. 
// The following metadata is not applied because this is a client component.
// We'll move the data fetching and metadata to a new RootLayoutWrapper server component.

async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const contentDocRef = doc(db, "content", "home");
        const contentDocSnap = await getDoc(contentDocRef);
        if (contentDocSnap.exists()) {
            const data = contentDocSnap.data();
            return (data.siteSettings || null) as SiteSettings | null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}

function RootLayoutContent({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings | null;
}) {
  useLenis();
  return (
    <html lang="en" className="scroll-smooth">
       <head>
        <title>Island Hopes - Bespoke Luxury Travel</title>
        <meta name="description" content="Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SiteSettingsProvider settings={siteSettings}>
          <ScrollRestoration />
          <div className="noise-overlay"></div>
          <Header logoUrl={siteSettings?.logoUrl} />
          <main>{children}</main>
          <Footer logoUrl={siteSettings?.logoUrl} />
          <Toaster />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
  }, []);

  return (
    <RootLayoutContent siteSettings={siteSettings}>
      {children}
    </RootLayoutContent>
  );
}
