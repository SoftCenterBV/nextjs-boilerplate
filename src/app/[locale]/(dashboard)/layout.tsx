import { AppSidebar } from "@/components/navbar/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {AppHeader} from "@/components/app-header";
import { getCurrentUserProfile } from '@/lib/api/user';
import {logout} from "@/lib/api";
import {redirect} from "next/navigation";

export default async function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
        const result = await logout();
        if (result.success) {
            redirect(result.redirectUrl);
        } else {
            // If logout fails, redirect to login page as fallback
            redirect('/en/login');
        }
    }


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
