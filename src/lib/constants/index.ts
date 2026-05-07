import type { Locale } from "@/types/common";

export const DEFAULT_LOCALE: Locale = "fr";

export const SITE_CONFIG = {
  name: "Église Réformée Évangélique La Chapelle",
  description: "Rassemblés autour de la Parole de Dieu",
  url: "https://erelachapelle.org",
  locations: ["Saint-Hippolyte"] as const,
  socialMedia: {
    facebook: "https://www.facebook.com/erelachapelle/",
    instagram: "https://www.instagram.com/erelachapelle",
    tiktok: "https://www.tiktok.com/@erelachapelle",
    youtube: "https://www.youtube.com/@erelachapelle/featured",
  },
} as const;
