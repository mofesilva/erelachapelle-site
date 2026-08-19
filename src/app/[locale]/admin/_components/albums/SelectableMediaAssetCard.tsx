"use client";

import { useLocale } from "next-intl";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { displayTitle, resolveMediaAssetUrl, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import type { Locale } from "@/types/common";

type Props = {
  asset: MediaAsset;
  selected: boolean;
  onToggle: (asset: MediaAsset) => void;
};

export function SelectableMediaAssetCard({ asset, selected, onToggle }: Props) {
  const locale = useLocale() as Locale;
  const title = displayTitle(asset, locale);

  return (
    <button
      type="button"
      onClick={() => onToggle(asset)}
      aria-pressed={selected}
      className={cn(
        "group relative flex cursor-pointer flex-col border bg-white text-left transition-colors",
        selected ? "border-toffee-brown ring-1 ring-toffee-brown" : "border-dust-grey hover:border-toffee-brown/50"
      )}
    >
      <div className="flex aspect-video items-center justify-center bg-powder-petal/30">
        {/* eslint-disable-next-line @next/next/no-img-element -- fonte externa (API), sem otimização do next/image aqui */}
        <img src={resolveMediaAssetUrl(asset.url)} alt={title} className="size-full object-cover" />
      </div>

      {/* Indicador visual, não interativo: o card inteiro já é o alvo do clique, um
          <Checkbox> de verdade (Radix) renderiza como <button> e não pode ficar dentro
          de outro <button> — HTML inválido, quebra a hidratação. */}
      <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded bg-white/90">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-white"
          )}
        >
          {selected && <CheckIcon className="size-3.5" />}
        </span>
      </span>

      <div className="px-3 py-2.5">
        <span className="block truncate font-serif text-carbon-black" title={title}>
          {title}
        </span>
      </div>
    </button>
  );
}
