"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface ArticleFiltersProps {
  categories: { value: string; label: string }[];
}

export function ArticleFilters({ categories }: ArticleFiltersProps) {
  const t = useTranslations("blog");
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="mr-1 font-bold uppercase tracking-[0.15em] text-toffee-brown">
          {t("filterByCategory")}
        </p>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilter(activeCategory === cat.value ? "" : cat.value)}
            className={cn(
              "cursor-pointer border px-4 py-1.5 text-sm transition-all duration-200",
              activeCategory === cat.value
                ? "border-night-bordeaux-2 bg-night-bordeaux-2 text-parchment"
                : "border-dust-grey bg-white text-coffee-bean hover:border-toffee-brown/50 hover:text-night-bordeaux-2"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="text-center">
          <button
            onClick={() => router.push(`/${locale}/blog`)}
            className="cursor-pointer text-sm text-toffee-brown underline underline-offset-2 transition-colors hover:text-night-bordeaux-2"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
