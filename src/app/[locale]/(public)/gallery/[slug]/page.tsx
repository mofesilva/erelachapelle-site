import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BackLink } from "@/_components/BackLink";
import { getAlbumBySlug, getAllAlbums } from "@/lib/data/albums";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { AlbumGallery } from "../_components/AlbumGallery";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const albums = await getAllAlbums();
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: album.title.fr,
    description: album.description?.fr,
  };
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("gallery");
  const locale = (await getLocale()) as Locale;
  const album = await getAlbumBySlug(slug);

  if (!album) notFound();

  return (
    <main>
      <section className="relative bg-night-bordeaux-2 pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="relative mx-auto max-w-7xl px-4">
          <BackLink href={`/${locale}/gallery`}>{t("backToGallery")}</BackLink>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="font-serif font-bold text-parchment">
              {getLocalizedContent(album.title, locale)}
            </h1>

            {album.description && (
              <p className="mt-4 text-parchment/70">
                {getLocalizedContent(album.description, locale)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <AlbumGallery images={album.images} albumTitle={album.title} locale={locale} />
        </div>
      </section>
    </main>
  );
}
