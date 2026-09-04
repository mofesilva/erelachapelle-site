import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { BackLink } from "@/_components/BackLink";
import { getFilesPage } from "@/lib/data/media-assets";
import type { Locale } from "@/types/common";
import { DOCUMENT_TYPES, type MediaAsset } from "@/types/media-asset";
import { FileTypeSection, ZONE_ICON, ZONE_COLOR } from "./_components/FileTypeSection";
import { FilesList } from "./_components/FilesList";

// Quantos itens aparecem no carrossel de cada zona do hub — "ver tudo" no cabeçalho da
// zona (`?documentType=`) é quem dá acesso ao restante, sem limite.
const ZONE_PREVIEW_SIZE = 7;

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

function isDocumentType(value: string | undefined): value is (typeof DOCUMENT_TYPES)[number] {
  return !!value && (DOCUMENT_TYPES as readonly string[]).includes(value);
}

export default async function FilesPage({ searchParams }: PageProps) {
  const t = await getTranslations("files");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const singleType = isDocumentType(params.documentType) ? params.documentType : null;

  const singleTypeResult = singleType ? await getFilesPage({ documentType: singleType }) : null;
  const zonesByType: { type: (typeof DOCUMENT_TYPES)[number]; files: MediaAsset[] }[] | null =
    singleType
      ? null
      : await Promise.all(
          DOCUMENT_TYPES.map(async (type) => ({
            type,
            files: (await getFilesPage({ documentType: type })).files.slice(0, ZONE_PREVIEW_SIZE),
          }))
        );

  return (
    <main className="flex flex-1 flex-col">
      {/* Mesmo tratamento do hero de /gallery: min-h 50%, foto do interior da igreja de
          fundo + overlay bordeaux, título centralizado no tamanho padrão de h1 — sem
          destaque (não há um "arquivo em destaque" equivalente ao FeaturedSermon). */}
      <section className="relative flex min-h-[50svh] flex-col justify-center bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src="/images/inside-church.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif font-bold text-parchment">{t("title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-parchment/75">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      <section className="flex flex-1 flex-col bg-parchment py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          {singleType ? (
            <div>
              <BackLink href={`/${locale}/files`}>{t("backToFiles")}</BackLink>

              <div className="mt-6 flex items-center gap-3">
                {(() => {
                  const Icon = ZONE_ICON[singleType];
                  return <Icon size={18} color={ZONE_COLOR[singleType]} />;
                })()}
                <p
                  className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em]"
                  style={{ color: ZONE_COLOR[singleType] }}
                >
                  {t(`documentTypes.${singleType}`)}
                </p>
                <span className="h-px flex-1 bg-night-bordeaux-2/15" />
              </div>

              {singleTypeResult!.files.length === 0 ? (
                <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
                  {t("noFiles")}
                </p>
              ) : (
                <FilesList
                  initialFiles={singleTypeResult!.files}
                  initialNextCursor={singleTypeResult!.nextCursor}
                  locale={locale}
                  documentType={singleType}
                  loadMoreLabel={t("loadMore")}
                />
              )}
            </div>
          ) : zonesByType!.every(({ files }) => files.length === 0) ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noFiles")}
            </p>
          ) : (
            zonesByType!.map(({ type, files }) => (
              <FileTypeSection key={type} documentType={type} files={files} locale={locale} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
