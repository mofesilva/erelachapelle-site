"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PodcastBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toPodcastEmbedUrl } from "@/lib/integrations/podcast-embed";
import { FormSheet } from "../FormSheet";
import { DateTimePicker } from "../DateTimePicker";
import { podcastFormSchema, type PodcastFormValues } from "../../_features/podcasts/podcast.schema";
import type { Podcast } from "../../_features/podcasts/podcast.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PodcastFormValues) => Promise<void>;
  /** Preenchido = modo edição; nulo = criação. */
  podcast: Podcast | null;
};

const EMPTY_VALUES: PodcastFormValues = {
  title: { fr: "" },
  description: "",
  url: "",
  date: undefined as unknown as Date,
};

export function PodcastFormSheet({ open, onOpenChange, onSubmit, podcast }: Props) {
  const t = useTranslations("admin.podcasts");
  const [formError, setFormError] = useState<string | null>(null);
  const editing = podcast !== null;

  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  // Preview ao vivo do embed: o admin precisa ver o player tocando aqui mesmo pra confirmar
  // que o link vai aparecer embutido no site, não como um link que manda o visitante embora.
  const urlValue = form.watch("url");
  const embedUrl = /^https?:\/\//.test(urlValue ?? "") ? toPodcastEmbedUrl(urlValue) : null;

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo episódio vs. edição de outro).
  useEffect(() => {
    if (open) {
      form.reset(
        podcast
          ? {
              title: { fr: podcast.title.fr },
              description: podcast.description?.fr ?? "",
              url: podcast.url,
              date: new Date(podcast.date),
            }
          : EMPTY_VALUES
      );
      setFormError(null);
    }
  }, [open, podcast, form]);

  async function handleSubmit(values: PodcastFormValues) {
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
        icon={PodcastBold}
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

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("urlLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder={t("urlPlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-coffee-bean/60">
                  {t("urlHint")}
                </FormDescription>
                {embedUrl && (
                  <div className="overflow-hidden rounded border border-dust-grey">
                    <iframe
                      key={embedUrl}
                      src={embedUrl}
                      className="h-[152px] w-full"
                      loading="lazy"
                      allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
                    />
                  </div>
                )}
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
        </div>
      </FormSheet>
    </Form>
  );
}
