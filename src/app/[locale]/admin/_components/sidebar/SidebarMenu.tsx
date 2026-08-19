"use client";

import { SidebarContent, SidebarMenu as SidebarMenuPrimitive } from "@/components/ui/sidebar";
import { useAdminAuth } from "../../_lib/auth-context";
import { NAV_ITEMS } from "../../_lib/nav-items";
import { SidebarMenuItem } from "./SidebarMenuItem";

export function SidebarMenu() {
  const { user } = useAdminAuth();
  // Itens sem `roles` são visíveis pra qualquer papel logado.
  const items = NAV_ITEMS.filter(
    (item) => !("roles" in item) || (item.roles as readonly string[]).includes(user?.role ?? "")
  );

  // flex-none + mb-auto (com mt-auto no header) faz a sobra vertical se dividir igualmente
  // acima da logo e abaixo do menu — os dois centralizam juntos, como um bloco só.
  return (
    <SidebarContent className="flex-none mb-auto">
      {/* px-2 = (largura da rail - largura do botão) / 2 — centraliza os ícones na horizontal. */}
      <SidebarMenuPrimitive className="px-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.href} {...item} />
        ))}
      </SidebarMenuPrimitive>
    </SidebarContent>
  );
}
