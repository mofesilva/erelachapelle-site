"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CloseCircleBold, CloudUploadBold, GalleryBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../../_lib/auth-context";
import { uploadMediaAsset } from "../../_features/media-assets/media-asset.service";
import { resolveMediaAssetUrl } from "../../_features/media-assets/media-asset.type";
import { ApiError } from "@/lib/admin-api";
import type { EventFeaturedImage } from "../../_features/events/event.type";

const ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const ACCEPTED_MIMETYPES = ["image/png", "image/jpeg"];

type Props = {
  value: EventFeaturedImage | null | undefined;
  onChange: (value: EventFeaturedImage | null) => void;
};

function isAcceptedFile(file: File) {
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return ACCEPTED_EXTENSIONS.includes(ext) || ACCEPTED_MIMETYPES.includes(file.type);
}

/**
 * Sem input de URL solta: o banner é sempre um MediaAsset. O upload aqui cai direto no mesmo
 * endpoint da mediateca (`POST /media-assets/upload`) — o evento guarda só a referência
 * `{id, url, altText}` devolvida, no mesmo formato que `Album.images` já usa.
 */
export function EventBannerField({ value, onChange }: Props) {
  const t = useTranslations("admin.events");
  const { accessToken } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file || !accessToken) return;

    if (!isAcceptedFile(file)) {
      setError(t("bannerErrorType"));
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(file, accessToken);
      onChange({ id: asset._id, url: asset.url, altText: asset.altText });
    } catch (err) {
      setError(err instanceof ApiError && err.status === 403 ? t("errorForbidden") : t("bannerErrorGeneric"));
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="relative overflow-hidden border border-dust-grey">
        {/* eslint-disable-next-line @next/next/no-img-element -- fonte é a API própria (media-assets), não otimizável pelo loader padrão do next/image sem config extra */}
        <img
          src={resolveMediaAssetUrl(value.url)}
          alt=""
          className="h-40 w-full object-cover"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("bannerRemove")}
          className="absolute top-2 right-2 size-8 bg-carbon-black/60 text-parchment hover:bg-carbon-black/80 hover:text-parchment"
          onClick={() => onChange(null)}
        >
          <CloseCircleBold size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
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
        {uploading ? (
          <CloudUploadBold size={32} className="animate-pulse" color="var(--toffee-brown)" />
        ) : (
          <GalleryBold size={32} color="var(--toffee-brown)" />
        )}
        <p className="mt-3 text-sm text-coffee-bean/70">
          {uploading ? t("bannerUploading") : t("bannerHint")}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="mt-4 h-9 border-toffee-brown/40 text-toffee-brown hover:bg-toffee-brown/10"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("bannerUploadButton")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={[...ACCEPTED_EXTENSIONS, ...ACCEPTED_MIMETYPES].join(",")}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
