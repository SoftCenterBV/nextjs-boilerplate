"use client";
import { AppSidebar } from "@/components/navbar/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {AppHeader} from "@/components/app-header";

import { useAuthGuard } from "@/hooks/useAuthGuard";


export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    useAuthGuard();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
