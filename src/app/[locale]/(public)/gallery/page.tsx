import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { GalleryBoldDuotone } from "solar-icon-set";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
import { SectionLabel } from "@/_components/SectionLabel";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { PeekRectangle } from "@/_components/PeekRectangle";
import { getAllAlbums } from "@/lib/data/albums";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const locale = (await getLocale()) as Locale;
  const albums = await getAllAlbums();

  return (
    <main>
      <SecondaryHeroSection title={t("title")} description={t("heroSubtitle")} />

      <section className="bg-powder-petal py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionLabel icon={GalleryBoldDuotone} title={t("allAlbums")} color="bordeaux" />

          {albums.length === 0 ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noAlbums")}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => {
                const cover = album.images[0];
                return (
                  <PeekRectangle key={album._id} color="gold" position="top-right">
                    <Link
                      href={`/${locale}/gallery/${album.slug}`}
                      className="group block overflow-hidden border border-dust-grey bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden bg-dust-grey">
                        {cover ? (
                          <SkeletonImage
                            src={cover.url}
                            alt={
                              cover.altText
                                ? getLocalizedContent(cover.altText, locale)
                                : getLocalizedContent(album.title, locale)
                            }
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : null}
                      </div>

                      <div className="p-5 md:p-6">
                        <h6 className="font-serif font-bold text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
                          {getLocalizedContent(album.title, locale)}
                        </h6>

                        <p className="mt-1 text-coffee-bean/60">
                          {album.images.length} {t("photos")}
                        </p>
                      </div>
                    </Link>
                  </PeekRectangle>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
