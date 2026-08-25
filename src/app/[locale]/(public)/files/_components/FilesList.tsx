"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types/common";
import type { MediaAsset } from "@/types/media-asset";
import { loadMoreFiles } from "../actions";
import { FileCard } from "./FileCard";

interface FilesListProps {
  initialFiles: MediaAsset[];
  initialNextCursor: string | null;
  locale: Locale;
  documentType?: string;
  loadMoreLabel: string;
}

/** Mesmo padrão de "carregar mais" das prédications/podcast, mas por cursor (a API de
 * media-assets já pagina de verdade — não precisa buscar tudo e paginar em memória). */
export function FilesList({
  initialFiles,
  initialNextCursor,
  locale,
  documentType,
  loadMoreLabel,
}: FilesListProps) {
  const t = useTranslations("files");
  const [files, setFiles] = useState(initialFiles);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    if (!nextCursor) return;
    startTransition(async () => {
      const result = await loadMoreFiles(nextCursor, documentType);
      setFiles((prev) => [...prev, ...result.files]);
      setNextCursor(result.nextCursor);
    });
  }

  return (
    <>
      <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            locale={locale}
            documentTypeLabel={file.documentType ? t(`documentTypes.${file.documentType}`) : undefined}
          />
        ))}
      </div>

      {nextCursor && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="cursor-pointer border border-night-bordeaux-2/30 px-6 py-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-night-bordeaux-2 transition-colors duration-200 hover:border-night-bordeaux-2 hover:bg-night-bordeaux-2 hover:text-parchment disabled:cursor-wait disabled:opacity-50"
          >
            {isPending ? "…" : loadMoreLabel}
          </button>
        </div>
      )}
    </>
  );
}
