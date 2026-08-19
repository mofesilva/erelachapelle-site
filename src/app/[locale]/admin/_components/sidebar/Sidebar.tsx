"use client";

import { Sidebar as SidebarPrimitive, SidebarRail } from "@/components/ui/sidebar";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader />
      <SidebarMenu />
      <SidebarFooter />
      <SidebarRail />
    </SidebarPrimitive>
  );
}
