"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MicrophoneBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/lib/admin-api";
import { getYouTubeWatchUrl } from "@/lib/integrations/youtube";
import { FormSheet } from "../FormSheet";
import { DateTimePicker } from "../DateTimePicker";
import { MultiSelect, type MultiSelectOption } from "../MultiSelect";
import { sermonFormSchema, type SermonFormValues } from "../../_features/sermons/sermon.schema";
import { localizedName, type Sermon } from "../../_features/sermons/sermon.type";
import type { Category } from "../../_features/categories/category.type";
import type { Theme } from "../../_features/themes/theme.type";
import type { Locale } from "@/types/common";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SermonFormValues) => Promise<void>;
  /** Preenchido = modo edição; nulo = criação. */
  sermon: Sermon | null;
  categories: Category[];
  themes: Theme[];
  /** Criação inline (estilo Notion) no combobox de temas — ver `MultiSelect`. */
  onCreateTheme: (name: string) => Promise<Theme>;
};

const EMPTY_VALUES: SermonFormValues = {
  title: { fr: "" },
  preacher: "",
  date: undefined as unknown as Date,
  youtubeVideoId: "",
  biblicalReference: { book: "", chapter: "", verses: "" },
  categoryIds: [],
  themeIds: [],
};

export function SermonFormSheet({
  open,
  onOpenChange,
  onSubmit,
  sermon,
  categories,
  themes,
  onCreateTheme,
}: Props) {
  const t = useTranslations("admin.sermons");
  const locale = useLocale() as Locale;
  const [formError, setFormError] = useState<string | null>(null);
  const editing = sermon !== null;

  const form = useForm<SermonFormValues>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo sermão vs. edição de outro).
  useEffect(() => {
    if (open) {
      form.reset(
        sermon
          ? {
              title: { fr: sermon.title.fr },
              preacher: sermon.preacher,
              date: new Date(sermon.date),
              // Reexibe como link completo (não o ID cru salvo no banco) — mais
              // reconhecível pra quem for editar.
              youtubeVideoId: getYouTubeWatchUrl(sermon.youtubeVideoId),
              biblicalReference: {
                book: sermon.biblicalReference?.book ?? "",
                chapter: sermon.biblicalReference?.chapter
                  ? String(sermon.biblicalReference.chapter)
                  : "",
                verses: sermon.biblicalReference?.verses ?? "",
              },
              categoryIds: sermon.categories?.map((category) => category.id) ?? [],
              themeIds: sermon.themes?.map((theme) => theme.id) ?? [],
            }
          : EMPTY_VALUES
      );
      setFormError(null);
    }
  }, [open, sermon, form]);

  async function handleSubmit(values: SermonFormValues) {
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

  /** Repassado ao combobox de temas: cria via API e devolve a opção já no formato do MultiSelect. */
  async function handleCreateTheme(name: string): Promise<MultiSelectOption> {
    try {
      const created = await onCreateTheme(name);
      return { id: created._id, label: localizedName(created.name, locale) };
    } catch (err) {
      setFormError(err instanceof ApiError && err.status === 403 ? t("errorForbidden") : t("errorGeneric"));
      throw err;
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setFormError(null);
    }
    onOpenChange(next);
  }

  const categoryOptions = categories.map((category) => ({
    id: category._id,
    label: localizedName(category.name, locale),
  }));
  const themeOptions = themes.map((theme) => ({
    id: theme._id,
    label: localizedName(theme.name, locale),
  }));

  return (
    <Form {...form}>
      <FormSheet
        open={open}
        onOpenChange={handleOpenChange}
        icon={MicrophoneBold}
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
            name="preacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("preacherLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("preacherPlaceholder")}
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("dateLabel")}
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("dateTimePlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtubeVideoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("youtubeLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder={t("youtubePlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="biblicalReference.book"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold text-coffee-bean uppercase">
                    {t("bookLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("bookPlaceholder")}
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
              name="biblicalReference.chapter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-coffee-bean uppercase">
                    {t("chapterLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="biblicalReference.verses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("versesLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("versesPlaceholder")}
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
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("categoryLabel")}
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("categoryPlaceholder")}
                    searchPlaceholder={t("searchPlaceholder")}
                    emptyLabel={t("noOptions")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="themeIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("themeLabel")}
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    options={themeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("themePlaceholder")}
                    searchPlaceholder={t("searchPlaceholder")}
                    emptyLabel={t("noOptions")}
                    onCreate={handleCreateTheme}
                    createLabel={(name) => t("createThemeOption", { name })}
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
