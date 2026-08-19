"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import { deleteMediaAsset, listMediaAssets, uploadMediaAsset } from "./media-asset.service";
import type { FILE_TYPES, MediaAsset } from "./media-asset.type";

export const PAGE_SIZE = 24;

// A API local responde rápido demais pro shimmer do skeleton dar sequer pra perceber — o
// que também seria verdade em produção numa rede boa. Garantir um tempo mínimo de loading
// evita esse "flash" e deixa o carregamento sempre parecer intencional, não quebrado.
const MIN_LOADING_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FileType = (typeof FILE_TYPES)[number];

export type UploadStatus = "pending" | "uploading" | "success" | "error";

export type UploadItem = {
  id: string;
  file: File;
  status: UploadStatus;
  error?: string;
};

export function useMediaAssets() {
  const { accessToken } = useAdminAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const [fileType, setFileType] = useState<FileType | null>(null);

  // Cursor por keyset não "pula" pra uma página arbitrária — só sabe avançar a partir de
  // onde parou. Pra permitir voltar, guardamos o cursor usado em cada página já visitada;
  // o último da pilha é a página atual, e "voltar" só descarta o topo e busca de novo.
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  const fetchPage = useCallback(
    async (cursor: string | null) => {
      setLoading(true);
      setLoadFailed(false);
      const startedAt = Date.now();
      try {
        const page = await listMediaAssets({
          cursor: cursor ?? undefined,
          limit: PAGE_SIZE,
          fileType: fileType ?? undefined,
        });
        setAssets(page.items);
        setNextCursor(page.nextCursor);
      } catch {
        setLoadFailed(true);
      } finally {
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed);
        setLoading(false);
      }
    },
    [fileType]
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

  // Mudar o filtro é como criar um item novo: a lista muda por completo, então volta
  // sempre pra primeira página em vez de tentar manter um cursor que não faz mais sentido.
  function setFilters(next: { fileType?: FileType | null }) {
    if ("fileType" in next) setFileType(next.fileType ?? null);
    setCursorHistory([null]);
  }

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  async function uploadFiles(files: File[]) {
    const token = requireToken();
    const items: UploadItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      status: "pending",
    }));
    setUploads((prev) => [...prev, ...items]);

    for (const item of items) {
      setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: "uploading" } : u)));
      try {
        const title = item.file.name.replace(/\.[^./]+$/, "");
        await uploadMediaAsset(item.file, token, title);
        setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: "success" } : u)));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: "error", error: message } : u)));
      }
    }

    // Arquivo recém-enviado cai no topo (ordenado mais recente → mais antigo) — volta
    // pra primeira página pra ele aparecer na hora.
    setCursorHistory([null]);
    await fetchPage(null);
  }

  function dismissUpload(id: string) {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }

  async function remove(id: string) {
    await deleteMediaAsset(id, requireToken());
    // Se esse era o último asset da última página, recua uma página em vez de deixar
    // a tela vazia com "anterior" ainda clicável pra trás.
    if (assets.length === 1 && cursorHistory.length > 1) {
      goToPreviousPage();
    } else {
      await fetchPage(currentCursor);
    }
  }

  return {
    assets,
    loading,
    loadFailed,
    uploads,
    uploadFiles,
    dismissUpload,
    remove,
    fileType,
    setFilters,
    hasNextPage: nextCursor !== null,
    hasPreviousPage: cursorHistory.length > 1,
    goToNextPage,
    goToPreviousPage,
  };
}
