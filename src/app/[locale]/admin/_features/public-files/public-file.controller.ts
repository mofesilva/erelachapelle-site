"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import { createPublicFile, deletePublicFile, listPublicFiles, updatePublicFile } from "./public-file.service";
import type { PublicFileFormValues } from "./public-file.schema";
import type { PublicFile } from "./public-file.type";

// Mesmo motivo do MIN_LOADING_MS em podcast.controller.ts: evita o "flash" do skeleton
// quando a API responde rápido demais pra sequer perceber o carregamento.
const MIN_LOADING_MS = 400;

export const PAGE_SIZE = 24;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePublicFiles() {
  const { accessToken } = useAdminAuth();
  const [files, setFiles] = useState<PublicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Mesmo esquema de podcast.controller.ts: cursor por keyset só sabe avançar, então
  // guardamos o cursor usado em cada página já visitada; o último da pilha é a página
  // atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  const fetchPage = useCallback(async (cursor: string | null) => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      const page = await listPublicFiles({ cursor: cursor ?? undefined, limit: PAGE_SIZE });
      setFiles(page.items);
      setNextCursor(page.nextCursor);
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
  async function create(values: PublicFileFormValues) {
    await createPublicFile(values, requireToken());
    // Ordenado do mais novo pro mais antigo — o arquivo recém-criado sempre cai na
    // primeira página, então é pra lá que a gente volta pra ele aparecer na hora.
    setCursorHistory([null]);
    await fetchPage(null);
  }

  async function update(id: string, values: PublicFileFormValues) {
    await updatePublicFile(id, values, requireToken());
    await fetchPage(currentCursor);
  }

  async function remove(id: string) {
    await deletePublicFile(id, requireToken());
    // Se esse era o último arquivo da última página, recua uma página em vez de
    // deixar a tela vazia com "anterior" ainda clicável pra trás.
    if (files.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  return {
    files,
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
