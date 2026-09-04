"use client";

import { useLocale } from "next-intl";
import { FileTextBold } from "solar-icon-set";
import { displayTitle, resolveMediaAssetUrl, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import type { Locale } from "@/types/common";

const IMAGE_FILE_TYPES = new Set(["png", "jpeg"]);

type Props = {
  asset: MediaAsset;
  onSelect: (asset: MediaAsset) => void;
};

/** Card de seleção única (sem checkbox) — ao contrário de `SelectableMediaAssetCard` do
 * Album, um clique já escolhe e fecha o diálogo, não acumula seleção. */
export function MediaAssetPickerCard({ asset, onSelect }: Props) {
  const locale = useLocale() as Locale;
  const title = displayTitle(asset, locale);
  const isImage = IMAGE_FILE_TYPES.has(asset.fileType);
  const thumbnailUrl = asset.coverUrl ?? (isImage ? asset.url : undefined);

  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className="group flex cursor-pointer flex-col border border-dust-grey bg-white text-left transition-colors hover:border-toffee-brown/50"
    >
      <div className="flex aspect-video items-center justify-center bg-powder-petal/30">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- fonte externa (API), sem otimização do next/image aqui
          <img src={resolveMediaAssetUrl(thumbnailUrl)} alt={title} className="size-full object-cover" />
        ) : (
          <FileTextBold size={32} color="var(--toffee-brown)" />
        )}
      </div>

      <div className="px-3 py-2.5">
        <span className="block truncate font-serif text-carbon-black" title={title}>
          {title}
        </span>
      </div>
    </button>
  );
}
