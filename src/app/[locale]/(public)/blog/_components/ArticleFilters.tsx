"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/_components/ui/button";

interface ArticleFiltersProps {
  categories: string[];
}

export function ArticleFilters({ categories }: ArticleFiltersProps) {
  const t = useTranslations("blog");
  const tCategories = useTranslations("blog.categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";

  function updateFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/${locale}/blog?${params.toString()}`);
  }

  function clearFilters() {
    router.push(`/${locale}/blog`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={activeCategory}
        onChange={(e) => updateFilter(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        aria-label={t("filterByCategory")}
      >
        <option value="">{t("filterByCategory")}</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {tCategories(cat)}
          </option>
        ))}
      </select>

      {activeCategory && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {tCommon("all")}
        </Button>
      )}
    </div>
  );
}
