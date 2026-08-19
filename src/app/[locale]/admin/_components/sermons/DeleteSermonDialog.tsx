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
import { localizedName, type Sermon } from "../../_features/sermons/sermon.type";
import type { Locale } from "@/types/common";

type Props = {
  /** Preenchido = diálogo aberto naquele sermão. */
  sermon: Sermon | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteSermonDialog({ sermon, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.sermons");
  const locale = useLocale() as Locale;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!sermon) return;
    setDeleting(true);
    try {
      await onConfirm(sermon._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={sermon !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          {/* Mesmo caso do SheetTitle: é um <h2> imposto pelo Radix. */}
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">
            {t("deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {/* Diferente de Category: a API move pro lixeira (deletedAt) com TTL de 30 dias,
                não é hard delete — o aviso reflete isso, não "definitivamente". */}
            {t("deleteDescription", {
              name: sermon ? localizedName(sermon.title, locale) : "",
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
