"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import { CalendarBold, ClockCircleBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;
const DEFAULT_TIME = { hours: 10, minutes: 0 };
const MINUTE_STEP = 5;
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) =>
  String(i * MINUTE_STEP).padStart(2, "0")
);

type Props = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  /** Se ausente, o campo não pode ser limpo — use pra campos obrigatórios como início. */
  clearLabel?: string;
};

/**
 * Data + hora num único campo: Popover com Calendar pra data, campo de hora por baixo,
 * combinados num só `Date`. A hora replica o widget nativo (duas colunas roláveis,
 * hora | minuto) em HTML nosso: o popup do `input type="time"` é UI do navegador/SO e
 * ignora qualquer CSS, então não aceitava nem a paleta do site nem `cursor-pointer`.
 */
export function DateTimePicker({ value, onChange, placeholder, clearLabel }: Props) {
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  function handleDaySelect(day: Date | undefined) {
    if (!day) {
      onChange(undefined);
      return;
    }
    // Troca só a data, preserva a hora já escolhida (ou um padrão neutro na primeira vez).
    const next = new Date(day);
    if (value) next.setHours(value.getHours(), value.getMinutes());
    else next.setHours(DEFAULT_TIME.hours, DEFAULT_TIME.minutes);
    onChange(next);
  }

  function handleTimeChange(hours: number, minutes: number) {
    if (!value) return;
    const next = new Date(value);
    next.setHours(hours, minutes);
    onChange(next);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full justify-start gap-2 border-dust-grey bg-white font-normal text-carbon-black hover:bg-white",
            !value && "text-coffee-bean/50"
          )}
        >
          <CalendarBold size={16} color="var(--toffee-brown)" className="size-4 shrink-0" />
          {value
            ? format(value, "d MMMM yyyy 'à' HH:mm", { locale: dateLocales[locale] })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto space-y-3 border-dust-grey bg-parchment p-3">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDaySelect}
          locale={dateLocales[locale]}
          className="p-0"
        />
        <div className="flex items-center gap-2">
          <TimeField value={value} onChange={handleTimeChange} />
          {clearLabel && value && (
            <Button
              type="button"
              variant="ghost"
              className="h-10 shrink-0 text-coffee-bean"
              onClick={() => onChange(undefined)}
            >
              {clearLabel}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Campo de hora com o mesmo desenho do widget nativo: caixa mostrando `HH:mm` e, ao abrir,
 * um painel logo abaixo com duas colunas roláveis (horas | minutos). O painel é posicionado
 * no fluxo (`absolute`, sem portal) porque este campo já vive dentro do Popover do calendário
 * — um portal calcularia a posição pela viewport e o painel abriria solto na tela.
 */
function TimeField({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (hours: number, minutes: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const disabled = !value;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Abre com a opção escolhida já visível no topo de cada coluna, como o widget nativo.
  useEffect(() => {
    if (!open) return;
    for (const column of [hoursRef.current, minutesRef.current]) {
      const selected = column?.querySelector<HTMLElement>("[data-selected=true]");
      if (column && selected) column.scrollTop = selected.offsetTop;
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-dust-grey bg-white px-3 text-sm text-carbon-black transition-colors",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {value ? format(value, "HH:mm") : "--:--"}
        <ClockCircleBold size={16} color="var(--toffee-brown)" className="size-4 shrink-0" />
      </button>

      {open && value && (
        <div className="absolute top-full left-0 z-50 mt-1 flex overflow-hidden rounded-md border border-dust-grey bg-white shadow-md">
          <TimeColumn
            columnRef={hoursRef}
            options={HOURS}
            selected={format(value, "HH")}
            onSelect={(hour) => onChange(Number(hour), value.getMinutes())}
          />
          <TimeColumn
            columnRef={minutesRef}
            options={MINUTES}
            selected={format(value, "mm")}
            onSelect={(minute) => onChange(value.getHours(), Number(minute))}
          />
        </div>
      )}
    </div>
  );
}

function TimeColumn({
  columnRef,
  options,
  selected,
  onSelect,
}: {
  columnRef: RefObject<HTMLDivElement | null>;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  // A roda do mouse precisa de listener nativo não-passivo: o `onWheel` do React é sempre
  // passivo (não dá pra `preventDefault`) e, dentro do Popover, o scroll da coluna não
  // acontecia sozinho — o evento subia e era descartado antes de rolar a lista.
  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      event.stopPropagation();
      column!.scrollTop += event.deltaY;
    }

    column.addEventListener("wheel", handleWheel, { passive: false });
    return () => column.removeEventListener("wheel", handleWheel);
  }, [columnRef]);

  return (
    <div
      ref={columnRef}
      className="scrollbar-hide relative max-h-[15.75rem] w-16 overflow-y-auto border-dust-grey not-first:border-l"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          data-selected={option === selected}
          onClick={() => onSelect(option)}
          className={cn(
            "flex h-9 w-full cursor-pointer items-center justify-center text-sm text-carbon-black transition-colors",
            "hover:bg-dust-grey",
            "data-[selected=true]:bg-toffee-brown data-[selected=true]:font-medium data-[selected=true]:text-parchment"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
