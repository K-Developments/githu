
'use client';
import {SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset} from "@/components/ui/sidebar";
import { Home, User, Package, Map, Inbox } from "lucide-react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="admin-layout">
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/admin" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={pathname === '/admin'} tooltip="Home Page">
                                    <a>
                                        <Home />
                                        <span>Home Page</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <Link href="/admin/about" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/about'} tooltip="About Page">
                                    <a>
                                        <User />
                                        <span>About Page</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/admin/packages" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/packages'} tooltip="Packages Page">
                                    <a>
                                        <Package />
                                        <span>Packages Page</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/admin/destinations" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/destinations'} tooltip="Destinations Page">
                                    <a>
                                        <Map />
                                        <span>Destinations Page</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/admin/submissions" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/submissions'} tooltip="Submissions">
                                    <a>
                                        <Inbox />
                                        <span>Submissions</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <main className="p-4 md:p-6 bg-secondary/30">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
