"use client"

import * as React from "react"

import {NavGroup} from "@/components/navbar/nav-group"
import { NavUser } from "@/components/navbar/nav-user"
import { TeamSwitcher } from "@/components/navbar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {SidebarData} from "@/data/sidebar";
import {TeamsData} from "@/data/teams";
import {OrganizationData, UserData} from "@/lib/api";
import {useTranslations} from "next-intl";

const sidebar = SidebarData();
const teams = TeamsData();

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    userProfile: UserData | null,
    organizations?: OrganizationData | null | any,
}

export function AppSidebar({ userProfile, organizations, ...props }: AppSidebarProps) {
    const t = useTranslations('menu');
  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={organizations} />
        </SidebarHeader>
        <SidebarContent>
          <NavGroup items={sidebar.main} />
          <NavGroup items={sidebar.documentation}  title={t('documentation')}/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser userProfile={userProfile} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}
