"use client";

import { useCallback, useEffect, useState } from "react";
import { endOfMonth, startOfMonth } from "date-fns";
import { useAdminAuth } from "../../_lib/auth-context";
import { createEvent, deleteEvent, listEventsInRange, updateEvent } from "./event.service";
import type { EventFormValues } from "./event.schema";
import type { Event } from "./event.type";

/** Todos os eventos do mês visível — fonte tanto do grid do calendário quanto da lista do dia selecionado. */
export function useEventsCalendar(month: Date) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const page = await listEventsInRange(startOfMonth(month), endOfMonth(month));
      setEvents(page.items);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { events, loading, loadFailed, refetch };
}

/** Criar/editar/excluir por id — sem estado de lista próprio, quem exibe os eventos é o calendário. */
export function useEventMutations() {
  const { accessToken } = useAdminAuth();

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  /** Deixa o erro subir: quem chama é o formulário, que sabe traduzir por status. */
  async function create(values: EventFormValues) {
    await createEvent(values, requireToken());
  }

  async function update(id: string, values: EventFormValues) {
    await updateEvent(id, values, requireToken());
  }

  async function remove(id: string) {
    await deleteEvent(id, requireToken());
  }

  return { create, update, remove };
}
