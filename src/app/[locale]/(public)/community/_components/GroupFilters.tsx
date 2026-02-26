"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/_components/ui/button";

interface GroupFiltersProps {
  groupTypes: string[];
}

export function GroupFilters({ groupTypes }: GroupFiltersProps) {
  const t = useTranslations("community.groups");
  const tTypes = useTranslations("community.groups.types");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") ?? "";

  function updateFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(`/${locale}/community/groups?${params.toString()}`);
  }

  function clearFilters() {
    router.push(`/${locale}/community/groups`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={activeType}
        onChange={(e) => updateFilter(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        aria-label={t("filterByType")}
      >
        <option value="">{t("filterByType")}</option>
        {groupTypes.map((type) => (
          <option key={type} value={type}>
            {tTypes(type)}
          </option>
        ))}
      </select>

      {activeType && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {tCommon("all")}
        </Button>
      )}
    </div>
  );
}
