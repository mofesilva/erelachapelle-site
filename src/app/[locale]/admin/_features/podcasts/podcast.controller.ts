"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import { createPodcast, deletePodcast, listPodcasts, updatePodcast } from "./podcast.service";
import type { PodcastFormValues } from "./podcast.schema";
import type { Podcast } from "./podcast.type";

// Mesmo motivo do MIN_LOADING_MS em sermon.controller.ts: evita o "flash" do skeleton
// quando a API responde rápido demais pra sequer perceber o carregamento.
const MIN_LOADING_MS = 400;

export const PAGE_SIZE = 24;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePodcasts() {
  const { accessToken } = useAdminAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Mesmo esquema de sermon.controller.ts: cursor por keyset só sabe avançar, então
  // guardamos o cursor usado em cada página já visitada; o último da pilha é a página
  // atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  const fetchPage = useCallback(async (cursor: string | null) => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      const podcastPage = await listPodcasts({ cursor: cursor ?? undefined, limit: PAGE_SIZE });
      setPodcasts(podcastPage.items);
      setNextCursor(podcastPage.nextCursor);
    } catch {
      setLoadFailed(true);
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(currentCursor);
  }, [currentCursor, fetchPage]);

  function goToNextPage() {
    if (nextCursor) setCursorHistory((history) => [...history, nextCursor]);
  }

  function goToPreviousPage() {
    setCursorHistory((history) => (history.length > 1 ? history.slice(0, -1) : history));
  }

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  /** Deixa o erro subir: quem chama é o formulário, que sabe traduzir por status. */
  async function create(values: PodcastFormValues) {
    await createPodcast(values, requireToken());
    // Ordenado do mais novo pro mais antigo — o episódio recém-criado sempre cai na
    // primeira página, então é pra lá que a gente volta pra ele aparecer na hora.
    setCursorHistory([null]);
    await fetchPage(null);
  }

  async function update(id: string, values: PodcastFormValues) {
    await updatePodcast(id, values, requireToken());
    await fetchPage(currentCursor);
  }

  async function remove(id: string) {
    await deletePodcast(id, requireToken());
    // Se esse era o último episódio da última página, recua uma página em vez de
    // deixar a tela vazia com "anterior" ainda clicável pra trás.
    if (podcasts.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  return {
    podcasts,
    loading,
    loadFailed,
    create,
    update,
    remove,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 1,
    goToNextPage,
    goToPreviousPage,
  };
}
