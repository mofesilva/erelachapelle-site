"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { displayTitle, type MediaAsset } from "../../_features/media-assets/media-asset.type";
import type { Locale } from "@/types/common";

type Props = {
  /** Preenchida = diálogo aberto naquele asset. */
  asset: MediaAsset | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteMediaAssetDialog({ asset, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.mediaAssets");
  const locale = useLocale() as Locale;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!asset) return;
    setDeleting(true);
    try {
      await onConfirm(asset._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={asset !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {t("deleteDescription", { name: asset ? displayTitle(asset, locale) : "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-dust-grey text-coffee-bean">{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
          >
            {deleting ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
