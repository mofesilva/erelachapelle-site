"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import type { DayButton } from "react-day-picker";
import { RepeatBold } from "solar-icon-set";
import { cn } from "@/lib/utils";
import { localizedText } from "../../_lib/localized-text";
import type { Event } from "../../_features/events/event.type";
import type { Locale } from "@/types/common";

/**
 * Um evento que cruza a virada da semana quebra de linha, então é desenhado como uma barra por
 * linha — duas barras, mesmo evento. O `:hover` do CSS só alcança a barra embaixo do mouse, por
 * isso o destaque vive aqui: todas as barras do mesmo `_id` acendem juntas.
 *
 * O estado fica num contexto, e não numa prop, pra não entrar nas dependências das factories de
 * célula e de semana — recriá-las a cada mouseenter remontaria a grade e o hover se perderia
 * no meio do caminho.
 */
type EventHoverValue = {
  hoveredEventId: string | null;
  setHoveredEventId: (id: string | null) => void;
};

const EventHoverContext = createContext<EventHoverValue>({
  hoveredEventId: null,
  setHoveredEventId: () => {},
});

export function EventHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const value = useMemo(() => ({ hoveredEventId, setHoveredEventId }), [hoveredEventId]);
  return <EventHoverContext.Provider value={value}>{children}</EventHoverContext.Provider>;
}

type PillProps = {
  event: Event;
  /** Só a barra que começa no evento mostra o horário; a continuação repete apenas o título. */
  showTime: boolean;
  /** Marca a ponta inicial com a borda dourada — a continuação não tem "começo" pra marcar. */
  opensLeft: boolean;
  onSelect: (event: Event) => void;
};

/** Preenche a barra posicionada por `EventWeekRow`, ocupando 100% dela. */
export function EventPill({ event, showTime, opensLeft, onSelect }: PillProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.events");
  const { hoveredEventId, setHoveredEventId } = useContext(EventHoverContext);
  const active = hoveredEventId === event._id;
  const title = localizedText(event.title, locale);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      onMouseEnter={() => setHoveredEventId(event._id)}
      onMouseLeave={() => setHoveredEventId(null)}
      // Teclado tem o mesmo destaque do mouse: quem navega por Tab também precisa enxergar
      // até onde o evento vai.
      onFocus={() => setHoveredEventId(event._id)}
      onBlur={() => setHoveredEventId(null)}
      title={title}
      className={cn(
        "flex h-full w-full min-w-0 cursor-pointer items-center gap-1.5 px-1.5 text-left text-xs transition-colors",
        active ? "bg-toffee-brown text-parchment" : "bg-toffee-brown-tint text-carbon-black",
        opensLeft ? "border-l-2 border-toffee-brown" : "border-l-2 border-transparent"
      )}
    >
      {showTime && (
        <span className={cn("shrink-0 tabular-nums", active ? "text-parchment" : "text-coffee-bean")}>
          {format(new Date(event.startDate), "HH:mm")}
        </span>
      )}
      {event.recurrence && (
        <RepeatBold size={12} className="shrink-0" aria-label={t("recurringBadgeLabel")} />
      )}
      <span className="min-w-0 truncate">{title}</span>
    </button>
  );
}

/**
 * `components.DayButton` do react-day-picker só recebe `day`/`modifiers`/props de botão. Aqui
 * a célula cuida apenas do que é do dia — número, fundo, seleção, hoje — porque os eventos são
 * desenhados por cima, pela camada de `EventWeekRow`.
 *
 * Vira um <div>, não um <button>: as barras de evento ficam por cima da célula e são elas
 * próprias botões, e botão dentro de botão é HTML inválido. Os handlers que o DayPicker injeta
 * (clique, setas do teclado, foco) continuam sendo repassados — só `type`/`disabled` ficam de
 * fora, que não existem em <div> — e Enter/Espaço, que num botão seriam nativos, entram na mão.
 */
export function makeEventDayButton() {
  return function EventDayButton({
    day,
    modifiers,
    className,
    type: _type,
    disabled: _disabled,
    onClick,
    onKeyDown,
    ...dayProps
  }: ComponentProps<typeof DayButton>) {
    function handleKeyDown(keyEvent: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(keyEvent as unknown as KeyboardEvent<HTMLButtonElement>);
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        keyEvent.currentTarget.click();
      }
    }

    return (
      <div
        {...(dayProps as ComponentProps<"div">)}
        role="button"
        onClick={onClick as unknown as ComponentProps<"div">["onClick"]}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-full w-full cursor-pointer p-2 text-left transition-colors",
          "focus-visible:ring-1 focus-visible:ring-toffee-brown focus-visible:ring-inset focus-visible:outline-none",
          modifiers.outside ? "bg-parchment" : "bg-white",
          modifiers.selected
            ? "bg-powder-petal ring-1 ring-toffee-brown ring-inset"
            : "hover:bg-dust-grey",
          className
        )}
      >
        <span
          className={cn(
            "flex size-5 items-center justify-center text-xs tabular-nums",
            modifiers.today
              ? "bg-toffee-brown font-semibold text-parchment"
              : modifiers.outside
                ? "text-coffee-bean/40"
                : "text-carbon-black"
          )}
        >
          {day.date.getDate()}
        </span>
      </div>
    );
  };
}
