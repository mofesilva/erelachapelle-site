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
import { localizedName, type Podcast } from "../../_features/podcasts/podcast.type";
import type { Locale } from "@/types/common";

type Props = {
  /** Preenchido = diálogo aberto naquele episódio. */
  podcast: Podcast | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeletePodcastDialog({ podcast, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.podcasts");
  const locale = useLocale() as Locale;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!podcast) return;
    setDeleting(true);
    try {
      await onConfirm(podcast._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={podcast !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          {/* Mesmo caso do SheetTitle: é um <h2> imposto pelo Radix. */}
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">
            {t("deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {/* Igual Sermons: a API move pro lixeira (deletedAt) com TTL de 30 dias,
                não é hard delete — o aviso reflete isso, não "definitivamente". */}
            {t("deleteDescription", {
              name: podcast ? localizedName(podcast.title, locale) : "",
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-dust-grey text-coffee-bean">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault(); // impede o fechamento antes do DELETE terminar
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
