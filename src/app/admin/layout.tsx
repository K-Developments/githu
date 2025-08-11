
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
function generateMetaTags(siteSettings: SiteSettings | null) {
  const defaultTitle = "Island Hopes Travels";
  const defaultDescription = "Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you.";
  const defaultKeywords = "sri lanka, sri lanka travel,  luxury travel, island destinations, bespoke travel, exclusive resorts, tropical getaways, travel planning, vacation packages";
  const defaultImage = "/images/og-image.jpg";
  const siteUrl = "https://islandhopestravels.com"; 
  
  const title = siteSettings?.siteTitle || defaultTitle;
  const description = siteSettings?.siteDescription || defaultDescription;
  const keywords = siteSettings?.keywords || defaultKeywords;
  const ogImage = siteSettings?.ogImage || defaultImage;
  
  return {
    title,
    description,
    keywords,
    ogImage,
    siteUrl,
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
  const meta = generateMetaTags(siteSettings);
  const currentUrl = `${meta.siteUrl}${pathname}`;

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
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={meta.title} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Island Hopes Travels" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content={meta.title} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@islandhopes" />
        <meta name="twitter:creator" content="@islandhopes" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.ogImage} />
        <meta name="twitter:image:alt" content={meta.title} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/mstile-310x310.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* DNS Prefetch and Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font Loading */}
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
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "LK"
            },
            "sameAs": [
              "https://web.facebook.com/profile.php?id=61552363521561",
              "https://www.instagram.com/island_hopes__travels",
            ],
            "serviceType": "Travel Agency",
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Travel Packages",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "TouristTrip",
                    "name": "Luxury Island Getaways"
                  }
                }
              ]
            }
          })}
        </script>
        
        {/* Performance and Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Disable automatic translation */}
        <meta name="google" content="notranslate" />
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
