import type { Locale } from "@/types/common";

export const DEFAULT_LOCALE: Locale = "fr";

export const SITE_CONFIG = {
  name: "Église Réformée Évangélique La Chapelle",
  description: "Église Réformée Évangélique La Chapelle",
  url: "https://erelachapelle.org",
  locations: ["Saint-Hippolyte"] as const,
  socialMedia: {
    facebook: "https://www.facebook.com/erelachapelle/",
    instagram: "https://www.instagram.com/erelachapelle",
    youtube: "https://www.youtube.com/@erelachapelle/featured",
  },
} as const;
