"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import type { User } from "../../_features/users/user.type";

type Props = {
  /** Preenchida = diálogo aberto naquele usuário. */
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteUserDialog({ user, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("admin.users");
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (!user) return;
    setDeleting(true);
    try {
      await onConfirm(user._id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={user !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-parchment">
        <AlertDialogHeader>
          {/* Mesmo caso do SheetTitle: é um <h2> imposto pelo Radix. */}
          <AlertDialogTitle className="font-serif text-h6 text-carbon-black">
            {t("deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-coffee-bean/80">
            {/* A API só desativa (soft delete) — nada de "definitivo"/"irreversível" aqui. */}
            {t("deleteDescription", { name: user?.name ?? "" })}
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
