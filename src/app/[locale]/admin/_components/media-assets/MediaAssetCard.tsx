"use client";

import { useLocale, useTranslations } from "next-intl";
import { BookBold, FileTextBold, GalleryBold, TrashBinTrashBoldDuotone } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { displayTitle, resolveMediaAssetUrl, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import type { Locale } from "@/types/common";

const FILE_TYPE_ICON = {
  pdf: FileTextBold,
  epub: BookBold,
  png: GalleryBold,
  jpeg: GalleryBold,
} as const;

const IMAGE_FILE_TYPES = new Set(["png", "jpeg"]);

type Props = {
  asset: MediaAsset;
  onDelete: (asset: MediaAsset) => void;
};

export function MediaAssetCard({ asset, onDelete }: Props) {
  const t = useTranslations("admin.mediaAssets");
  const locale = useLocale() as Locale;
  const Icon = FILE_TYPE_ICON[asset.fileType];
  const isImage = IMAGE_FILE_TYPES.has(asset.fileType);

  return (
    <div className="group relative flex flex-col border border-dust-grey bg-white">
      <div className="flex aspect-video items-center justify-center bg-powder-petal/30">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- fonte externa (API), sem otimização do next/image aqui
          <img
            src={resolveMediaAssetUrl(asset.url)}
            alt={displayTitle(asset, locale)}
            className="size-full object-cover"
          />
        ) : (
          <Icon size={40} color="var(--toffee-brown)" />
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label={t("delete")}
        className="absolute right-2 top-2 size-9 bg-white/90 text-coffee-bean opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        onClick={() => onDelete(asset)}
      >
        <TrashBinTrashBoldDuotone size={20} className="size-5" />
      </Button>

      <div className="flex flex-col gap-1 px-3 py-2.5">
        <span className="truncate font-serif text-carbon-black" title={displayTitle(asset, locale)}>
          {displayTitle(asset, locale)}
        </span>
        <div className="flex items-center justify-between text-xs text-coffee-bean/60">
          <span className="uppercase">{asset.fileType}</span>
          <span>{formatDate(asset.createdAt, locale)}</span>
        </div>
      </div>
    </div>
  );
}
