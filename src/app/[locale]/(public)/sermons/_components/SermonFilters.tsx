"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { MagniferLinear } from "solar-icon-set";
import { cn } from "@/lib/utils";

interface SermonFiltersProps {
  seriesList: string[];
}

export function SermonFilters({ seriesList }: SermonFiltersProps) {
  const t = useTranslations("sermons");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSeries = searchParams.get("series") ?? "";
  const activeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(activeQuery);

  // Mantém o campo em sincronia se o usuário navegar (voltar/avançar) mudando a URL.
  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/sermons?${params.toString()}`, { scroll: false });
  }

  // Debounce: evita disparar uma navegação a cada tecla digitada.
  useEffect(() => {
    if (query === activeQuery) return;
    const timeout = setTimeout(() => updateFilter("q", query), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function clearFilters() {
    setQuery("");
    router.push(`/${locale}/sermons`, { scroll: false });
  }

  const hasFilters = activeSeries || activeQuery;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative sm:w-72">
        <MagniferLinear
          size={16}
          color="var(--toffee-brown)"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full border border-dust-grey bg-white py-2 pl-9 pr-3 text-[0.875rem] text-coffee-bean placeholder:text-coffee-bean/40 outline-none transition-colors duration-200 focus:border-toffee-brown"
        />
      </div>

      {/* Series */}
      {seriesList.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <p className="mr-1 font-bold uppercase tracking-[0.15em] text-toffee-brown">
            {t("filterBySeries")}
          </p>
          {seriesList.map((s) => (
            <button
              key={s}
              onClick={() =>
                updateFilter("series", activeSeries === s ? "" : s)
              }
              className={cn(
                "border px-4 py-1.5 text-sm transition-all duration-200",
                activeSeries === s
                  ? "border-night-bordeaux-2 bg-night-bordeaux-2 text-parchment"
                  : "border-dust-grey bg-white text-coffee-bean hover:border-toffee-brown/50 hover:text-night-bordeaux-2"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <div className="text-center">
          <button
            onClick={clearFilters}
            className="text-sm text-toffee-brown underline underline-offset-2 transition-colors hover:text-night-bordeaux-2"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
