import type { Locale } from "@/types/common";

export const LOCALES: Locale[] = ["fr", "pt", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export const SITE_CONFIG = {
  name: "Église Réformée Évangélique La Chapelle",
  description: "Igreja Cévennes - Communauté chrétienne",
  url: "https://erelachapelle.org",
  locations: ["Saint-Hippolyte"] as const,
} as const;

export { EVENT_TYPES } from "@/types/event";
export { GROUP_TYPES, DAYS_OF_WEEK } from "@/types/group";
