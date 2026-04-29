import type { BlogArticle } from "@/types/blog";

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    _id: "article-1",
    title: {
      fr: "Retour sur notre retraite spirituelle",
      pt: "Retrospectiva do nosso retiro espiritual",
      en: "Looking Back at Our Spiritual Retreat",
    },
    excerpt: {
      fr: "Un week-end ressourçant, riche en partage et en communion fraternelle.",
      pt: "Um fim de semana revigorante, rico em partilha e comunhão fraternal.",
      en: "A refreshing weekend, rich in sharing and fellowship.",
    },
    content: {
      fr: "Notre retraite annuelle s'est déroulée dans un magnifique cadre naturel. Les participants ont pu se ressourcer spirituellement à travers des temps de prière, de louange et d'enseignement. Un moment fort de communion fraternelle qui a renforcé les liens de notre communauté.",
      pt: "Nosso retiro anual aconteceu em um cenário natural magnífico. Os participantes puderam se renovar espiritualmente através de tempos de oração, louvor e ensino. Um momento forte de comunhão fraternal que fortaleceu os laços da nossa comunidade.",
      en: "Our annual retreat took place in a magnificent natural setting. Participants were able to renew spiritually through times of prayer, worship and teaching. A strong moment of fellowship that strengthened our community bonds.",
    },
    slug: "retour-retraite-spirituelle",
    author: "Jean-Marc Dupont",
    categories: ["community"],
    tags: ["retreat", "community"],
    publishedAt: "2026-02-05",
    published: true,
    active: true,
    createdAt: "2026-02-05",
    updatedAt: "2026-02-05",
  },
  {
    _id: "article-3",
    title: {
      fr: "Méditation : La fidélité de Dieu",
      pt: "Meditação: A fidelidade de Deus",
      en: "Meditation: God's Faithfulness",
    },
    excerpt: {
      fr: "Une réflexion sur la fidélité constante de Dieu à travers les saisons de la vie.",
      pt: "Uma reflexão sobre a fidelidade constante de Deus através das estações da vida.",
      en: "A reflection on God's constant faithfulness through life's seasons.",
    },
    content: {
      fr: "Dans les moments de joie comme dans les épreuves, la fidélité de Dieu demeure inébranlable. Cette méditation nous invite à nous souvenir des promesses de Dieu et à renouveler notre confiance en Lui.",
      pt: "Nos momentos de alegria como nas provações, a fidelidade de Deus permanece inabalável. Esta meditação nos convida a lembrar das promessas de Deus e a renovar nossa confiança Nele.",
      en: "In times of joy as in trials, God's faithfulness remains unshakeable. This meditation invites us to remember God's promises and renew our trust in Him.",
    },
    slug: "meditation-fidelite-de-dieu",
    author: "Jean-Marc Dupont",
    categories: ["devotional"],
    tags: ["meditation", "faithfulness"],
    publishedAt: "2026-01-20",
    published: true,
    active: true,
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20",
  },
];

export function getRecentArticles(limit = 3): BlogArticle[] {
  return BLOG_ARTICLES.filter((a) => a.active && a.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getAllArticles(): BlogArticle[] {
  return BLOG_ARTICLES.filter((a) => a.active && a.published).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): BlogArticle | null {
  return (
    BLOG_ARTICLES.find((a) => a.slug === slug && a.active && a.published) ??
    null
  );
}

export function getArticleCategories(): string[] {
  const cats = new Set(
    BLOG_ARTICLES.filter((a) => a.active && a.published).flatMap(
      (a) => a.categories
    )
  );
  return Array.from(cats).sort();
}

export function filterArticles(filters: {
  category?: string;
}): BlogArticle[] {
  return BLOG_ARTICLES.filter((a) => {
    if (!a.active || !a.published) return false;
    if (filters.category && !a.categories.includes(filters.category))
      return false;
    return true;
  }).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
