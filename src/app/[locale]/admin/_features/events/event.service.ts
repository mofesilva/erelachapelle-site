import { apiFetch } from "../../_lib/http-client";
import { DEFAULT_LOCATION } from "./event.constants";
import type { EventFormValues } from "./event.schema";
import type { Event, EventRecurrence } from "./event.type";

export type EventPage = {
  items: Event[];
  nextCursor: string | null;
};

/** Todos os eventos de um período, sem paginação — fonte tanto do calendário quanto da lista do dia. */
export function listEventsInRange(from: Date, to: Date) {
  const query = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
  return apiFetch<EventPage>(`/events?${query.toString()}`);
}

/**
 * Sem `slug`: ele é URL pública e precisa ser único, então quem gera é a API, que tem o banco
 * pra garantir isso. Na criação ela deriva do título (`mission-locale`, `mission-locale-2`…) e
 * depois nunca mais muda — editar o título não quebra link já compartilhado nem o sitemap.
 */
/**
 * `null` explícito (não `undefined`) quando "não repete": a API trata a ausência da chave
 * num PUT parcial como "não mexe na recorrência existente", então desligar "repetir" num
 * evento que já era recorrente exige mandar `null` de propósito.
 */
function buildRecurrence(values: EventFormValues): EventRecurrence | null {
  if (values.recurrenceFrequency === "none") return null;

  const end: EventRecurrence["end"] =
    values.recurrenceEndType === "until"
      ? { type: "until", until: values.recurrenceUntil!.toISOString() }
      : values.recurrenceEndType === "count"
        ? { type: "count", count: Number(values.recurrenceCount) }
        : { type: "never" };

  return {
    frequency: values.recurrenceFrequency,
    weekdays: values.recurrenceFrequency === "custom" ? values.recurrenceWeekdays : undefined,
    end,
  };
}

function buildBody(values: EventFormValues) {
  return {
    title: { fr: values.title.fr },
    description: { fr: values.description.fr },
    eventType: values.eventType,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate?.toISOString(),
    location: DEFAULT_LOCATION,
    customAddress: values.customAddress || undefined,
    featuredImage: values.featuredImage ?? null,
    capacity: values.capacity ? Number(values.capacity) : undefined,
    recurrence: buildRecurrence(values),
  };
}

/** Exige role editor/admin. `createdBy`/`updatedBy` são preenchidos pelo servidor a partir do JWT. */
export function createEvent(values: EventFormValues, token: string) {
  return apiFetch<Event>("/events", { method: "POST", token, body: buildBody(values) });
}

/** PUT aceita corpo parcial — só mandamos o que a tela edita, o resto fica intacto. */
export function updateEvent(id: string, values: EventFormValues, token: string) {
  return apiFetch<Event>(`/events/${id}`, { method: "PUT", token, body: buildBody(values) });
}

/** Hard delete: a API remove o documento de vez, sem lixeira nem restore. */
export function deleteEvent(id: string, token: string) {
  return apiFetch<void>(`/events/${id}`, { method: "DELETE", token });
}
