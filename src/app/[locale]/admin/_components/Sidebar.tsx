"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NAV_ITEMS } from "../_lib/nav-items";

export function Sidebar() {
  const t = useTranslations("admin.nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader>
        <span className="px-2 py-1 text-sm font-semibold">La Chapelle</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const fullHref = `/${locale}${href}`;
            const active = pathname === fullHref;

            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={active} tooltip={t(labelKey)}>
                  <Link href={fullHref}>
                    <Icon size={16} />
                    <span>{t(labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </SidebarPrimitive>
  );
}
