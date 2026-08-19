"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { SidebarHeader as SidebarHeaderPrimitive } from "@/components/ui/sidebar";

export function SidebarHeader() {
  const locale = useLocale();

  return (
    <SidebarHeaderPrimitive className="mt-auto items-center py-6 transition-[padding] duration-200 group-data-[collapsible=icon]:py-4">
      <Link href={`/${locale}/admin`}>
        {/* Logo vertical (quase quadrada): cabe grande na sidebar aberta e ainda encolhe
            pra dentro da rail — a horizontal estouraria a largura fechada. */}
        <Image
          src="/logos/logo_white_v.png"
          alt="Église Réformée Évangélique La Chapelle"
          width={818}
          height={779}
          priority
          className="h-24 w-auto transition-all duration-200 group-data-[collapsible=icon]:h-8"
        />
      </Link>
    </SidebarHeaderPrimitive>
  );
}
