import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { FileTextBoldDuotone } from "solar-icon-set";
import { getFilesPage } from "@/lib/data/media-assets";
import type { Locale } from "@/types/common";
import type { DOCUMENT_TYPES } from "@/types/media-asset";
import { FileFilters } from "./_components/FileFilters";
import { FilesList } from "./_components/FilesList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("files");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ documentType?: string }>;
};

export default async function FilesPage({ searchParams }: PageProps) {
  const t = await getTranslations("files");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const documentType = params.documentType as (typeof DOCUMENT_TYPES)[number] | undefined;
  const { files, nextCursor } = await getFilesPage({ documentType });

  return (
    <main>
      <section className="bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-serif text-[1.75rem] font-bold text-parchment md:text-[2.5rem]">
            {t("title")}
          </h1>
          <p className="mt-3 text-parchment/70">{t("heroSubtitle")}</p>
        </div>
      </section>

      <section className="bg-powder-petal py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3">
            <FileTextBoldDuotone size={18} color="var(--night-bordeaux-2)" />
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
              {t("allFiles")}
            </p>
            <span className="h-px flex-1 bg-night-bordeaux-2/15" />
          </div>

          <div className="mt-8">
            <Suspense fallback={null}>
              <FileFilters />
            </Suspense>
          </div>

          {files.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noFiles")}
            </p>
          ) : (
            <FilesList
              initialFiles={files}
              initialNextCursor={nextCursor}
              locale={locale}
              documentType={documentType}
              loadMoreLabel={t("loadMore")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
