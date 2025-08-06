
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ScrollRestoration } from "@/components/ui/scroll-restoration";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { SiteSettings } from "@/lib/data";
import React from "react";


export const metadata: Metadata = {
  title: "Island Hopes - Bespoke Luxury Travel",
  description: "Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you.",
  openGraph: {
    title: "Island Hopes - Bespoke Luxury Travel",
    description: "Discover the world's most exclusive island destinations with Island Hopes. We craft bespoke, luxury travel experiences and unforgettable journeys tailored to you.",
    url: "https://your-website-url.com", // Replace with your actual domain
    siteName: "Island Hopes",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', // A default image for sharing
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ScrollRestoration />
        <div className="noise-overlay"></div>
        <Header logoUrl={siteSettings?.logoUrl} />
        <main>
           {React.cloneElement(children as React.ReactElement, { siteSettings })}
        </main>
        <Footer logoUrl={siteSettings?.logoUrl} />
        <Toaster />
      </body>
    </html>
  );
}

    