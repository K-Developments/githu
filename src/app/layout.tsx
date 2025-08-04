
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { Home } from "lucide-react";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/" tooltip="Home Page">
                                <Home />
                                <span>Home Page</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
