import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftBold, LetterBold } from "solar-icon-set";
import { PeekRectangle } from "@/_components/PeekRectangle";
import { getLeadershipTeam, getLeaderBySlug } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getLeadershipTeam().map((leader) => ({ locale, slug: leader.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);
  if (!leader) return {};
  return {
    title: `${leader.fullName} — ${leader.role.fr}`,
    description: leader.bio.fr,
  };
}

export default async function PasteurDetailPage({ params }: PageProps) {
  const { slug, locale: paramLocale } = await params;
  const locale = paramLocale as Locale;
  const t = await getTranslations("about.team");
  const leader = getLeaderBySlug(slug);

  if (!leader) notFound();

  const fullBio = getLocalizedContent(leader.fullBio, locale);
  const paragraphs = fullBio.split("\n\n").filter(Boolean);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative pb-16 pt-36 md:pb-20 md:pt-44 overflow-hidden"
        style={{
          backgroundImage: 'url("/images/inside-church.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Bordeaux overlay */}
        <div className="pointer-events-none absolute inset-0 bg-carbon-black/80" />

        <div className="relative mx-auto max-w-5xl px-6">
          {/* Back link */}
          <Link
            href={`/${paramLocale}/about#team`}
            className="inline-flex items-center gap-1.5 text-sm text-parchment/60 transition-colors hover:text-parchment"
          >
            <ArrowLeftBold size={14} color="currentColor" />
            {t("backToTeam")}
          </Link>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
            {/* Photo with PeekRectangle */}
            {leader.photoUrl && (
              <PeekRectangle color="gold" position="bottom-right" className="shrink-0 h-56 w-44 md:h-72 md:w-56">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={leader.photoUrl}
                    alt={leader.fullName}
                    fill
                    className="object-cover object-top"
                    unoptimized
                    priority
                  />
                </div>
              </PeekRectangle>
            )}

            {/* Name, role & email */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-toffee-brown/80">
                {getLocalizedContent(leader.role, locale)}
              </p>
              <h1 className="mt-3 font-serif text-4xl font-bold text-parchment md:text-5xl">
                {leader.fullName}
              </h1>
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-base text-parchment/80 transition-colors hover:text-parchment"
                >
                  <LetterBold size={18} color="currentColor" />
                  {leader.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full biography */}
      <section className="bg-parchment py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-6">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="leading-[1.85] text-coffee-bean/80 md:text-lg md:leading-[1.9]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-12">
            <Link
              href={`/${paramLocale}/about#team`}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-night-bordeaux-2/60 transition-colors hover:text-night-bordeaux-2"
            >
              <ArrowLeftBold size={14} color="currentColor" />
              {t("backToTeam")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
