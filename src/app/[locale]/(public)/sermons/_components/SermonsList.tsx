"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/types/common";
import type { Sermon } from "@/types/sermon";
import { loadMoreSermons } from "../actions";
import { SermonCard } from "./SermonCard";

interface SermonsListProps {
  initialSermons: Sermon[];
  initialTotalPages: number;
  locale: Locale;
  loadMoreLabel: string;
}

/**
 * "Carregar mais" — busca o próximo lote e adiciona à lista sem navegar (sem link, sem
 * mudar a URL, sem recarregar a página). Pedido explícito: nada de paginação por número
 * de página nem link que recarrega tudo.
 */
export function SermonsList({
  initialSermons,
  initialTotalPages,
  locale,
  loadMoreLabel,
}: SermonsListProps) {
  const [sermons, setSermons] = useState(initialSermons);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const next = page + 1;
      const result = await loadMoreSermons(next);
      setSermons((prev) => [...prev, ...result.sermons]);
      setTotalPages(result.totalPages);
      setPage(next);
    });
  }

  return (
    <>
      <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sermons.map((sermon) => (
          <SermonCard key={sermon._id} sermon={sermon} locale={locale} />
        ))}
      </div>

      {page < totalPages && (
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
