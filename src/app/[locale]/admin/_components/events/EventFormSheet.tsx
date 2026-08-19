"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { CalendarBold } from "solar-icon-set";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { FormSheet } from "../FormSheet";
import { DateTimePicker } from "../DateTimePicker";
import { EventBannerField } from "./EventBannerField";
import {
  eventFormSchema,
  RECURRENCE_END_TYPE_OPTIONS,
  RECURRENCE_FREQUENCY_OPTIONS,
  type EventFormValues,
} from "../../_features/events/event.schema";
import { EVENT_TYPES, type Event } from "../../_features/events/event.type";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;
// Índice 0=domingo..6=sábado, mesma convenção usada em `recurrenceWeekdays` — 7/jan/2024 é
// um domingo, então basta somar `i` pra andar a semana inteira a partir dele.
const WEEKDAY_REFERENCE = new Date(2024, 0, 7);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EventFormValues) => Promise<void>;
  /** Preenchida = modo edição; nula = criação. */
  event: Event | null;
};

export function EventFormSheet({ open, onOpenChange, onSubmit, event }: Props) {
  const t = useTranslations("admin.events");
  const tTypes = useTranslations("events.types");
  const locale = useLocale() as Locale;
  const dateLocale = dateLocales[locale];
  const [formError, setFormError] = useState<string | null>(null);
  const editing = event !== null;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: { fr: "" },
      description: { fr: "" },
      eventType: "service",
      startDate: undefined,
      endDate: undefined,
      customAddress: "",
      featuredImage: null,
      capacity: "",
      recurrenceFrequency: "none",
      recurrenceWeekdays: [],
      recurrenceEndType: undefined,
      recurrenceUntil: undefined,
      recurrenceCount: "",
    },
  });

  const frequency = form.watch("recurrenceFrequency");
  const endType = form.watch("recurrenceEndType");

  // O sheet não desmonta entre aberturas, então o formulário precisa ser recarregado
  // sempre que muda o alvo (novo evento vs. edição de outro).
  useEffect(() => {
    if (open) {
      // Numa ocorrência virtual de série recorrente, `event.startDate`/`endDate` são a data
      // daquela instância clicada, não da série. Editar sempre reescreve a série toda (ver
      // decisão de escopo), então o formulário precisa carregar `seriesStartDate`/`seriesEndDate`
      // aqui — senão salvar moveria a série inteira pra data da ocorrência clicada.
      const recurrence = event?.recurrence;
      const isRecurring = !!recurrence;
      form.reset({
        title: { fr: event?.title.fr ?? "" },
        description: { fr: event?.description.fr ?? "" },
        eventType: event?.eventType ?? "service",
        startDate: event
          ? new Date(isRecurring ? event.seriesStartDate! : event.startDate)
          : undefined,
        endDate:
          event && (isRecurring ? event.seriesEndDate : event.endDate)
            ? new Date((isRecurring ? event.seriesEndDate : event.endDate)!)
            : undefined,
        customAddress: event?.customAddress ?? "",
        featuredImage: event?.featuredImage ?? null,
        capacity: event?.capacity ? String(event.capacity) : "",
        recurrenceFrequency: recurrence?.frequency ?? "none",
        recurrenceWeekdays: recurrence?.weekdays ?? [],
        recurrenceEndType: recurrence?.end.type ?? "never",
        recurrenceUntil: recurrence?.end.type === "until" ? new Date(recurrence.end.until) : undefined,
        recurrenceCount: recurrence?.end.type === "count" ? String(recurrence.end.count) : "",
      });
      setFormError(null);
    }
  }, [open, event, form]);

  async function handleSubmit(values: EventFormValues) {
    setFormError(null);
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      // As mensagens da API vêm em português e o usuário é francófono — traduzimos por status.
      // Sem caso de duplicado: o slug é gerado pela API, que resolve o conflito com sufixo em
      // vez de recusar, então título repetido não é mais erro.
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
        icon={CalendarBold}
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
            name="description.fr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("descriptionLabel")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
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
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("bannerLabel")}
                </FormLabel>
                <FormControl>
                  <EventBannerField value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("typeLabel")}
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {tTypes(type)}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("startDateLabel")}
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
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("endDateLabel")}
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("dateTimePlaceholder")}
                    clearLabel={t("clear")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrenceFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("repeatLabel")}
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Trocar de frequência limpa os dias custom de uma escolha anterior e
                    // reabre a escolha de fim — evita herdar estado de um modo pro outro.
                    if (value !== "custom") form.setValue("recurrenceWeekdays", []);
                    if (value !== "none" && !form.getValues("recurrenceEndType")) {
                      form.setValue("recurrenceEndType", "never");
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECURRENCE_FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`repeat${option.charAt(0).toUpperCase()}${option.slice(1)}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {frequency === "custom" && (
            <FormField
              control={form.control}
              name="recurrenceWeekdays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-coffee-bean uppercase">
                    {t("repeatWeekdaysLabel")}
                  </FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      className="flex-wrap"
                      value={(field.value ?? []).map(String)}
                      onValueChange={(values: string[]) => field.onChange(values.map(Number))}
                    >
                      {Array.from({ length: 7 }, (_, weekday) => (
                        <ToggleGroupItem key={weekday} value={String(weekday)}>
                          {format(
                            new Date(
                              WEEKDAY_REFERENCE.getFullYear(),
                              WEEKDAY_REFERENCE.getMonth(),
                              WEEKDAY_REFERENCE.getDate() + weekday
                            ),
                            "EEEEE",
                            { locale: dateLocale }
                          )}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {frequency !== "none" && (
            <FormField
              control={form.control}
              name="recurrenceEndType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-coffee-bean uppercase">
                    {t("repeatEndLabel")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2.5">
                      {RECURRENCE_END_TYPE_OPTIONS.map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <RadioGroupItem value={option} id={`recurrenceEndType-${option}`} />
                          <label
                            htmlFor={`recurrenceEndType-${option}`}
                            className="cursor-pointer text-sm text-carbon-black"
                          >
                            {t(`repeatEnd${option.charAt(0).toUpperCase()}${option.slice(1)}`)}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {frequency !== "none" && endType === "until" && (
            <FormField
              control={form.control}
              name="recurrenceUntil"
              render={({ field }) => (
                <FormItem>
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
          )}

          {frequency !== "none" && endType === "count" && (
            <FormField
              control={form.control}
              name="recurrenceCount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        inputMode="numeric"
                        placeholder="10"
                        className="h-11 w-24 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                        {...field}
                      />
                      <span className="text-sm text-coffee-bean/70">{t("repeatCountSuffix")}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="customAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("customAddressLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("customAddressPlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-coffee-bean/60">
                  {t("customAddressHint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-coffee-bean uppercase">
                  {t("capacityLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder={t("capacityPlaceholder")}
                    className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
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
