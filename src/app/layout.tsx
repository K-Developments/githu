
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
import { PackagesProvider } from "@/context/packages-context";
import { useLenis } from "@/hooks/use-lenis";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

// Cached settings fetcher
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

// Dynamic meta tags generator
function generateMetaTags(siteSettings: SiteSettings | null, pathname: string) {
  const defaultTitle = "Island Hopes Travels";
  const defaultDescription = "Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you.";
  const defaultKeywords = "sri lanka, sri lanka travel,  luxury travel, island destinations, bespoke travel, exclusive resorts, tropical getaways, travel planning, vacation packages";
  const defaultImage = "https://islandhopestravels.com/og-image.jpg";
  const siteUrl = "https://islandhopestravels.com"; 
  
  const title = siteSettings?.siteTitle || defaultTitle;
  const description = siteSettings?.siteDescription || defaultDescription;
  const keywords = siteSettings?.keywords || defaultKeywords;
  const ogImage = siteSettings?.ogImage || defaultImage;
  const currentUrl = `${siteUrl}${pathname}`;
  
  return {
    title,
    description,
    keywords,
    ogImage,
    siteUrl,
    currentUrl
  };
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
  const meta = generateMetaTags(siteSettings, pathname);

  return (
    <html lang="en" className="scroll-smooth">
       <head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="Island Hopes Travels" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Favicon - More comprehensive set */}
        <link rel="icon" href="/logo.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.ico" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Island Hopes Travels" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.currentUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={meta.currentUrl} />
        
        {/* Font Loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
            href="https://fonts.googleapis.com/css2?family=Cormorant+Upright:wght@300;400;500;600;700&display=swap" 
            rel="stylesheet"
        />
        <link 
            href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" 
            rel="stylesheet"
        />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Island Hopes Travels",
            "description": meta.description,
            "url": meta.siteUrl,
            "logo": `${meta.siteUrl}/logo.jpg`,
            "image": meta.ogImage,
          })}
        </script>
      </head>
      <body className="font-body antialiased">
        <SiteSettingsProvider settings={siteSettings}>
          <PackagesProvider>
            <ScrollRestoration />
            <div className="noise-overlay"></div>
            {!isAdminPage && <Header logoUrl={siteSettings?.logoUrl} />}
            <main>{children}</main>
            {!isAdminPage && <Footer logoUrl={siteSettings?.logoUrl} />}
            {!isAdminPage && <BottomBar />}
            <Toaster />
          </PackagesProvider>
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
