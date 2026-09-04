import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { NotebookBoldDuotone } from "solar-icon-set";
import { BackLink } from "@/_components/BackLink";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { ShareButtons } from "@/_components/ShareButtons";
import { getAllArticles, getArticleById } from "@/lib/data/blog";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { Locale } from "@/types/common";
import { ArticleCard } from "../_components/ArticleCard";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return {};
  return {
    title: article.title.fr,
    description: article.excerpt.fr,
  };
}

// Estimativa simples a partir da contagem de palavras do HTML (sem tags) — ~200
// palavras/minuto, arredondado pra cima, mínimo de 1.
function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id, locale: localeParam } = await params;
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const article = await getArticleById(id);

  if (!article) notFound();

  const title = getLocalizedContent(article.title, locale);
  const excerpt = getLocalizedContent(article.excerpt, locale);
  const content = getLocalizedContent(article.content, locale);
  const readingMinutes = getReadingTime(content);
  const pageUrl = `https://erelachapelle.fr/${localeParam}/blog/${article._id}`;

  const others = (await getAllArticles()).filter((a) => a._id !== article._id);
  // Prioriza o mesmo postType (mesmo hub); completa com a mesma categoria se faltar.
  const samePostType = others.filter((a) => a.postType === article.postType);
  const sameCategory = others.filter(
    (a) => a.postType !== article.postType && a.category.id === article.category.id
  );
  const related = [...samePostType, ...sameCategory].slice(0, 3);

  return (
    <main>
      {/* Banner de fora a fora — sem container, `<main>` não tem max-width, então a
          seção ocupa a viewport inteira. Sem imagem, cai numa faixa bordeaux mínima
          só com o link de volta, pra página não começar abrupta. */}
      {article.featuredImage ? (
        <div className="relative h-[42vh] max-h-[720px] min-h-[280px] w-full overflow-hidden bg-dust-grey sm:h-[54vh] md:h-[62vh] lg:h-[68vh]">
          <SkeletonImage
            src={resolveMediaAssetUrl(article.featuredImage.url)}
            alt={
              article.featuredImage.altText
                ? getLocalizedContent(article.featuredImage.altText, locale)
                : title
            }
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          {/* Overlay + gradient — mesmo espírito do tratamento de imagem de fundo do
              /about: escurece o topo (onde o header fixo transparente flutua por cima)
              e a base (transição pro conteúdo), preservando a foto legível no meio. */}
          <div className="pointer-events-none absolute inset-0 bg-carbon-black/15" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-carbon-black/80 to-transparent md:h-56" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-carbon-black/60 to-transparent" />

          {/* Mesmo offset (`top-36 md:top-44`) e mesmo container (`max-w-7xl px-4`) do
              header/das demais páginas de detalhe, pra "voltar" ficar sempre na mesma
              posição — 80px abaixo do header — em vez de colar no logo. */}
          <div className="absolute inset-x-0 top-36 md:top-44">
            <div className="mx-auto max-w-7xl px-4">
              <BackLink href={`/${locale}/blog`}>{t("backToArticles")}</BackLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-night-bordeaux-2 pb-10 pt-36 md:pb-14 md:pt-44">
          <div className="mx-auto max-w-7xl px-4">
            <BackLink href={`/${locale}/blog`}>{t("backToArticles")}</BackLink>
          </div>
        </div>
      )}

      {/* Título e conteúdo, sempre abaixo do banner — nunca sobre a imagem. */}
      <article className="bg-parchment">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:pb-20 md:pt-14">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-toffee-brown">
            {getLocalizedContent(article.category.name, locale)}
          </p>

          <h1 className="mt-3 font-serif text-[2rem] font-bold leading-[1.15] text-night-bordeaux-2 md:text-[2.75rem] lg:text-[3.25rem]">
            {title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-coffee-bean/60">
            <span>
              {t("publishedOn")} {formatDate(article.publishedAt, locale)}
            </span>
            <span aria-hidden>·</span>
            <span>
              {t("by")} {article.author}
            </span>
            <span aria-hidden>·</span>
            <span>{t("readingTime", { count: readingMinutes })}</span>
          </div>

          {/* Lede — mesmo tratamento de letra capitular usado na descrição do sermão
              em destaque (ver FeaturedSermon / SermonDetailPage). */}
          <div className="mt-8 border-t border-dust-grey pt-8">
            <p className="font-serif text-[1.125rem] italic leading-[1.7] text-coffee-bean/80 md:text-[1.25rem]">
              <span className="mr-1 font-serif text-5xl font-bold leading-none text-toffee-brown/30">
                {excerpt.charAt(0)}
              </span>
              {excerpt.slice(1)}
            </p>
          </div>

          {/* Conteúdo HTML vem do editor rich text do backoffice, já sanitizado no
              servidor (ver erelachapelle-api/src/lib/sanitize-html.ts) — seguro pra
              injetar direto. */}
          <div
            className="post-content mt-8 text-[1.0625rem] md:text-[1.125rem]"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="mt-10 border-t border-dust-grey pt-6">
            <ShareButtons url={pageUrl} title={title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-parchment py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-3">
              <NotebookBoldDuotone size={18} color="var(--night-bordeaux-2)" />
              <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.25em] text-night-bordeaux-2">
                {t("relatedArticles")}
              </p>
              <span className="h-px flex-1 bg-night-bordeaux-2/15" />
            </div>

            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a._id} article={a} locale={locale} readMoreLabel={t("readMore")} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
