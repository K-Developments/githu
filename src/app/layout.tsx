import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Azure Voyages | Luxury Travel Curators",
  description: "Your serene getaway to the world's most beautiful islands.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background antialiased overflow-x-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
