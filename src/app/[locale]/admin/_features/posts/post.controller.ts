"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import { listCategories } from "../categories/category.service";
import type { Category } from "../categories/category.type";
import { createTheme as createThemeApi, listThemes } from "../themes/theme.service";
import type { Theme } from "../themes/theme.type";
import { createPost, deletePost, getPost, listPosts, patchPost, updatePost } from "./post.service";
import type { PostFormValues } from "./post.schema";
import type { Post } from "./post.type";

// Mesmo motivo do MIN_LOADING_MS em category.controller.ts: evita o "flash" do skeleton
// quando a API responde rápido demais pra sequer perceber o carregamento.
const MIN_LOADING_MS = 400;

export const PAGE_SIZE = 24;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePosts() {
  const { accessToken } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Mesmo esquema de category.controller.ts: cursor por keyset só sabe avançar, então
  // guardamos o cursor usado em cada página já visitada; o último da pilha é a página
  // atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  const fetchPage = useCallback(
    async (cursor: string | null) => {
      setLoading(true);
      setLoadFailed(false);
      const startedAt = Date.now();
      try {
        const page = await listPosts({ cursor: cursor ?? undefined, limit: PAGE_SIZE }, requireToken());
        setPosts(page.items);
        setNextCursor(page.nextCursor);
      } catch {
        setLoadFailed(true);
      } finally {
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed);
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken]
  );

  useEffect(() => {
    fetchPage(currentCursor);
  }, [currentCursor, fetchPage]);

  function goToNextPage() {
    if (nextCursor) setCursorHistory((history) => [...history, nextCursor]);
  }

  function goToPreviousPage() {
    setCursorHistory((history) => (history.length > 1 ? history.slice(0, -1) : history));
  }

  async function remove(id: string) {
    await deletePost(id, requireToken());
    if (posts.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  // Atualização otimista sem refetch: reverte se a chamada falhar. Só manda `published` —
  // `publishedAt` já definido no post continua valendo pro cálculo de status (agendado vs
  // publicado).
  async function togglePublish(target: Post) {
    const next = !target.published;
    setPosts((prev) => prev.map((p) => (p._id === target._id ? { ...p, published: next } : p)));
    try {
      await patchPost(target._id, { published: next }, requireToken());
    } catch (err) {
      setPosts((prev) => prev.map((p) => (p._id === target._id ? { ...p, published: target.published } : p)));
      throw err;
    }
  }

  return {
    posts,
    loading,
    loadFailed,
    remove,
    togglePublish,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 1,
    goToNextPage,
    goToPreviousPage,
  };
}

/** Carrega as opções de categoria/tema pro editor — mesma necessidade de sermon.controller.ts. */
export function usePostTaxonomies() {
  const { accessToken } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [categoryPage, themeList] = await Promise.all([listCategories({ limit: 100 }), listThemes()]);
        if (cancelled) return;
        setCategories(categoryPage.items);
        setThemes(themeList);
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Criação inline (estilo Notion) no combobox de temas do editor de posts. */
  async function createTheme(name: string) {
    if (!accessToken) throw new Error("Sessão ausente");
    const created = await createThemeApi(name, accessToken);
    setThemes((prev) => [...prev, created].sort((a, b) => a.name.fr.localeCompare(b.name.fr)));
    return created;
  }

  return { categories, setCategories, themes, setThemes, createTheme, loading, loadFailed };
}

/**
 * Estado da tela de editor full-page. `id` ausente = criação (`mode="create"` em PostEditor);
 * presente = carrega o post existente pra edição/autosave.
 */
export function usePostEditor(id?: string) {
  const { accessToken } = useAdminAuth();
  const taxonomies = usePostTaxonomies();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadFailed, setLoadFailed] = useState(false);

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadFailed(false);
      try {
        const loaded = await getPost(id, requireToken());
        if (!cancelled) setPost(loaded);
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);

  /** Cria o post (primeiro save manual) — devolve o documento criado pra navegar pro `_id`. */
  async function create(values: PostFormValues) {
    const created = await createPost(values, taxonomies.categories, taxonomies.themes, requireToken());
    setPost(created);
    return created;
  }

  /** Save manual completo (botão "Salvar rascunho"/"Publicar"). */
  async function save(values: PostFormValues) {
    if (!post) throw new Error("Post ainda não criado");
    const updated = await updatePost(post._id, values, taxonomies.categories, taxonomies.themes, requireToken());
    setPost(updated);
    return updated;
  }

  /** Autosave debounced: só os campos tocados, sem reconstruir o post inteiro. */
  async function autosave(patch: Parameters<typeof patchPost>[1]) {
    if (!post) return;
    const updated = await patchPost(post._id, patch, requireToken());
    setPost(updated);
  }

  return {
    post,
    loading: loading || taxonomies.loading,
    loadFailed: loadFailed || taxonomies.loadFailed,
    categories: taxonomies.categories,
    themes: taxonomies.themes,
    setThemes: taxonomies.setThemes,
    createTheme: taxonomies.createTheme,
    create,
    save,
    autosave,
  };
}
