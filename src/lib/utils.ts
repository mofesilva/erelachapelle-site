import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import type { Locale, MultilingualText } from "@/types/common";

// `text-h1`…`text-h6` são utilitárias nossas (globals.css). Sem declarar isso, o tailwind-merge
// não reconhece o sufixo como tamanho e chuta que são cor de texto — aí `text-h6 text-carbon-black`
// vira só `text-carbon-black`, o tamanho some e o elemento volta pro tamanho da tag (um <h2> do
// Radix reaparece na escala de hero do site).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-h1", "text-h2", "text-h3", "text-h4", "text-h5", "text-h6"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateLocales = { fr, pt, en: enUS } as const;

export function formatDate(dateStr: string, locale: Locale = "fr"): string {
  return format(parseISO(dateStr), "d MMMM yyyy", {
    locale: dateLocales[locale],
  });
}

export function formatDateTime(
  dateStr: string,
  locale: Locale = "fr"
): string {
  return format(parseISO(dateStr), "d MMMM yyyy 'à' HH:mm", {
    locale: dateLocales[locale],
  });
}

export function getLocalizedContent(
  content: MultilingualText,
  locale: Locale
): string {
  return content[locale] || content.fr;
}

// A API exige `slug` no corpo e não gera nada — quem cria o registro no backoffice
// é que deriva do nome (minúsculas, sem acento, espaços viram hífen).
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
