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
import { localizedText } from "../../_lib/localized-text";
import type { Event } from "../../_features/events/event.type";
import type { Locale } from "@/types/common";

type Props = {
  /** Preenchida = diálogo aberto naquele evento. */
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteEventDialog({ event, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.events");
  const locale = useLocale() as Locale;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!event) return;
    setDeleting(true);
    try {
      await onConfirm(event._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={event !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">
            {t("deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {/* A API apaga de vez — sem lixeira e sem restore — então o aviso é definitivo.
                Recorrente apaga a série toda, passado e futuro (decisão de escopo: sem
                exceção por ocorrência), então o aviso precisa deixar isso claro. */}
            {event?.recurrence
              ? t("deleteRecurringDescription", { title: localizedText(event.title, locale) })
              : t("deleteDescription", {
                  title: event ? localizedText(event.title, locale) : "",
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
            onClick={(clickEvent) => {
              clickEvent.preventDefault(); // impede o fechamento antes do DELETE terminar
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
