"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { DOCUMENT_TYPES } from "@/types/media-asset";
import { cn } from "@/lib/utils";

export function FileFilters() {
  const t = useTranslations("files");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("documentType") ?? "";

  function updateFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("documentType", value);
    } else {
      params.delete("documentType");
    }
    router.push(`/${locale}/files?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="mr-1 font-bold uppercase tracking-[0.15em] text-toffee-brown">
          {t("filterByType")}
        </p>
        {DOCUMENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => updateFilter(activeType === type ? "" : type)}
            className={cn(
              "cursor-pointer border px-4 py-1.5 text-sm transition-all duration-200",
              activeType === type
                ? "border-night-bordeaux-2 bg-night-bordeaux-2 text-parchment"
                : "border-dust-grey bg-white text-coffee-bean hover:border-toffee-brown/50 hover:text-night-bordeaux-2"
            )}
          >
            {t(`documentTypes.${type}`)}
          </button>
        ))}
      </div>

      {activeType && (
        <div className="text-center">
          <button
            onClick={() => updateFilter("")}
            className="cursor-pointer text-sm text-toffee-brown underline underline-offset-2 transition-colors hover:text-night-bordeaux-2"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
