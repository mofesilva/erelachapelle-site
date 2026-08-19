"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAdminAuth } from "../_lib/auth-context";
import { Sidebar } from "../_components/sidebar/Sidebar";
import { UserMenu } from "../_components/UserMenu";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAdminAuth();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/${locale}/admin/login`);
    }
  }, [accessToken, locale, router]);

  if (!accessToken) return null;

  return (
    // Rail mais larga que o padrão (3rem) pra caber o botão de 40px: 8px + 40px + 8px.
    <SidebarProvider style={{ "--sidebar-width-icon": "3.5rem" } as React.CSSProperties}>
      <Sidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <UserMenu />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
