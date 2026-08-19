"use server";

import { getSermonsPage } from "@/lib/data/sermons";

export async function loadMoreSermons(page: number) {
  return getSermonsPage(page);
}
