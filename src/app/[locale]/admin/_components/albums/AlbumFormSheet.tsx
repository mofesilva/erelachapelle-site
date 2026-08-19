"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlbumBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { FormSheet } from "../FormSheet";
import { albumFormSchema, type AlbumFormValues } from "../../_features/albums/album.schema";
import type { Album } from "../../_features/albums/album.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AlbumFormValues) => Promise<void>;
  /** Preenchido = modo edição; nulo = criação. */
  album: Album | null;
};

const EMPTY_VALUES: AlbumFormValues = {
  title: { fr: "" },
  description: "",
};

export function AlbumFormSheet({ open, onOpenChange, onSubmit, album }: Props) {
  const t = useTranslations("admin.albums");
  const [formError, setFormError] = useState<string | null>(null);
  const editing = album !== null;

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo álbum vs. edição de outro).
  useEffect(() => {
    if (open) {
      form.reset(
        album
          ? { title: { fr: album.title.fr }, description: album.description?.fr ?? "" }
          : EMPTY_VALUES
      );
      setFormError(null);
    }
  }, [open, album, form]);

  async function handleSubmit(values: AlbumFormValues) {
    setFormError(null);
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      // As mensagens da API vêm em português e o usuário é francófono — traduzimos por status.
      if (err instanceof ApiError && err.status === 403) {
        setFormError(t("errorForbidden"));
      } else {
        setFormError(t("errorGeneric"));
      }
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setFormError(null);
    }
    onOpenChange(next);
  }

  return (
    <Form {...form}>
      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        icon={AlbumBold}
        title={editing ? t("editTitle") : t("createTitle")}
        description={t("createDescription")}
        onSubmit={form.handleSubmit(handleSubmit)}
        submitting={form.formState.isSubmitting}
        error={formError}
        saveLabel={t("save")}
        savingLabel={t("saving")}
        cancelLabel={t("cancel")}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="title.fr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("nameLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={t("namePlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("descriptionLabel")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionPlaceholder")}
                    className="border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSheet>
    </Form>
  );
}
