import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { PlayBold } from "solar-icon-set";
import { SplitButton } from "@/_components/SplitButton";
import { getRecentSermons } from "@/lib/data/sermons";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import { SkeletonImage } from "@/_components/SkeletonImage";

/**
 * Vive dentro do bloco bordeaux do topo da página (o antigo hero), no lugar do título
 * "Prédications" — o hero era um retângulo vermelho quase vazio e o destaque ficava
 * empurrado pra baixo dele. Por isso o texto aqui é claro sobre fundo escuro.
 */
export async function FeaturedSermon() {
  const t = await getTranslations("sermons");
  const locale = (await getLocale()) as Locale;
  const [sermon] = await getRecentSermons(1);

  if (!sermon) return null;

  return (
    <div className="mx-auto max-w-7xl px-4">
      

      <div className="mt-8 grid items-center gap-8 md:mt-10 md:grid-cols-2 md:gap-12">
        {/* Thumbnail — mesmo comportamento de clique do SermonCard: a imagem inteira
            leva pro sermão, não só o botão "Regarder". */}
        <Link
          href={`/${locale}/sermons/${sermon.slug}`}
          className="group relative block aspect-video overflow-hidden shadow-2xl"
        >
          <SkeletonImage
            src={getYouTubeThumbnailUrl(sermon.youtubeVideoId, "maxresdefault")}
            alt={getLocalizedContent(sermon.title, locale)}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-carbon-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center bg-parchment/95 shadow-lg">
              <PlayBold size={28} color="var(--night-bordeaux-2)" />
            </div>
          </div>
        </Link>

        {/* Info */}
        <div>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.2em] text-parchment/50">
            {formatDate(sermon.date, locale)}
          </p>

          <h1 className="mt-3 font-serif text-[1.75rem] font-bold leading-[1.15] text-parchment md:text-[2.5rem]">
            {getLocalizedContent(sermon.title, locale)}
          </h1>

          {sermon.description && (
            <p className="mt-4 text-[0.9375rem] leading-[1.7] text-parchment/70">
              {getLocalizedContent(sermon.description, locale)}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {sermon.series && (
              <p className="border border-toffee-brown/50 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
                {sermon.series}
              </p>
            )}
            {sermon.biblicalReference && (
              <p className="border border-parchment/25 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-parchment/70">
                {sermon.biblicalReference.book} {sermon.biblicalReference.chapter}
                {sermon.biblicalReference.verses && `:${sermon.biblicalReference.verses}`}
              </p>
            )}
          </div>

          <div className="mt-8">
            <SplitButton href={`/${locale}/sermons/${sermon.slug}`} variant="gold">
              {t("watchNow")}
            </SplitButton>
          </div>
        </div>
      </div>
    </div>
  );
}
