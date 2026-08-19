"use client";

import { useTranslations } from "next-intl";
import { AltArrowLeftBold, AltArrowRightBold, GalleryBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "../../_features/media-assets/media-asset.controller";
import type { MediaAsset } from "../../_features/media-assets/media-asset.type";
import { MediaAssetCard } from "./MediaAssetCard";

const SKELETON_CLASS = "bg-dust-grey";

type Props = {
  assets: MediaAsset[];
  loading: boolean;
  loadFailed: boolean;
  onDelete: (asset: MediaAsset) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function MediaAssetsGrid({
  assets,
  loading,
  loadFailed,
  onDelete,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: Props) {
  const t = useTranslations("admin.mediaAssets");

  if (loadFailed) {
    return (
      <p className="border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
        {t("loadError")}
      </p>
    );
  }

  if (!loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <GalleryBold size={44} color="var(--toffee-brown)" />
        <p className="mt-5 font-serif text-carbon-black">{t("emptyTitle")}</p>
        <p className="mt-1.5 max-w-sm text-coffee-bean/70">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="flex flex-col border border-dust-grey bg-white">
                <Skeleton className={`aspect-video ${SKELETON_CLASS}`} />
                <div className="flex flex-col gap-2 px-3 py-2.5">
                  <Skeleton className={`h-4 w-3/4 ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-3 w-1/2 ${SKELETON_CLASS}`} />
                </div>
              </div>
            ))
          : assets.map((asset) => <MediaAssetCard key={asset._id} asset={asset} onDelete={onDelete} />)}
      </div>

      {!loading && (hasPreviousPage || hasNextPage) && (
        <div className="flex items-center justify-between border-t border-dust-grey pt-4">
          <span className="text-coffee-bean/70">
            {t.rich("pageCount", {
              count: assets.length,
              strong: (chunks) => <strong className="font-semibold text-carbon-black">{chunks}</strong>,
            })}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label={t("previous")}
              className="size-9 border-dust-grey hover:border-toffee-brown hover:bg-toffee-brown/10"
              disabled={!hasPreviousPage}
              onClick={onPreviousPage}
            >
              <AltArrowLeftBold size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("next")}
              className="size-9 border-dust-grey hover:border-toffee-brown hover:bg-toffee-brown/10"
              disabled={!hasNextPage}
              onClick={onNextPage}
            >
              <AltArrowRightBold size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
