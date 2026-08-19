"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CloseCircleBold, GalleryAddBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "../../../_lib/auth-context";
import { uploadMediaAsset } from "../../../_features/media-assets/media-asset.service";

type Value = { id: string; url: string } | null;

type Props = {
  value: Value;
  onChange: (value: Value) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function resolveUrl(url: string) {
  return url.startsWith("/") ? `${API_URL}${url}` : url;
}

export function FeaturedImageField({ value, onChange }: Props) {
  const t = useTranslations("admin.posts");
  const { accessToken } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  async function handleFile(file: File) {
    if (!accessToken) return;
    setUploading(true);
    setError(false);
    try {
      const asset = await uploadMediaAsset(file, accessToken);
      onChange({ id: asset._id, url: asset.url });
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="relative w-full max-w-sm">
        <div className="relative aspect-video w-full overflow-hidden border border-dust-grey bg-dust-grey/30">
          <Image src={resolveUrl(value.url)} alt="" fill className="object-cover" unoptimized />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("removeImage")}
          onClick={() => onChange(null)}
          className="absolute right-1.5 top-1.5 size-8 bg-carbon-black/70 text-parchment hover:bg-carbon-black"
        >
          <CloseCircleBold size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 border border-dashed border-toffee-brown/40 bg-powder-petal/20 text-coffee-bean/70 hover:bg-powder-petal/30"
      >
        <GalleryAddBold size={28} color="var(--toffee-brown)" />
        <span>{uploading ? t("uploading") : t("uploadImage")}</span>
      </button>
      {error && <p className="mt-1.5 text-sm text-destructive">{t("uploadError")}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
