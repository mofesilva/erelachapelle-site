"use client";

import type { ComponentProps } from "react";
import type { Week } from "react-day-picker";
import { EventPill } from "./EventDayCell";
import {
  CALENDAR_GEOMETRY,
  layoutWeek,
  toDayKey,
} from "../../_features/events/event.calendar";
import type { Event } from "../../_features/events/event.type";

const { cellPadding, laneTop, laneHeight, laneGap, maxLanes } = CALENDAR_GEOMETRY;

/**
 * Substitui o `<tr>` do react-day-picker por um que, além das sete células, carrega uma camada
 * absoluta com as barras dos eventos.
 *
 * É aqui que mora a continuidade: um evento que cobre vários dias é UMA barra só, esticada por
 * cima das colunas. Tentar emendar um pedaço por célula não fecha — a linha da grade e o anel
 * do dia selecionado são decorações da própria célula e sempre reaparecem na divisa. Fora do
 * fluxo e posicionada, a barra passa por cima de tudo isso sem nada atravessando.
 *
 * A camada é `pointer-events-none` pra não roubar o clique dos dias; só as barras voltam a
 * receber ponteiro.
 */
export function makeEventWeek(
  events: Event[],
  onEventClick: (event: Event) => void,
  overflowLabel: (count: number) => string
) {
  return function EventWeek({ week, children, className, ...trProps }: ComponentProps<typeof Week>) {
    const weekDays = week.days.map((day) => day.date);
    const { bars, overflowByDayKey } = layoutWeek(events, weekDays, maxLanes);
    const columnWidth = 100 / weekDays.length;

    return (
      <tr {...trProps} className={className}>
        {children}

        <td className="pointer-events-none absolute inset-0 border-0 p-0">
          {bars.map((bar) => (
            <div
              key={`${bar.event._id}-${bar.startIndex}`}
              className="pointer-events-auto absolute"
              style={{
                // O recuo só existe nas pontas reais do evento: onde ele continua na semana,
                // a barra encosta na borda da linha e emenda com a continuação.
                left: `calc(${bar.startIndex * columnWidth}% + ${bar.opensLeft ? cellPadding : 0}px)`,
                width: `calc(${bar.span * columnWidth}% - ${
                  (bar.opensLeft ? cellPadding : 0) + (bar.closesRight ? cellPadding : 0)
                }px)`,
                top: laneTop + bar.lane * (laneHeight + laneGap),
                height: laneHeight,
              }}
            >
              <EventPill
                event={bar.event}
                showTime={bar.opensLeft}
                opensLeft={bar.opensLeft}
                onSelect={onEventClick}
              />
            </div>
          ))}

          {weekDays.map((day, index) => {
            const overflow = overflowByDayKey.get(toDayKey(day)) ?? 0;
            if (overflow === 0) return null;
            return (
              <span
                key={toDayKey(day)}
                className="absolute text-xs text-coffee-bean/70"
                style={{
                  left: `calc(${index * columnWidth}% + ${cellPadding}px)`,
                  top: laneTop + maxLanes * (laneHeight + laneGap),
                }}
              >
                {overflowLabel(overflow)}
              </span>
            );
          })}
        </td>
      </tr>
    );
  };
}
