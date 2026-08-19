"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircleBold, CloseCircleBold, CloudUploadBold, DangerCircleBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UploadItem } from "../../_features/media-assets/media-asset.controller";

const ACCEPTED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".epub"];
const ACCEPTED_MIMETYPES = ["application/pdf", "image/png", "image/jpeg", "application/epub+zip"];

type Props = {
  uploads: UploadItem[];
  onUpload: (files: File[]) => Promise<void>;
  onDismissUpload: (id: string) => void;
};

function isAcceptedFile(file: File) {
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return ACCEPTED_EXTENSIONS.includes(ext) || ACCEPTED_MIMETYPES.includes(file.type);
}

export function MediaUploadDropzone({ uploads, onUpload, onDismissUpload }: Props) {
  const t = useTranslations("admin.mediaAssets.dropzone");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const accepted = files.filter(isAcceptedFile);
    const invalid = files.filter((file) => !isAcceptedFile(file));
    setRejected(invalid.map((file) => file.name));
    if (accepted.length > 0) onUpload(accepted);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex flex-col items-center border border-dashed px-6 py-10 text-center transition-colors",
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
        <CloudUploadBold size={40} color="var(--toffee-brown)" />
        <p className="mt-4 font-serif text-carbon-black">{t("title")}</p>
        <p className="mt-1 max-w-sm text-coffee-bean/70">{t("subtitle")}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 h-10 border-toffee-brown/40 text-toffee-brown hover:bg-toffee-brown/10"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("button")}
        </Button>
        <p className="mt-3 text-xs text-coffee-bean/50">{t("accepted")}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={[...ACCEPTED_EXTENSIONS, ...ACCEPTED_MIMETYPES].join(",")}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {rejected.length > 0 && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive" role="alert">
          {t("rejected", { files: rejected.join(", ") })}
        </p>
      )}

      {uploads.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {uploads.map((upload) => (
            <li
              key={upload.id}
              className="flex items-center gap-3 border border-dust-grey bg-white px-3 py-2 text-sm"
            >
              <span className="shrink-0">
                {upload.status === "success" && <CheckCircleBold size={18} color="var(--olive-wood)" />}
                {upload.status === "error" && <DangerCircleBold size={18} color="var(--destructive)" />}
                {(upload.status === "pending" || upload.status === "uploading") && (
                  <CloudUploadBold size={18} className="animate-pulse" color="var(--toffee-brown)" />
                )}
              </span>
              <span className="flex-1 truncate text-coffee-bean">{upload.file.name}</span>
              <span className="shrink-0 text-xs text-coffee-bean/60">
                {upload.status === "uploading" && t("statusUploading")}
                {upload.status === "success" && t("statusSuccess")}
                {upload.status === "error" && (upload.error || t("statusError"))}
              </span>
              {(upload.status === "success" || upload.status === "error") && (
                <button
                  type="button"
                  aria-label={t("dismiss")}
                  className="shrink-0 text-coffee-bean/50 hover:text-coffee-bean"
                  onClick={() => onDismissUpload(upload.id)}
                >
                  <CloseCircleBold size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
