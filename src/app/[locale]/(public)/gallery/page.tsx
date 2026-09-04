import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { getAllAlbums } from "@/lib/data/albums";
import { cn, getLocalizedContent } from "@/lib/utils";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Locale } from "@/types/common";

/* Pilha de fotos: cada índice é a profundidade da camada (0 = capa, no topo). Só as 3
   primeiras (`STACK_FAN_TRANSFORMS`) abrem em leque no hover — as demais (até 6 no total)
   ficam paradas atrás, só pra sugerir que o álbum tem mais fotos. Valores de transform
   precisam ser classes literais (não template string) pro Tailwind conseguir gerar o CSS. */
const STACK_IDLE_TRANSFORMS = [
  "translate-x-0 translate-y-0 rotate-0",
  "translate-x-[5px] translate-y-[6px] rotate-[3deg]",
  "translate-x-[-6px] translate-y-[7px] rotate-[-4deg]",
  "translate-x-[8px] translate-y-[-2px] rotate-[6deg]",
  "translate-x-[-7px] translate-y-[-4px] rotate-[-6deg]",
  "translate-x-[3px] translate-y-[8px] rotate-[2deg]",
] as const;

const STACK_FAN_TRANSFORMS = [
  "group-hover:translate-x-0 group-hover:translate-y-[-6%] group-hover:rotate-0",
  "group-hover:translate-x-[-20%] group-hover:translate-y-[4%] group-hover:rotate-[-12deg] group-hover:scale-[0.86]",
  "group-hover:translate-x-[20%] group-hover:translate-y-[4%] group-hover:rotate-[12deg] group-hover:scale-[0.86]",
] as const;

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
    <main className="flex flex-1 flex-col">
      {/* Bloco bordeaux do topo: mesmo tratamento de /sermons/[slug] — min-h 50%, foto
          do interior da igreja de fundo + overlay bordeaux, título centralizado no
          tamanho padrão de h1 — sem destaque (não há um "álbum em destaque" equivalente
          ao FeaturedSermon), fica só título + subtítulo. */}
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
          {albums.length === 0 ? (
            <p className="text-center font-serif italic text-coffee-bean/50">
              {t("noAlbums")}
            </p>
          ) : (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => {
                const title = getLocalizedContent(album.title, locale);
                const stackImages = album.images.slice(0, 6);
                const fanCount = Math.min(stackImages.length, 3);

                return (
                  <article key={album._id} className="group relative hover:z-20">
                    <Link href={`/${locale}/gallery/${album.slug}`} className="block">
                      <div className="relative aspect-square">
                        {stackImages.length === 0 ? (
                          <div className="absolute inset-0 border-[3px] border-white bg-dust-grey shadow-md" />
                        ) : (
                          stackImages.map((image, depth) => (
                            <div
                              key={image.id}
                              style={{ zIndex: stackImages.length - depth }}
                              className={cn(
                                "absolute inset-0 overflow-hidden border-[3px] border-white bg-dust-grey shadow-md transition-transform duration-500 ease-out",
                                STACK_IDLE_TRANSFORMS[depth],
                                depth < fanCount && STACK_FAN_TRANSFORMS[depth]
                              )}
                            >
                              <SkeletonImage
                                src={resolveMediaAssetUrl(image.url)}
                                alt={
                                  image.altText
                                    ? getLocalizedContent(image.altText, locale)
                                    : title
                                }
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                unoptimized
                              />
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-5 flex flex-col items-center gap-1 text-center">
                        <h6 className="font-serif text-[1.25rem] font-bold leading-[1.3] text-night-bordeaux-2 transition-colors duration-200 group-hover:text-toffee-brown">
                          {title}
                        </h6>
                        <span className="text-[0.8125rem] text-coffee-bean/55">
                          {album.images.length} {t("photos")}
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
