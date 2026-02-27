import type { MetadataRoute } from "next";
import { getAllSermons } from "@/lib/data/sermons";
import { getAllEvents } from "@/lib/data/events";
import { getAllArticles } from "@/lib/data/blog";

const BASE_URL = "https://erelachapelle.fr";
const LOCALES = ["fr", "pt", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/sermons", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/events", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  for (const page of staticPages) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Sermon detail pages
  for (const sermon of getAllSermons()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/sermons/${sermon.slug}`,
        lastModified: new Date(sermon.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Event detail pages
  for (const event of getAllEvents()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Blog article detail pages
  for (const article of getAllArticles()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
