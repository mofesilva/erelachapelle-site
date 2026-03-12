import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { BlogArticle } from "./model";

export const BLOG_COLLECTION = "blog";

export function blogCollection(apiClient: ApiClient) {
    return new Collection<BlogArticle>({ apiClient, name: BLOG_COLLECTION });
}
