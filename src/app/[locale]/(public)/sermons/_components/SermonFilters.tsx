"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface SermonFiltersProps {
  preachers: string[];
  seriesList: string[];
}

export function SermonFilters({ preachers, seriesList }: SermonFiltersProps) {
  const t = useTranslations("sermons");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activePreacher = searchParams.get("preacher") ?? "";
  const activeSeries = searchParams.get("series") ?? "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/sermons?${params.toString()}`);
  }

  function clearFilters() {
    router.push(`/${locale}/sermons`);
  }

  const hasFilters = activePreacher || activeSeries;

  return (
    <div className="space-y-5">
      {/* Preachers */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="mr-1 font-bold uppercase tracking-[0.15em] text-toffee-brown">
          {t("filterByPreacher")}
        </p>
        {preachers.map((p) => (
          <button
            key={p}
            onClick={() =>
              updateFilter("preacher", activePreacher === p ? "" : p)
            }
            className={cn(
              "border px-4 py-1.5 text-sm transition-all duration-200",
              activePreacher === p
                ? "border-night-bordeaux-2 bg-night-bordeaux-2 text-parchment"
                : "border-dust-grey bg-white text-coffee-bean hover:border-toffee-brown/50 hover:text-night-bordeaux-2"
            )}
          >
            {p}
          </button>
        ))}
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
