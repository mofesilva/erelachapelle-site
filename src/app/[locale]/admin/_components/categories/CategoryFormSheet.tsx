"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { slugify } from "@/lib/utils";
import { FormSheet } from "../FormSheet";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../../_features/categories/category.schema";
import type { Category } from "../../_features/categories/category.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  /** Preenchida = modo edição; nula = criação. */
  category: Category | null;
};

export function CategoryFormSheet({ open, onOpenChange, onSubmit, category }: Props) {
  const t = useTranslations("admin.categories");
  const [formError, setFormError] = useState<string | null>(null);
  const editing = category !== null;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: { fr: "" } },
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (nova categoria vs. edição de outra).
  useEffect(() => {
    if (open) {
      form.reset({ name: { fr: category?.name.fr ?? "" } });
      setFormError(null);
    }
  }, [open, category, form]);

  // O slug não é campo, mas mostrar o que será gravado evita surpresa no 409 de duplicado.
  const slugPreview = slugify(form.watch("name.fr") ?? "");

  async function handleSubmit(values: CategoryFormValues) {
    setFormError(null);
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      // As mensagens da API vêm em português e o usuário é francófono — traduzimos por status.
      if (err instanceof ApiError && err.status === 409) {
        setFormError(t("errorDuplicate"));
      } else if (err instanceof ApiError && err.status === 403) {
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
        icon={FolderBold}
        title={editing ? t("editTitle") : t("createTitle")}
        description={t("createDescription")}
        onSubmit={form.handleSubmit(handleSubmit)}
        submitting={form.formState.isSubmitting}
        error={formError}
        saveLabel={t("save")}
        savingLabel={t("saving")}
        cancelLabel={t("cancel")}
      >
        <FormField
          control={form.control}
          name="name.fr"
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
              <FormDescription className="text-xs text-coffee-bean/60">
                {slugPreview ? t("slugPreview", { slug: slugPreview }) : t("slugHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSheet>
    </Form>
  );
}
