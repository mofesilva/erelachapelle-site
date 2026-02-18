import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import type { Locale, MultilingualText } from "@/types/common";

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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
