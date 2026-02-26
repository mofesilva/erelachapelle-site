import type { Sermon } from "@/types/sermon";

export const SERMONS: Sermon[] = [
  {
    _id: "sermon-1",
    title: {
      fr: "La grâce qui transforme",
      pt: "A graça que transforma",
      en: "Grace that Transforms",
    },
    description: {
      fr: "Une exploration de la grâce de Dieu et comment elle transforme nos vies au quotidien.",
      pt: "Uma exploração da graça de Deus e como ela transforma nossas vidas no dia a dia.",
      en: "An exploration of God's grace and how it transforms our daily lives.",
    },
    slug: "la-grace-qui-transforme",
    date: "2026-02-09",
    preacher: "Jean-Marc Dupont",
    series: "Les fondements de la foi",
    biblicalReference: { book: "Éphésiens", chapter: 2, verses: "8-10" },
    youtubeVideoId: "dQw4w9WgXcQ",
    tags: ["grace", "faith"],
    active: true,
    createdAt: "2026-02-09",
    updatedAt: "2026-02-09",
  },
  {
    _id: "sermon-2",
    title: {
      fr: "Marcher dans la lumière",
      pt: "Caminhar na luz",
      en: "Walking in the Light",
    },
    description: {
      fr: "Comment vivre une vie guidée par la Parole de Dieu dans un monde en constante évolution.",
      pt: "Como viver uma vida guiada pela Palavra de Deus em um mundo em constante mudança.",
      en: "How to live a life guided by God's Word in an ever-changing world.",
    },
    slug: "marcher-dans-la-lumiere",
    date: "2026-02-02",
    preacher: "Jean-Marc Dupont",
    series: "Les fondements de la foi",
    biblicalReference: { book: "1 Jean", chapter: 1, verses: "5-7" },
    youtubeVideoId: "dQw4w9WgXcQ",
    tags: ["light", "walk"],
    active: true,
    createdAt: "2026-02-02",
    updatedAt: "2026-02-02",
  },
  {
    _id: "sermon-3",
    title: {
      fr: "La prière qui change tout",
      pt: "A oração que muda tudo",
      en: "Prayer that Changes Everything",
    },
    description: {
      fr: "Découvrez la puissance de la prière et comment elle peut transformer votre relation avec Dieu.",
      pt: "Descubra o poder da oração e como ela pode transformar seu relacionamento com Deus.",
      en: "Discover the power of prayer and how it can transform your relationship with God.",
    },
    slug: "la-priere-qui-change-tout",
    date: "2026-01-26",
    preacher: "Pierre Moreau",
    biblicalReference: { book: "Jacques", chapter: 5, verses: "16" },
    youtubeVideoId: "dQw4w9WgXcQ",
    tags: ["prayer"],
    active: true,
    createdAt: "2026-01-26",
    updatedAt: "2026-01-26",
  },
  {
    _id: "sermon-4",
    title: {
      fr: "Communauté et amour fraternel",
      pt: "Comunidade e amor fraternal",
      en: "Community and Brotherly Love",
    },
    description: {
      fr: "L'importance de la communauté chrétienne et de l'amour fraternel dans notre marche de foi.",
      pt: "A importância da comunidade cristã e do amor fraternal em nossa caminhada de fé.",
      en: "The importance of Christian community and brotherly love in our walk of faith.",
    },
    slug: "communaute-et-amour-fraternel",
    date: "2026-01-19",
    preacher: "Jean-Marc Dupont",
    biblicalReference: { book: "Hébreux", chapter: 10, verses: "24-25" },
    youtubeVideoId: "dQw4w9WgXcQ",
    tags: ["community", "love"],
    active: true,
    createdAt: "2026-01-19",
    updatedAt: "2026-01-19",
  },
];

export function getRecentSermons(limit = 3): Sermon[] {
  return SERMONS.filter((s) => s.active)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getAllSermons(): Sermon[] {
  return SERMONS.filter((s) => s.active).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSermonBySlug(slug: string): Sermon | null {
  return SERMONS.find((s) => s.slug === slug && s.active) ?? null;
}

export function getSermonPreachers(): string[] {
  const preachers = new Set(SERMONS.filter((s) => s.active).map((s) => s.preacher));
  return Array.from(preachers).sort();
}

export function getSermonSeries(): string[] {
  const series = new Set(
    SERMONS.filter((s) => s.active && s.series).map((s) => s.series!)
  );
  return Array.from(series).sort();
}

export function filterSermons(filters: {
  preacher?: string;
  series?: string;
}): Sermon[] {
  return SERMONS.filter((s) => {
    if (!s.active) return false;
    if (filters.preacher && s.preacher !== filters.preacher) return false;
    if (filters.series && s.series !== filters.series) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
