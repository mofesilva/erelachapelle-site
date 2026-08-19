"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  addMonths,
  format,
  setMonth as setMonthOfYear,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { AltArrowLeftBold, AltArrowRightBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventHoverProvider, makeEventDayButton } from "./EventDayCell";
import { makeEventWeek } from "./EventWeekRow";
import type { Event } from "../../_features/events/event.type";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;
const YEARS_BACK = 5;
const YEARS_FORWARD = 15;

type Props = {
  events: Event[];
  loading: boolean;
  loadFailed: boolean;
  month: Date;
  onMonthChange: (month: Date) => void;
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  onEditEvent: (event: Event) => void;
};

/**
 * Sem `mode`/`selected` do DayPicker: essa grade é uma visão de conteúdo (mostra eventos e
 * marca o dia escolhido pra lista abaixo), não um seletor de data isolado — isso já existe à
 * parte no DateTimePicker do formulário. Cabeçalho (setas + seletores de mês/ano) é todo
 * nosso, e não o `captionLayout="dropdown"` do shadcn: os dropdowns nativos do react-day-picker
 * limitam os anos ao intervalo de `startMonth`/`endMonth` e não dá pra estilizar as setas
 * separado do popover — mais simples reconstruir com o `Select` que o resto do projeto já usa.
 *
 * Puramente apresentacional — não é dona do fetch, do mês nem do dia selecionado. Isso fica
 * com a página, que também precisa desses três pra reconsultar depois de criar/editar/excluir
 * sem perder o que o admin estava vendo.
 */
export function EventsCalendar({
  events,
  loading,
  loadFailed,
  month,
  onMonthChange,
  selectedDay,
  onSelectDay,
  onEditEvent,
}: Props) {
  const t = useTranslations("admin.events");
  const locale = useLocale() as Locale;
  const dateLocale = dateLocales[locale];

  const monthNames = useMemo(
    () =>
      // Dia 1 fixo: `setMonth` num dia como 31 estoura pro mês seguinte (31 de janeiro + 1 mês
      // vira março), o que erraria justo o nome do mês que queremos formatar.
      Array.from({ length: 12 }, (_, i) =>
        format(new Date(2000, i, 1), "LLLL", { locale: dateLocale })
      ),
    [dateLocale]
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: YEARS_BACK + YEARS_FORWARD + 1 },
      (_, i) => currentYear - YEARS_BACK + i
    );
  }, []);

  const DayButtonComponent = useMemo(() => makeEventDayButton(), []);

  const WeekComponent = useMemo(
    () => makeEventWeek(events, onEditEvent, (count) => `+${count}`),
    [events, onEditEvent]
  );

  if (loadFailed) {
    return (
      <p
        className="border border-destructive/30 bg-destructive/5 p-4 text-destructive"
        role="alert"
      >
        {t("calendarLoadError")}
      </p>
    );
  }

  return (
    <div
      className={
        "border border-dust-grey bg-white transition-opacity" + (loading ? " opacity-60" : "")
      }
    >
      {/* Cor sólida (não `bg-powder-petal/40`): esse cabeçalho fica sobre um card branco,
          enquanto o header da EventsTable fica sobre o fundo parchment da página — a mesma
          cor translúcida resultaria em dois tons diferentes. `#f0e7e2` é powder-petal a 40%
          já resolvido sobre parchment, pra bater com a cor real da tabela em qualquer fundo. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dust-grey bg-[#f0e7e2] px-4 py-3">
        <h2 className="font-serif text-h6 text-carbon-black capitalize">
          {format(month, "LLLL yyyy", { locale: dateLocale })}
        </h2>

        <div className="flex items-center gap-2">
          <Select
            value={String(month.getMonth())}
            // Normaliza pro dia 1 antes de trocar mês/ano: `setMonth`/`setYear` não travam em
            // meses mais curtos (31 de janeiro + fevereiro rolaria pra março) — dia 1 não estoura.
            onValueChange={(value) =>
              onMonthChange(setMonthOfYear(startOfMonth(month), Number(value)))
            }
          >
            <SelectTrigger className="h-9 w-36 cursor-pointer border-dust-grey bg-white capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((name, i) => (
                <SelectItem key={i} value={String(i)} className="cursor-pointer capitalize">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(month.getFullYear())}
            onValueChange={(value) => onMonthChange(setYear(startOfMonth(month), Number(value)))}
          >
            <SelectTrigger className="h-9 w-24 cursor-pointer border-dust-grey bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)} className="cursor-pointer">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="h-9 border-dust-grey bg-white px-3 text-coffee-bean hover:border-toffee-brown hover:bg-toffee-brown/10"
            onClick={() => {
              const today = new Date();
              onMonthChange(startOfMonth(today));
              onSelectDay(today);
            }}
          >
            {t("today")}
          </Button>

          {/* Par colado: as setas são uma coisa só, não dois controles independentes. */}
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("previous")}
              className="size-9 border-dust-grey bg-white hover:border-toffee-brown hover:bg-toffee-brown/10"
              onClick={() => onMonthChange(subMonths(month, 1))}
            >
              <AltArrowLeftBold size={16} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("next")}
              className="-ml-px size-9 border-dust-grey bg-white hover:border-toffee-brown hover:bg-toffee-brown/10"
              onClick={() => onMonthChange(addMonths(month, 1))}
            >
              <AltArrowRightBold size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* `mode="single"` não é só pelo destaque do dia: sem `mode` (ou `onDayClick`) o
          DayPicker considera a grade não-interativa e nem chega a renderizar `DayButton` —
          cada dia sairia como texto solto, sem as pastilhas de evento. `onSelect` recebe
          `undefined` ao clicar de novo no dia já escolhido; aqui isso é ignorado, a lista de
          baixo sempre mostra algum dia.

          O provider fica por fora do `Calendar` (e não dentro da célula) porque o destaque é
          compartilhado: passar o mouse numa fatia acende todas as fatias daquele evento, em
          qualquer dia ou semana da grade. */}
      <EventHoverProvider>
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={(day) => day && onSelectDay(day)}
          month={month}
          onMonthChange={onMonthChange}
          locale={dateLocale}
          // Cabeçalho da grade com só a inicial do dia (D S T Q Q S S / S M T W T F S) em vez da
          // abreviação de duas letras que o react-day-picker usa por padrão.
          formatters={{
            formatWeekdayName: (day) => format(day, "EEEEE", { locale: dateLocale }),
          }}
          showOutsideDays
          className="w-full p-0"
          classNames={{
            // O shadcn manda `w-fit` na raiz, pensando no calendário dentro de um popover. Aqui
            // a grade ocupa a largura da página; sem trocar, a tabela estoura o card em vez de
            // se ajustar a ele.
            root: "w-full",
            months: "w-full",
            month: "w-full gap-0",
            // Cabeçalho e navegação do shadcn saem de cena: os nossos ficam acima da grade.
            month_caption: "hidden",
            nav: "hidden",
            // `table-fixed`: sem isso a largura da tabela sobe pro min-content das células e ela
            // estoura o card em telas menores, mesmo com `w-full`.
            month_grid: "w-full table-fixed border-collapse",
            weekdays: "flex border-b border-dust-grey bg-[#f0e7e2]",
            weekday:
              "flex-1 py-2.5 text-center text-xs font-semibold tracking-wide text-coffee-bean/70 uppercase",
            // Bordas só à direita e embaixo, e removidas na última coluna/linha: a borda do
            // container fecha o desenho sem virar linha dupla nas beiradas. `relative` é o
            // ancoradouro da camada de barras de `EventWeekRow`.
            week: "relative flex w-full [&:last-child>td]:border-b-0",
            // `flex-1 basis-0 min-w-0` em vez de `w-full`: como a semana é flex, sem zerar a
            // base e o min-width o título de um evento longo empurra a célula e as sete colunas
            // saem com larguras diferentes.
            day: "h-26 min-w-0 flex-1 basis-0 border-r border-b border-dust-grey p-0 align-top last:border-r-0",
            // O padrão do shadcn pinta a célula de hoje/selecionada com `bg-accent`, que nesse
            // projeto resolve pro toffee-brown da marca — quem desenha esses dois estados é a
            // própria célula, com contraste bem mais suave.
            today: "",
            selected: "",
          }}
          components={{ DayButton: DayButtonComponent, Week: WeekComponent }}
        />
      </EventHoverProvider>
    </div>
  );
}
