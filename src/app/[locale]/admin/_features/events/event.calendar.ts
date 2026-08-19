import { differenceInCalendarDays, isSameDay } from "date-fns";
import type { Event } from "./event.type";

/** Medidas da grade, em px. Mudou aqui, mudou o `h-26` da célula em `EventsCalendar`. */
export const CALENDAR_GEOMETRY = {
  /** `p-2` da célula. */
  cellPadding: 8,
  /** Onde a primeira faixa começa: padding + número do dia (`size-5`) + o gap abaixo dele. */
  laneTop: 32,
  laneHeight: 20,
  laneGap: 2,
  maxLanes: 2,
} as const;

/**
 * Teto de segurança pra expansão de eventos de vários dias: um `endDate` digitado errado
 * (ano trocado, por exemplo) geraria milhares de entradas no mapa do calendário. A grade
 * mostra no máximo ~6 semanas, então qualquer coisa além de um ano já é ruído.
 */
const MAX_SPAN_DAYS = 366;

/** Chave estável por dia local — `toISOString` converteria pra UTC e trocaria o dia. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Último dia que o evento ocupa: o fim quando existe, senão o próprio dia de início. */
export function eventLastDay(event: Event): Date {
  return new Date(event.endDate ?? event.startDate);
}

/**
 * Ordena o que o calendário desenha primeiro. Eventos de vários dias vêm antes dos de um dia
 * só: como cada célula renderiza sua própria fatia, é essa ordem igual em todos os dias que
 * faz as fatias caírem na mesma linha e a barra parecer contínua.
 */
function compareForCalendar(a: Event, b: Event): number {
  const aSpans = !isSameDay(new Date(a.startDate), eventLastDay(a));
  const bSpans = !isSameDay(new Date(b.startDate), eventLastDay(b));
  if (aSpans !== bSpans) return aSpans ? -1 : 1;
  return a.startDate.localeCompare(b.startDate) || a._id.localeCompare(b._id);
}

/**
 * Mapa dia → eventos, repetindo o evento em cada dia que ele cobre (não só no de início) —
 * é o que permite a barra atravessar de 09 a 10 na grade.
 */
export function groupEventsByDay(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>();

  for (const event of events) {
    const start = new Date(event.startDate);
    const span = Math.min(
      Math.max(differenceInCalendarDays(eventLastDay(event), start), 0),
      MAX_SPAN_DAYS
    );

    for (let offset = 0; offset <= span; offset++) {
      // Anda no calendário local (não somando 24h) pra não escorregar em mudança de horário
      // de verão, quando o dia tem 23 ou 25 horas.
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset);
      const key = toDayKey(day);
      const bucket = map.get(key);
      if (bucket) bucket.push(event);
      else map.set(key, [event]);
    }
  }

  for (const bucket of map.values()) bucket.sort(compareForCalendar);
  return map;
}

/** Eventos que acontecem no dia — inclui os de vários dias que só passam por ele. */
export function eventsOnDay(events: Event[], day: Date): Event[] {
  const key = toDayKey(day);
  return (groupEventsByDay(events).get(key) ?? []).slice();
}

/** Uma barra desenhada por cima de uma linha da semana, já com coluna, largura e faixa. */
export type WeekBar = {
  event: Event;
  /** Coluna onde a barra começa nesta semana (0–6). */
  startIndex: number;
  /** Quantas colunas ela ocupa (1–7). */
  span: number;
  /** Faixa horizontal dentro da célula — barras que se cruzam nunca dividem a mesma. */
  lane: number;
  /** O evento começa mesmo aqui (e não é continuação da semana anterior). */
  opensLeft: boolean;
  /** O evento termina aqui (e não continua na semana seguinte). */
  closesRight: boolean;
};

export type WeekLayout = {
  bars: WeekBar[];
  /** Quantos eventos daquele dia não couberam nas faixas visíveis. */
  overflowByDayKey: Map<string, number>;
};

/**
 * Resolve o desenho de uma semana inteira de uma vez: cada evento vira UMA barra contínua
 * cobrindo todas as colunas que ele ocupa, em vez de um pedaço por dia. É o que garante a
 * continuidade — não existe divisa pra interromper o que é um elemento só.
 *
 * As faixas (`lane`) são alocadas por varredura gulosa: o evento pega a primeira faixa livre
 * em todas as colunas que ele cobre, então dois eventos que se sobrepõem nunca se empilham em
 * cima um do outro. O que passa do teto de faixas não some — vira contagem em `overflowByDayKey`.
 */
export function layoutWeek(events: Event[], weekDays: Date[], maxLanes: number): WeekLayout {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];

  const candidates = events
    .map((event) => {
      const start = new Date(event.startDate);
      const end = eventLastDay(event);
      const startIndex = weekDays.findIndex((day) => isSameDay(day, start));
      const endIndex = weekDays.findIndex((day) => isSameDay(day, end));

      // Um evento pode começar antes da semana e/ou terminar depois dela: aí a barra encosta
      // na borda correspondente e segue na linha seguinte.
      const from = startIndex >= 0 ? startIndex : differenceInCalendarDays(start, first) < 0 ? 0 : -1;
      const to = endIndex >= 0 ? endIndex : differenceInCalendarDays(end, last) > 0 ? weekDays.length - 1 : -1;
      if (from < 0 || to < 0 || to < from) return null;

      return {
        event,
        startIndex: from,
        span: to - from + 1,
        opensLeft: startIndex >= 0,
        closesRight: endIndex >= 0,
      };
    })
    .filter((bar): bar is NonNullable<typeof bar> => bar !== null)
    // Barras mais longas primeiro: ficam nas faixas de cima, e os eventos de um dia só
    // preenchem os buracos embaixo — é a ordem que deixa a grade legível.
    .sort(
      (a, b) =>
        b.span - a.span ||
        a.event.startDate.localeCompare(b.event.startDate) ||
        a.event._id.localeCompare(b.event._id)
    );

  const lanes: boolean[][] = [];
  const bars: WeekBar[] = [];
  const overflowByDayKey = new Map<string, number>();

  for (const candidate of candidates) {
    const columns = Array.from({ length: candidate.span }, (_, i) => candidate.startIndex + i);

    let lane = lanes.findIndex((occupied) => columns.every((column) => !occupied[column]));
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(Array(weekDays.length).fill(false));
    }
    for (const column of columns) lanes[lane][column] = true;

    if (lane < maxLanes) {
      bars.push({ ...candidate, lane });
    } else {
      for (const column of columns) {
        const key = toDayKey(weekDays[column]);
        overflowByDayKey.set(key, (overflowByDayKey.get(key) ?? 0) + 1);
      }
    }
  }

  return { bars, overflowByDayKey };
}
