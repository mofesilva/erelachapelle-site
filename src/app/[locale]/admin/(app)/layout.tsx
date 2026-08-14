"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAdminAuth } from "../_lib/auth-context";
import { Sidebar } from "../_components/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
