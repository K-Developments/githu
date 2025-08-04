
'use client';
import {SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset} from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import { usePathname } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/app/admin" isActive={pathname === '/app/admin'} tooltip="Home Page">
                            <Home />
                            <span>Home Page</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <main className="p-4 md:p-6 bg-white">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
