import type { BlogArticle } from "./model";
import { blogCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getBlogArticles(): Promise<BlogArticle[]> {
    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).find({
        query: { active: true, published: true },
        sort: { publishedAt: -1 },
    });
    return snap.documents ?? [];
}

export async function getRecentArticles(limit = 3): Promise<BlogArticle[]> {
    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).find({
        query: { active: true, published: true },
        sort: { publishedAt: -1 },
        limit,
    });
    return snap.documents ?? [];
}

export async function getAllArticles(): Promise<BlogArticle[]> {
    return getBlogArticles();
}

export async function getArticleBySlug(
    slug: string
): Promise<BlogArticle | null> {
    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).findOne({
        query: { slug, active: true, published: true },
    });
    return snap.document ?? null;
}

export async function filterArticles(filters: {
    category?: string;
}): Promise<BlogArticle[]> {
    const query: Record<string, unknown> = { active: true, published: true };
    if (filters.category) query.categories = filters.category;

    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).find({
        query,
        sort: { publishedAt: -1 },
    });
    return snap.documents ?? [];
}

export async function getArticleCategories(): Promise<string[]> {
    const articles = await getBlogArticles();
    const categories = new Set(articles.flatMap((a) => a.categories));
    return Array.from(categories).sort();
}

export async function createArticle(data: Partial<BlogArticle>): Promise<BlogArticle | null> {
    const { apiClient } = await getServerClient();
    const now = new Date().toISOString();
    const snap = await blogCollection(apiClient).insertOne({
        ...data,
        active: true,
        published: false,
        createdAt: now,
        updatedAt: now,
    });
    return snap.document ?? null;
}

export async function updateArticle(id: string, data: Partial<BlogArticle>): Promise<BlogArticle | null> {
    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).updateOne(id, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
    return snap.document ?? null;
}

export async function deleteArticle(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await blogCollection(apiClient).updateOne(id, {
        active: false,
        updatedAt: new Date().toISOString(),
    });
    return !snap.error;
}
