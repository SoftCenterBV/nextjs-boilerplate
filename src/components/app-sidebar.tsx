"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {NavGroup} from "@/components/nav-group"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {SidebarData} from "@/data/sidebar";
import {TeamsData} from "@/data/teams";
import {CurrentUserData} from "@/data/current-user";

const sidebar = SidebarData();
const teams = TeamsData();
const currentUser = CurrentUserData();

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={teams.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavGroup items={sidebar.main} />
          <NavGroup items={sidebar.documentation}  title="Documentation"/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={currentUser.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}
