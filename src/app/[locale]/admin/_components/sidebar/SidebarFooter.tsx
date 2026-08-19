"use client";

import { useTranslations } from "next-intl";
import { SidebarMinimalisticBold } from "solar-icon-set";
import { SidebarFooter as SidebarFooterPrimitive, useSidebar } from "@/components/ui/sidebar";

export function SidebarFooter() {
  const t = useTranslations("admin.nav");
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  // Só `items-end`: alternar pra `items-center` ao fechar faria o botão saltar, porque
  // align-items não interpola. Encostado à direita ele acompanha a borda da sidebar
  // encolhendo — e na rail a caixa de conteúdo (56px - 8px de cada lado) tem exatamente
  // os 40px do botão, então o fim da animação já é o centro.
  return (
    <SidebarFooterPrimitive className="items-end px-2 pb-4">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? t("expand") : t("collapse")}
        className="flex size-10 items-center justify-center rounded-[8px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground [&>svg]:size-6 cursor-pointer"
      >
        <SidebarMinimalisticBold size={24} />
      </button>
    </SidebarFooterPrimitive>
  );
}
