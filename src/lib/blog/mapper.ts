import type { BlogArticle } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapArticle(raw: Record<string, unknown>): BlogArticle {
  return mapKeysSnakeToCamel<BlogArticle>(raw);
}

export function mapArticles(raw: Record<string, unknown>[]): BlogArticle[] {
  return raw.map(mapArticle);
}

export function mapArticleToDb(article: Partial<BlogArticle>): Record<string, unknown> {
  return mapKeysCamelToSnake(article) as Record<string, unknown>;
}
