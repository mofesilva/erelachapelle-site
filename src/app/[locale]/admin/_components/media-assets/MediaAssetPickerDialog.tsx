"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CloudUploadBold, GalleryBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../../_lib/auth-context";
import { listMediaAssets, uploadMediaAsset } from "../../_features/media-assets/media-asset.service";
import { FILE_TYPES, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import { MediaAssetPickerCard } from "./MediaAssetPickerCard";

type FileType = (typeof FILE_TYPES)[number];

const FETCH_LIMIT = 100;

const EXTENSIONS_BY_TYPE: Record<FileType, string[]> = {
  pdf: [".pdf"],
  png: [".png"],
  jpeg: [".jpg", ".jpeg"],
  epub: [".epub"],
};

const MIME_BY_TYPE: Record<FileType, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpeg: "image/jpeg",
  epub: "application/epub+zip",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedFileTypes: readonly FileType[];
  onSelect: (asset: MediaAsset) => void;
};

/** Diálogo compartilhado: upload imediato (arrastar ou "procurar") + galeria de arquivos já
 * existentes, filtrada por `allowedFileTypes` — mesmo componente serve tanto a imagem de
 * capa do Post (png/jpeg) quanto o arquivo do PublicFile (pdf/epub), um asset por vez. */
export function MediaAssetPickerDialog({ open, onOpenChange, allowedFileTypes, onSelect }: Props) {
  const t = useTranslations("admin.mediaAssets.picker");
  const { accessToken } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUploadError(false);
    setLoading(true);
    setLoadFailed(false);
    listMediaAssets({ limit: FETCH_LIMIT })
      .then((page) => setAssets(page.items))
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  }, [open]);

  const selectableAssets = assets.filter((asset) => allowedFileTypes.includes(asset.fileType));
  const accept = allowedFileTypes.flatMap((type) => EXTENSIONS_BY_TYPE[type]).join(",");
  const acceptedLabel = allowedFileTypes.map((type) => t(`fileType.${type}`)).join(", ");

  function isAllowedFile(file: File) {
    return allowedFileTypes.some(
      (type) =>
        file.type === MIME_BY_TYPE[type] ||
        EXTENSIONS_BY_TYPE[type].some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  }

  async function handleFile(file: File) {
    if (!accessToken) return;
    if (!isAllowedFile(file)) {
      setUploadError(true);
      return;
    }
    setUploading(true);
    setUploadError(false);
    try {
      const asset = await uploadMediaAsset(file, accessToken, file.name.replace(/\.[^./]+$/, ""));
      onSelect(asset);
      onOpenChange(false);
    } catch {
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) handleFile(file);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 bg-parchment p-0 sm:max-w-3xl">
        <DialogHeader className="gap-1 border-b border-dust-grey px-6 py-5">
          <DialogTitle className="font-serif text-h6 text-carbon-black">{t("title")}</DialogTitle>
          <DialogDescription className="text-coffee-bean/70">{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div
            className={cn(
              "flex flex-col items-center border border-dashed px-6 py-8 text-center transition-colors",
              dragging ? "border-toffee-brown bg-toffee-brown/10" : "border-toffee-brown/30 bg-powder-petal/20"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
          >
            <CloudUploadBold size={32} color="var(--toffee-brown)" />
            <p className="mt-3 font-serif text-carbon-black">
              {uploading ? t("uploading") : t("dropzoneTitle")}
            </p>
            <p className="mt-1 max-w-sm text-coffee-bean/70">{t("dropzoneSubtitle")}</p>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="mt-4 h-10 border-toffee-brown/40 text-toffee-brown hover:bg-toffee-brown/10"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("browseButton")}
            </Button>
            <p className="mt-2 text-xs text-coffee-bean/50">{t("accepted", { types: acceptedLabel })}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          {uploadError && (
            <p
              className="mt-3 border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive"
              role="alert"
            >
              {t("uploadError")}
            </p>
          )}

          <p className="my-5 text-center text-xs font-semibold uppercase tracking-wide text-coffee-bean/50">
            {t("orSelectExisting")}
          </p>

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
                <MediaAssetPickerCard
                  key={asset._id}
                  asset={asset}
                  onSelect={(selected) => {
                    onSelect(selected);
                    onOpenChange(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
