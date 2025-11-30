"use client"

import {ChevronsUpDown, Flag, LogOut, Monitor, Moon, Sun, User,} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {useTheme} from "next-themes";
import {logout, UserData} from "@/lib/api";
import {startTransition} from "react";
import {router} from "next/client";
import {toast} from "sonner";
import {Link} from "@/i18n/routing";
import {NL, US} from "country-flag-icons/react/3x2";
import languageSelector from "@/components/language-selector";
import LanguageSelector from "@/components/language-selector";

interface NavUserProps {
    userProfile: UserData | null;
}


export function NavUser({ userProfile }: NavUserProps) {
    const profileName = userProfile ? `${userProfile.data.first_name} ${userProfile.data.last_name}` : 'User';
    const profileEmail = userProfile?.data.email || '';
    const avatarSrc = userProfile?.data.avatar || undefined;
    const avatarFallback = userProfile
        ? `${userProfile.data.first_name?.[0] ?? ''}${userProfile.data.last_name?.[0] ?? ''}`
        : 'U';

    const { isMobile } = useSidebar()
  const { setTheme } = useTheme()

    const handleLogout = async () => {
        startTransition(() => {
            logout()
                .then((result) => {
                    if (result.success) {
                        // Logout successful, redirect to the specified URL
                        router.push(result.redirectUrl);
                    } else {
                        // Logout failed, show error message
                        const { error } = result;
                        const title = 'Logout Failed';
                        let description = 'An unknown error occurred during logout.';

                        // Extract the key part from the full messageKey
                        if (error.messageKey?.startsWith('auth.logout.')) {
                            description = error.messageKey.replace('auth.logout.', '');
                        }
                            toast.error(title, { description });
                    }
                })
                .catch(() => {
                    // This should only happen for unexpected errors
                    toast.error('failed', {
                        description: 'unknownError',
                    });
                });
        });
    };


    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarSrc} alt={profileName} />
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{profileName}</span>
                  <span className="truncate text-xs">{profileEmail}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarSrc} alt={profileName} />
                    <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{profileName}</span>
                    <span className="truncate text-xs">{profileEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                  <LanguageSelector/>
                  <Link href="/user/settings">
                    <DropdownMenuItem>
                        <User />
                        Profile
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSub>
                      <DropdownMenuSubTrigger><Sun className="mr-2 h-4 w-4" />Appearance</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => setTheme("light")}><Sun/>Light</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("dark")}><Moon/>Dark</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("system")}><Monitor/>System</DropdownMenuItem>
                          </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                  </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}
