"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

interface EventFiltersProps {
  eventTypes: string[];
  locations: { id: string; name: string }[];
}

export function EventFilters({ eventTypes, locations }: EventFiltersProps) {
  const t = useTranslations("events");
  const tTypes = useTranslations("events.types");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") ?? "";
  const activeLocation = searchParams.get("location") ?? "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/events?${params.toString()}`);
  }

  function clearFilters() {
    router.push(`/${locale}/events`);
  }

  const hasFilters = activeType || activeLocation;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={activeType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        aria-label={t("filterByType")}
      >
        <option value="">{t("filterByType")}</option>
        {eventTypes.map((type) => (
          <option key={type} value={type}>
            {tTypes(type)}
          </option>
        ))}
      </select>

      <select
        value={activeLocation}
        onChange={(e) => updateFilter("location", e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        aria-label={t("filterByLocation")}
      >
        <option value="">{t("filterByLocation")}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {tCommon("all")}
        </Button>
      )}
    </div>
  );
}
