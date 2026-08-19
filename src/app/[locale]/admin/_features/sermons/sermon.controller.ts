"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import { listCategories } from "../categories/category.service";
import type { Category } from "../categories/category.type";
import { createTheme as createThemeApi, listThemes } from "../themes/theme.service";
import type { Theme } from "../themes/theme.type";
import { createSermon, deleteSermon, listSermons, updateSermon } from "./sermon.service";
import type { SermonFormValues } from "./sermon.schema";
import type { Sermon } from "./sermon.type";

// Mesmo motivo do MIN_LOADING_MS em category.controller.ts: evita o "flash" do skeleton
// quando a API responde rápido demais pra sequer perceber o carregamento.
const MIN_LOADING_MS = 400;

export const PAGE_SIZE = 24;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useSermons() {
  const { accessToken } = useAdminAuth();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Mesmo esquema de category.controller.ts: cursor por keyset só sabe avançar, então
  // guardamos o cursor usado em cada página já visitada; o último da pilha é a página
  // atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  // Sermon, categorias (pra opção do select) e temas carregam juntos: o form sheet precisa
  // das duas listas de opções antes de abrir, então não faz sentido buscar em separado.
  const fetchPage = useCallback(async (cursor: string | null) => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      const [sermonPage, categoryPage, themeList] = await Promise.all([
        listSermons({ cursor: cursor ?? undefined, limit: PAGE_SIZE }),
        listCategories({ limit: 100 }),
        listThemes(),
      ]);
      setSermons(sermonPage.items);
      setNextCursor(sermonPage.nextCursor);
      setCategories(categoryPage.items);
      setThemes(themeList);
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
  async function create(values: SermonFormValues) {
    await createSermon(values, categories, themes, requireToken());
    // Ordenado do mais novo pro mais antigo — a prédication recém-criada sempre cai na
    // primeira página, então é pra lá que a gente volta pra ela aparecer na hora.
    setCursorHistory([null]);
    await fetchPage(null);
  }

  async function update(id: string, values: SermonFormValues) {
    await updateSermon(id, values, categories, themes, requireToken());
    await fetchPage(currentCursor);
  }

  /** Criação inline (estilo Notion) no combobox de temas do form de sermons. */
  async function createTheme(name: string) {
    const created = await createThemeApi(name, requireToken());
    setThemes((prev) => [...prev, created].sort((a, b) => a.name.fr.localeCompare(b.name.fr)));
    return created;
  }

  async function remove(id: string) {
    await deleteSermon(id, requireToken());
    // Se essa era a última prédication da última página, recua uma página em vez de
    // deixar a tela vazia com "anterior" ainda clicável pra trás.
    if (sermons.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  return {
    sermons,
    categories,
    themes,
    loading,
    loadFailed,
    create,
    update,
    remove,
    createTheme,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 1,
    goToNextPage,
    goToPreviousPage,
  };
}
