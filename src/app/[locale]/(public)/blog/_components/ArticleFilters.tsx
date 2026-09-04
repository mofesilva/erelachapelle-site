"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { MagniferLinear } from "solar-icon-set";

/** Sem filtro por categoria — a lista é aberta e cresce, não faz sentido como filtro
 * de UI. Só busca por texto, com debounce. */
export function ArticleFilters() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(activeQuery);

  // Mantém o campo em sincronia se o usuário navegar (voltar/avançar) mudando a URL.
  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  // Debounce: evita disparar uma navegação a cada tecla digitada.
  useEffect(() => {
    if (query === activeQuery) return;
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      router.push(`/${locale}/blog?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="space-y-3">
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

      {activeQuery && (
        <button
          onClick={() => {
            setQuery("");
            router.push(`/${locale}/blog`, { scroll: false });
          }}
          className="cursor-pointer text-[0.8125rem] text-toffee-brown underline underline-offset-2 transition-colors hover:text-night-bordeaux-2"
        >
          {t("clearFilters")}
        </button>
      )}
    </div>
  );
}
