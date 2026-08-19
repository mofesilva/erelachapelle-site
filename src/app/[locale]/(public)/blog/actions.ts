"use server";

import { getPostsPage } from "@/lib/data/blog";

export async function loadMoreArticles(page: number) {
  return getPostsPage(page);
}
