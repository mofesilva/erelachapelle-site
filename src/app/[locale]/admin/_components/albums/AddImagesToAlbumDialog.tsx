"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GalleryBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { listMediaAssets } from "../../_features/media-assets/media-asset.service";
import { resolveMediaAssetUrl, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import type { Album, AlbumImage } from "../../_features/albums/album.type";
import { SelectableMediaAssetCard } from "./SelectableMediaAssetCard";

// Só png/jpeg fazem sentido num álbum de fotos — PDF/EPUB da Médiathèque ficam de fora.
const IMAGE_FILE_TYPES = new Set(["png", "jpeg"]);
// Sem filtro por tipo múltiplo na API — busca a página mais recente (máximo do backend)
// e filtra pra imagens no cliente, em vez de inventar paginação aqui num diálogo de escolha.
const FETCH_LIMIT = 100;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  album: Album | null;
  onConfirm: (album: Album, images: AlbumImage[]) => Promise<unknown>;
};

export function AddImagesToAlbumDialog({ open, onOpenChange, album, onConfirm }: Props) {
  const t = useTranslations("admin.albums");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedIds(new Set());
    setLoading(true);
    setLoadFailed(false);
    listMediaAssets({ limit: FETCH_LIMIT })
      .then((page) => setAssets(page.items))
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  }, [open]);

  const alreadyInAlbum = new Set(album?.images.map((image) => image.id) ?? []);
  const selectableAssets = assets.filter(
    (asset) => IMAGE_FILE_TYPES.has(asset.fileType) && !alreadyInAlbum.has(asset._id)
  );

  function toggle(asset: MediaAsset) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(asset._id)) next.delete(asset._id);
      else next.add(asset._id);
      return next;
    });
  }

  async function handleConfirm() {
    if (!album) return;
    const images: AlbumImage[] = selectableAssets
      .filter((asset) => selectedIds.has(asset._id))
      .map((asset) => ({
        id: asset._id,
        url: resolveMediaAssetUrl(asset.url),
        altText: asset.altText,
      }));
    if (images.length === 0) return;

    setSubmitting(true);
    try {
      await onConfirm(album, images);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 bg-parchment p-0 sm:max-w-3xl">
        <DialogHeader className="gap-1 border-b border-dust-grey px-6 py-5">
          <DialogTitle className="font-serif text-h6 text-carbon-black">
            {t("addImagesDialogTitle")}
          </DialogTitle>
          <DialogDescription className="text-coffee-bean/70">
            {t("addImagesDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadFailed && (
            <p className="border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
              {t("loadError")}
            </p>
          )}

          {!loadFailed && loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video bg-dust-grey" />
              ))}
            </div>
          )}

          {!loadFailed && !loading && selectableAssets.length === 0 && (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <GalleryBold size={40} color="var(--toffee-brown)" />
              <p className="mt-4 font-serif text-carbon-black">{t("noAssetsAvailable")}</p>
            </div>
          )}

          {!loadFailed && !loading && selectableAssets.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {selectableAssets.map((asset) => (
                <SelectableMediaAssetCard
                  key={asset._id}
                  asset={asset}
                  selected={selectedIds.has(asset._id)}
                  onToggle={toggle}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-3 border-t border-dust-grey px-6 py-4 sm:justify-between">
          <span className="text-sm text-coffee-bean/70">{t("selectedCount", { count: selectedIds.size })}</span>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="h-11 text-coffee-bean" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button
              type="button"
              className="h-11 bg-night-bordeaux-2 px-6 hover:bg-rich-mahogany"
              disabled={selectedIds.size === 0 || submitting}
              onClick={handleConfirm}
            >
              {t("confirmAdd", { count: selectedIds.size })}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
