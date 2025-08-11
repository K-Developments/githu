
'use client';

import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Images, Star, Map, MessageSquare, HelpCircle, Settings, Contact, Briefcase } from 'lucide-react';


const adminNavItems = [
  { href: '/admin', label: 'Home Page', icon: Home },
  { href: '/admin/about', label: 'About Page', icon: Newspaper },
  { href: '/admin/services', label: 'Services Page', icon: Briefcase },
  { href: '/admin/packages', label: 'Packages Page', icon: Star },
  { href: '/admin/destinations', label: 'Destinations Page', icon: Map },
  { href: '/admin/gallery', label: 'Gallery Page', icon: Images },
  { href: '/admin/contact', label: 'Contact Page', icon: Contact },
  { href: '/admin/faq', label: 'FAQ Page', icon: HelpCircle },
  { href: '/admin/submissions', label: 'Submissions', icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="font-body antialiased admin-layout">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </SidebarHeader>
            <SidebarBody>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                            <SidebarMenuButton isActive={pathname === item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarBody>
          </Sidebar>
          <SidebarInset>
             <div className="p-4 md:p-8">
               {children}
             </div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
