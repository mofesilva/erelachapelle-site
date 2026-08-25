"use server";

import { getFilesPage } from "@/lib/data/media-assets";

export async function loadMoreFiles(cursor: string, documentType?: string) {
  return getFilesPage({ cursor, documentType });
}
