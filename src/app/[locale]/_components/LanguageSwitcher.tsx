"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/types/common";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  pt: "PT",
  en: "EN",
};

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "light" }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(localeLabels) as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`cursor-pointer px-2 py-1 text-sm font-medium transition-colors ${loc === locale
              ? isLight ? "text-white" : "text-primary"
              : isLight ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          aria-label={`Switch to ${loc}`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
