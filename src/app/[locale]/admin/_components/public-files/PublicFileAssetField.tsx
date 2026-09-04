"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CloseCircleBold, FileTextBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { MediaAssetPickerDialog } from "../media-assets/MediaAssetPickerDialog";
import { resolveMediaAssetUrl, type MediaAsset } from "../../_features/media-assets/media-asset.type";

type Value = { id: string; url: string; fileType: "pdf" | "epub"; coverUrl?: string } | null;

type Props = {
  value: Value;
  onChange: (value: Value) => void;
};

const ALLOWED_FILE_TYPES = ["pdf", "epub"] as const;

export function PublicFileAssetField({ value, onChange }: Props) {
  const t = useTranslations("admin.publicFiles");
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleSelect(asset: MediaAsset) {
    if (asset.fileType !== "pdf" && asset.fileType !== "epub") return;
    // A API valida `asset.url` como URL absoluta (z.string().url()) — o MediaAsset guarda
    // relativa ("/uploads/xxx.pdf"), precisa resolver aqui (mesmo padrão do Album).
    onChange({
      id: asset._id,
      url: resolveMediaAssetUrl(asset.url),
      fileType: asset.fileType,
      coverUrl: asset.coverUrl ? resolveMediaAssetUrl(asset.coverUrl) : undefined,
    });
  }

  if (value) {
    const filename = value.url.split("/").pop() ?? value.url;
    return (
      <div className="flex items-center gap-3 border border-dust-grey bg-white px-4 py-3">
        <FileTextBold size={22} color="var(--toffee-brown)" />
        {/* min-w-0: sem isso, um filho flex com `truncate` não encolhe abaixo do tamanho
            do texto — o nome do arquivo (UUID longo) estourava a largura do card. */}
        <span className="min-w-0 flex-1 truncate text-coffee-bean" title={filename}>
          {filename}
        </span>
        <span className="shrink-0 border border-toffee-brown/30 px-2 py-0.5 text-[0.6875rem] uppercase tracking-wide text-coffee-bean/70">
          {value.fileType}
        </span>
        <button
          type="button"
          aria-label={t("removeFile")}
          className="shrink-0 cursor-pointer text-coffee-bean/50 hover:text-coffee-bean"
          onClick={() => onChange(null)}
        >
          <CloseCircleBold size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full border-dust-grey text-coffee-bean hover:border-toffee-brown/50 hover:text-toffee-brown"
        onClick={() => setPickerOpen(true)}
      >
        {t("selectFile")}
      </Button>
      <MediaAssetPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        allowedFileTypes={ALLOWED_FILE_TYPES}
        onSelect={handleSelect}
      />
    </>
  );
}
