import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { BackLink } from "@/_components/BackLink";
import { getArticlesByType, searchArticles } from "@/lib/data/blog";
import { POST_TYPES, type PostType } from "@/types/blog";
import type { Locale } from "@/types/common";
import { ArticleCard } from "./_components/ArticleCard";
import { ArticleFilters } from "./_components/ArticleFilters";
import { FeaturedArticle } from "./_components/FeaturedArticle";
import { PostTypeSection, ZONE_ICON, ZONE_COLOR } from "./_components/PostTypeSection";

// Quantos itens aparecem no carrossel de cada zona do hub — "ver tudo" no cabeçalho da
// zona (`?type=`) é quem dá acesso ao restante, sem limite.
const ZONE_PREVIEW_SIZE = 7;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

function isPostType(value: string | undefined): value is PostType {
  return !!value && (POST_TYPES as readonly string[]).includes(value);
}

export default async function BlogPage({ searchParams }: PageProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  // Busca por texto varre a base inteira (a API não filtra no servidor). Sem busca, o hub
  // mostra as 3 zonas de tipo lado a lado, cada uma com seu próprio carrossel — nada de
  // aba/filtro pra escolher uma de cada vez, elas convivem na mesma tela. `?type=` é o
  // "ver tudo" de uma zona só, ainda dentro de `/blog` (não é uma rota separada).
  const hasQuery = !!params.q;
  const singleType = !hasQuery && isPostType(params.type) ? params.type : null;

  const searchResults = hasQuery ? await searchArticles(params.q!, locale) : null;
  const singleTypeArticles = singleType ? await getArticlesByType(singleType) : null;
  const zonesByType =
    hasQuery || singleType
      ? null
      : await Promise.all(
          POST_TYPES.map(async (type) => ({
            type,
            articles: (await getArticlesByType(type)).slice(0, ZONE_PREVIEW_SIZE),
          }))
        );

  return (
    <main className="flex flex-1 flex-col">
      {/* Bloco bordeaux do topo: leva o artigo em destaque dentro, mesmo tratamento
          do FeaturedSermon em /sermons e do FeaturedPodcast em /podcast. */}
      <section className="relative min-h-[50svh] bg-night-bordeaux-2 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src="/images/inside-church.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
        <div className="relative">
          <FeaturedArticle />
        </div>
      </section>

      <section className="flex flex-1 flex-col bg-parchment py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* Busca é uma ferramenta útil acima do hub, não mais uma "4ª zona" com
              título/divisor próprio — isso competia visualmente com o cabeçalho de
              cada zona de tipo logo abaixo. */}
          <div className="max-w-md">
            <Suspense fallback={null}>
              <ArticleFilters />
            </Suspense>
          </div>

          {hasQuery ? (
            searchResults!.length === 0 ? (
              <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
                {t("noArticles")}
              </p>
            ) : (
              <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults!.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    locale={locale}
                    readMoreLabel={t("readMore")}
                  />
                ))}
              </div>
            )
          ) : singleType ? (
            <div className="mt-10">
              <BackLink href={`/${locale}/blog`}>{t("backToArticles")}</BackLink>

              <div className="mt-6 flex items-center gap-3">
                {(() => {
                  const Icon = ZONE_ICON[singleType];
                  return <Icon size={18} color={ZONE_COLOR[singleType]} />;
                })()}
                <p
                  className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em]"
                  style={{ color: ZONE_COLOR[singleType] }}
                >
                  {t(`postTypes.${singleType}`)}
                </p>
                <span className="h-px flex-1 bg-night-bordeaux-2/15" />
              </div>

              {singleTypeArticles!.length === 0 ? (
                <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
                  {t("noArticles")}
                </p>
              ) : (
                <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {singleTypeArticles!.map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      locale={locale}
                      readMoreLabel={t("readMore")}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : zonesByType!.every(({ articles }) => articles.length === 0) ? (
            <p className="mt-12 text-center font-serif italic text-coffee-bean/50">
              {t("noArticles")}
            </p>
          ) : (
            zonesByType!.map(({ type, articles }) => (
              <PostTypeSection
                key={type}
                postType={type}
                articles={articles}
                locale={locale}
                readMoreLabel={t("readMore")}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
