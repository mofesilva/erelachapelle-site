import type { ReactNode } from "react";
import type { SolarIcon } from "@/types/common";

type Props = {
  icon: SolarIcon;
  title: string;
  subtitle?: string;
  /** Slot das ações à direita (botão de adicionar, filtros…). */
  children?: ReactNode;
};

/** Cabeçalho padrão das telas do backoffice. */
export function PageHeader({ icon: Icon, title, subtitle, children }: Props) {
  return (
    // `-mx-4` cancela o padding horizontal de `(app)/layout.tsx` (`p-4`) só nesse elemento —
    // sem isso a borda de baixo parava 16px antes da borda real da área de conteúdo. `px-4` de
    // volta recompõe a posição do ícone/título, que devem ficar onde estavam. Mesma técnica do
    // `-m-4` do PostEditor, só que sem precisar tocar no layout da página inteira.
    <header className="-mx-4 flex items-center justify-between gap-4 border-b border-dust-grey px-4 pb-5">
      <div className="flex items-center gap-3.5">
        <span className="flex size-11 items-center justify-center bg-toffee-brown/12">
          <Icon size={22} color="var(--toffee-brown)" />
        </span>
        <div>
          {/* <h1> pela hierarquia da página, com o tamanho de h5 da escala — a regra de h1
              é a de hero do site público e não cabe num cabeçalho de backoffice. */}
          <h1 className="font-serif text-h5 text-carbon-black">{title}</h1>
          {subtitle && <p className="text-sm text-coffee-bean/70">{subtitle}</p>}
        </div>
      </div>

      {children}
    </header>
  );
}
