

'use client';

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BottomBar } from "@/components/ui/bottom-bar";
import { ScrollRestoration } from "@/components/ui/scroll-restoration";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/data";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { useLenis } from "@/hooks/use-lenis";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth">
       <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Island Hopes - Bespoke Luxury Travel</title>
        <meta name="description" content="Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Upright:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SiteSettingsProvider settings={siteSettings}>
          <ScrollRestoration />
          <div className="noise-overlay"></div>
          {!isAdminPage && <Header logoUrl={siteSettings?.logoUrl} />}
          <main>{children}</main>
          {!isAdminPage && <Footer logoUrl={siteSettings?.logoUrl} />}
          {!isAdminPage && <BottomBar />}
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
