"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileTextBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { FormSheet } from "../FormSheet";
import { PublicFileAssetField } from "./PublicFileAssetField";
import { publicFileFormSchema, type PublicFileFormValues } from "../../_features/public-files/public-file.schema";
import { DOCUMENT_TYPES, type PublicFile } from "../../_features/public-files/public-file.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PublicFileFormValues) => Promise<void>;
  /** Preenchido = modo edição; nulo = criação. */
  publicFile: PublicFile | null;
};

const EMPTY_VALUES: PublicFileFormValues = {
  title: { fr: "" },
  description: "",
  documentType: DOCUMENT_TYPES[0],
  asset: null,
};

export function PublicFileFormSheet({ open, onOpenChange, onSubmit, publicFile }: Props) {
  const t = useTranslations("admin.publicFiles");
  const [formError, setFormError] = useState<string | null>(null);
  const editing = publicFile !== null;

  const form = useForm<PublicFileFormValues>({
    resolver: zodResolver(publicFileFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo arquivo vs. edição de outro).
  useEffect(() => {
    if (open) {
      form.reset(
        publicFile
          ? {
              title: { fr: publicFile.title.fr },
              description: publicFile.description?.fr ?? "",
              documentType: publicFile.documentType,
              asset: publicFile.asset,
            }
          : EMPTY_VALUES
      );
      setFormError(null);
    }
  }, [open, publicFile, form]);

  async function handleSubmit(values: PublicFileFormValues) {
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
        icon={FileTextBold}
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
                  {t("titleLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={t("titlePlaceholder")}
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

          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("documentTypeLabel")}
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`documentType.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asset"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("assetLabel")}
                </FormLabel>
                <FormControl>
                  <PublicFileAssetField value={field.value} onChange={field.onChange} />
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
