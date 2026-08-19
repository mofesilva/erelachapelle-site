"use client";

import { useLocale, useTranslations } from "next-intl";
import { format, isSameDay } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import {
  CalendarBold,
  CalendarMinimalisticBold,
  PenNewSquareBoldDuotone,
  RepeatBold,
  TrashBinTrashBoldDuotone,
} from "solar-icon-set";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { localizedText } from "../../_lib/localized-text";
import type { Event } from "../../_features/events/event.type";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;
const HEAD_CLASS = "h-11 px-4 font-semibold uppercase text-coffee-bean";
// bg-accent (padrão do Skeleton) resolve pro toffee-brown da marca nesse projeto — forte
// demais pra um placeholder. Mesmo ajuste já feito em Categories.
const SKELETON_CLASS = "bg-dust-grey";
const SKELETON_ROWS = 3;
const TITLE_SKELETON_WIDTHS = ["w-40", "w-52", "w-44"];

type Props = {
  events: Event[];
  loading: boolean;
  loadFailed: boolean;
  selectedDay: Date;
  onAdd: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
};

export function EventsTable({
  events,
  loading,
  loadFailed,
  selectedDay,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const t = useTranslations("admin.events");
  const tTypes = useTranslations("events.types");
  const locale = useLocale() as Locale;
  const dateLocale = dateLocales[locale];
  const dayLabel = format(selectedDay, "EEEE, d MMMM yyyy", { locale: dateLocale });

  if (loadFailed) {
    return (
      <p
        className="border border-destructive/30 bg-destructive/5 p-4 text-destructive"
        role="alert"
      >
        {t("loadError")}
      </p>
    );
  }

  return (
    <div className="border border-dust-grey">
      <div className="flex items-center gap-2 border-b border-dust-grey bg-powder-petal/40 px-4 py-3">
        <CalendarBold size={16} color="var(--toffee-brown)" />
        <span className="cursor-default font-serif text-carbon-black capitalize select-none">
          {dayLabel}
        </span>
      </div>

      {!loading && events.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <CalendarMinimalisticBold size={44} color="var(--toffee-brown)" />
          <p className="mt-5 font-serif text-carbon-black">{t("emptyTitle")}</p>
          <p className="mt-1.5 max-w-sm text-coffee-bean/70">{t("emptyDescription")}</p>
          <Button onClick={onAdd} className="mt-6 h-11 bg-toffee-brown px-5 hover:bg-olive-wood">
            {t("add")}
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-dust-grey bg-powder-petal/40 hover:bg-powder-petal/40">
              {/* Sem rótulo: é decorativo, o mesmo ícone se repete em toda linha. */}
              <TableHead className={`${HEAD_CLASS} w-11`} />
              <TableHead className={HEAD_CLASS}>{t("columnTitle")}</TableHead>
              <TableHead className={HEAD_CLASS}>{t("columnType")}</TableHead>
              <TableHead className={HEAD_CLASS}>{t("columnTime")}</TableHead>
              <TableHead className={HEAD_CLASS}>{t("columnEndAt")}</TableHead>
              <TableHead className={`${HEAD_CLASS} text-end`}>{t("columnActions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={i} className="border-dust-grey hover:bg-transparent">
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className={`size-8 ${SKELETON_CLASS}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className={`h-4 ${TITLE_SKELETON_WIDTHS[i % 3]} ${SKELETON_CLASS}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className={`h-4 w-24 ${SKELETON_CLASS}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className={`h-4 w-16 ${SKELETON_CLASS}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className={`h-4 w-16 ${SKELETON_CLASS}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                        <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : events.map((event) => (
                  <TableRow
                    key={event._id}
                    className="group border-dust-grey transition-colors hover:bg-toffee-brown/[0.06]"
                  >
                    <TableCell className="px-4 py-3.5">
                      <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                        <CalendarBold size={16} color="var(--toffee-brown)" />
                      </span>
                    </TableCell>
                    <TableCell className="select-none px-4 py-3.5">
                      <span className="flex items-center gap-1.5 font-serif text-carbon-black">
                        <span className="cursor-default">{localizedText(event.title, locale)}</span>
                        {event.recurrence && (
                          <RepeatBold
                            size={14}
                            className="shrink-0 text-coffee-bean/70"
                            aria-label={t("recurringBadgeLabel")}
                          />
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                      {tTypes(event.eventType)}
                    </TableCell>
                    <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/60">
                      {format(new Date(event.startDate), "HH:mm", { locale: dateLocale })}
                    </TableCell>
                    <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/60">
                      {event.endDate
                        ? format(
                            new Date(event.endDate),
                            isSameDay(new Date(event.startDate), new Date(event.endDate))
                              ? "HH:mm"
                              : "d MMM, HH:mm",
                            { locale: dateLocale },
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("edit")}
                          className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
                          onClick={() => onEdit(event)}
                        >
                          <PenNewSquareBoldDuotone size={22} className="size-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("delete")}
                          className="size-9 text-coffee-bean hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(event)}
                        >
                          <TrashBinTrashBoldDuotone size={22} className="size-6" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>

          {!loading && (
            <TableFooter className="border-t border-dust-grey bg-powder-petal/20 hover:bg-powder-petal/20">
              <TableRow className="border-dust-grey hover:bg-transparent">
                <TableCell className="px-4 py-3">
                  <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                    <CalendarBold size={16} color="var(--toffee-brown)" />
                  </span>
                </TableCell>
                <TableCell colSpan={5} className="px-4 py-3 font-normal text-coffee-bean/70">
                  {t.rich("dayEventCount", {
                    count: events.length,
                    strong: (chunks) => (
                      <strong className="font-semibold text-carbon-black">{chunks}</strong>
                    ),
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      )}
    </div>
  );
}
