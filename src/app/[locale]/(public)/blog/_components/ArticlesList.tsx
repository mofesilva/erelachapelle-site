"use client";

import { useState, useTransition } from "react";
import { getPeekProps } from "@/_components/PeekRectangle";
import type { Locale } from "@/types/common";
import type { Post } from "@/types/blog";
import { loadMoreArticles } from "../actions";
import { ArticleCard } from "./ArticleCard";

interface ArticlesListProps {
  initialArticles: Post[];
  initialTotalPages: number;
  locale: Locale;
  readMoreLabel: string;
  loadMoreLabel: string;
}

/** Mesmo padrão de "carregar mais" das prédications e do podcast — sem link, sem reload. */
export function ArticlesList({
  initialArticles,
  initialTotalPages,
  locale,
  readMoreLabel,
  loadMoreLabel,
}: ArticlesListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const next = page + 1;
      const result = await loadMoreArticles(next);
      setArticles((prev) => [...prev, ...result.articles]);
      setTotalPages(result.totalPages);
      setPage(next);
    });
  }

  return (
    <>
      <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => {
          const peek = getPeekProps(index);
          return (
            <ArticleCard
              key={article._id}
              article={article}
              locale={locale}
              readMoreLabel={readMoreLabel}
              peekColor={peek.color}
              peekPosition={peek.position}
            />
          );
        })}
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
