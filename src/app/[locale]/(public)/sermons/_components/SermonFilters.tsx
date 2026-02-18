"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

interface SermonFiltersProps {
  preachers: string[];
  seriesList: string[];
}

export function SermonFilters({ preachers, seriesList }: SermonFiltersProps) {
  const t = useTranslations("sermons");
  const tCommon = useTranslations("common");
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
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={activePreacher}
        onChange={(e) => updateFilter("preacher", e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        aria-label={t("filterByPreacher")}
      >
        <option value="">{t("filterByPreacher")}</option>
        {preachers.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {seriesList.length > 0 && (
        <select
          value={activeSeries}
          onChange={(e) => updateFilter("series", e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          aria-label={t("filterBySeries")}
        >
          <option value="">{t("filterBySeries")}</option>
          {seriesList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {tCommon("all")}
        </Button>
      )}
    </div>
  );
}
