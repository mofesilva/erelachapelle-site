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
import { localizedName, type Category } from "../../_features/categories/category.type";
import type { Locale } from "@/types/common";

type Props = {
  /** Preenchida = diálogo aberto naquela categoria. */
  category: Category | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteCategoryDialog({ category, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.categories");
  const locale = useLocale() as Locale;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!category) return;
    setDeleting(true);
    try {
      await onConfirm(category._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={category !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          {/* Mesmo caso do SheetTitle: é um <h2> imposto pelo Radix. */}
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">
            {t("deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {/* A API apaga de vez — sem lixeira e sem restore — então o aviso é definitivo. */}
            {t("deleteDescription", {
              name: category ? localizedName(category.name, locale) : "",
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
