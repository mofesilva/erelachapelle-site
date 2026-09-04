"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenNewSquareBoldDuotone } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { FormSheet } from "../FormSheet";
import { mediaAssetTitleFormSchema, type MediaAssetTitleFormValues } from "../../_features/media-assets/media-asset.schema";
import type { MediaAsset } from "../../_features/media-assets/media-asset.type";

type Props = {
  /** Preenchido = sheet aberto naquele asset. */
  asset: MediaAsset | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: MediaAssetTitleFormValues) => Promise<void>;
};

export function EditMediaAssetTitleSheet({ asset, onOpenChange, onSubmit }: Props) {
  const t = useTranslations("admin.mediaAssets");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<MediaAssetTitleFormValues>({
    resolver: zodResolver(mediaAssetTitleFormSchema),
    defaultValues: { title: { fr: "" } },
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o asset alvo.
  useEffect(() => {
    if (asset) form.reset({ title: { fr: asset.title?.fr ?? "" } });
  }, [asset, form]);

  async function handleSubmit(values: MediaAssetTitleFormValues) {
    if (!asset) return;
    setFormError(null);
    try {
      await onSubmit(asset._id, values);
      onOpenChange(false);
    } catch (err) {
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
        open={asset !== null}
        onOpenChange={handleOpenChange}
        icon={PenNewSquareBoldDuotone}
        title={t("editTitleSheetTitle")}
        description={t("editTitleSheetDescription")}
        onSubmit={form.handleSubmit(handleSubmit)}
        submitting={form.formState.isSubmitting}
        error={formError}
        saveLabel={t("save")}
        savingLabel={t("saving")}
        cancelLabel={t("cancel")}
      >
        <FormField
          control={form.control}
          name="title.fr"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-coffee-bean uppercase">{t("titleFieldLabel")}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder={t("titleFieldPlaceholder")}
                  className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </Form>
  );
}
