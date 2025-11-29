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
import {logout} from "@/lib/api";
import {startTransition} from "react";
import {router} from "next/client";
import {toast} from "sonner";

export function NavUser({
                          user,
                        }: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Flag/>
                    English
                </DropdownMenuItem>
                  <a href="/user/settings">
                    <DropdownMenuItem>
                        <User />
                        Profile
                    </DropdownMenuItem>
                  </a>

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
