import type { Event } from "@/types/event";
import { fetchList } from "@/lib/api/client";

// Volume baixo (poucos eventos por mês, ver docs/contexto-e-referencia.md) — uma busca
// de até 100 cobre a base inteira numa requisição só, igual ao padrão de sermons.ts/blog.ts.
const FETCH_SIZE = 100;

export async function getAllEvents(): Promise<Event[]> {
  const events = await fetchList<Event>(`/events?limit=${FETCH_SIZE}`);
  return events.filter((e) => e.active !== false);
}

/**
 * Eventos a partir de `referenceDate`, dentro de uma janela de 1 ano. Usa o modo `from`/`to`
 * da API (mesmo endpoint do calendário do admin) em vez do modo paginado: só ele expande
 * ocorrências de eventos recorrentes (ver `erelachapelle-api/src/routes/events.ts`), então é
 * o único jeito de um culto semanal, por exemplo, aparecer corretamente como "próximo evento".
 */
export async function getUpcomingEvents(referenceDate: Date, limit = 3): Promise<Event[]> {
  const from = referenceDate.toISOString();
  const to = new Date(referenceDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const events = await fetchList<Event>(`/events?from=${from}&to=${to}`);
  return events
    .filter(
      (e) => e.active !== false && new Date(e.startDate).getTime() >= referenceDate.getTime()
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const events = await getAllEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

export async function getEventTypes(): Promise<string[]> {
  const events = await getAllEvents();
  return Array.from(new Set(events.map((e) => e.eventType))).sort();
}

export async function filterEvents(filters: {
  eventType?: string;
  locationName?: string;
}): Promise<Event[]> {
  const events = await getAllEvents();
  return events.filter((e) => {
    if (filters.eventType && e.eventType !== filters.eventType) return false;
    if (filters.locationName && e.location.name !== filters.locationName) return false;
    return true;
  });
}
