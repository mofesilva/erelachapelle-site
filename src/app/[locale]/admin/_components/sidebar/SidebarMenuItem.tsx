"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemPrimitive,
} from "@/components/ui/sidebar";
import type { NavItem } from "../../_lib/nav-items";

export function SidebarMenuItem({ href, labelKey, icon: Icon }: NavItem) {
  const t = useTranslations("admin.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const fullHref = `/${locale}${href}`;
  const label = t(labelKey);
  // Home é a única rota que não pode casar por prefixo (toda rota do admin começa com
  // "/admin", senão Home ficaria sempre marcado). As demais têm sub-rotas (ex.: editor de
  // posts em /admin/posts/new e /admin/posts/[id]) que também devem manter o item marcado.
  const isActive = href === "/admin" ? pathname === fullHref : pathname === fullHref || pathname.startsWith(`${fullHref}/`);

  return (
    <SidebarMenuItemPrimitive>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        /* Ícone 24px + p-2 do shadcn dos dois lados = caixa de 40px; na rail o botão vira
           quadrado desse tamanho, que é o que deixa o ícone centralizado. */
        className="h-10 rounded-none [&>svg]:size-6! data-[active=true]:bg-toffee-brown data-[active=true]:text-carbon-black group-data-[collapsible=icon]:size-10!"
      >
        <Link href={fullHref}>
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemPrimitive>
  );
}
