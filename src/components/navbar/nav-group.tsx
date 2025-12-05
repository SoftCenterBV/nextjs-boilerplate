"use client"

import {
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {cn} from "@/lib/utils";
import {Link, usePathname} from "@/i18n/routing";

export function NavGroup({
                             title,
                             items,
                            }: {
    title?: string
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[],
}) {
    const pathname = usePathname()

    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => (

              <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                      asChild
                      className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          pathname === item.url
                              ? "bg-primary-foreground text-primary"
                              : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                  >
                      <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}
