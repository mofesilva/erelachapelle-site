"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./category.service";
import type { CategoryFormValues } from "./category.schema";
import type { Category } from "./category.type";

export const PAGE_SIZE = 24;

// A API local responde rápido demais pro shimmer do skeleton dar sequer pra perceber — o
// que também seria verdade em produção numa rede boa. Garantir um tempo mínimo de loading
// evita esse "flash" e deixa o carregamento sempre parecer intencional, não quebrado.
const MIN_LOADING_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCategories() {
  const { accessToken } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cursor por keyset não "pula" pra uma página arbitrária — só sabe avançar a partir de
  // onde parou. Pra permitir voltar, guardamos o cursor usado em cada página já visitada;
  // o último da pilha é a página atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  const fetchPage = useCallback(async (cursor: string | null) => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      const page = await listCategories({ cursor: cursor ?? undefined, limit: PAGE_SIZE });
      setCategories(page.items);
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
  async function create(values: CategoryFormValues) {
    await createCategory(values, requireToken());
    // Ordenado do mais novo pro mais antigo — a categoria recém-criada sempre cai na
    // primeira página, então é pra lá que a gente volta pra ela aparecer na hora.
    setCursorHistory([null]);
    await fetchPage(null);
  }

  async function update(id: string, values: CategoryFormValues) {
    await updateCategory(id, values, requireToken());
    await fetchPage(currentCursor);
  }

  async function remove(id: string) {
    await deleteCategory(id, requireToken());
    // Se essa era a última categoria da última página, recua uma página em vez de deixar
    // a tela vazia com "anterior" ainda clicável pra trás.
    if (categories.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  return {
    categories,
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
