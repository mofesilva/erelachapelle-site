import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftBold } from "solar-icon-set";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { getLeadershipTeam, getLeaderBySlug } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return getLeadershipTeam().map((leader) => ({ slug: leader.slug }));
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
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("about.team");
  const leader = getLeaderBySlug(slug);

  if (!leader) notFound();

  const fullBio = getLocalizedContent(leader.fullBio, locale);
  const paragraphs = fullBio.split("\n\n").filter(Boolean);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-night-bordeaux-2 pb-16 pt-36 md:pb-20 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNmZmYnLz48L3N2Zz4=")',
          }}
        />

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
            {/* Photo */}
            {leader.photoUrl && (
              <div className="relative h-56 w-44 shrink-0 overflow-hidden md:h-72 md:w-56 border-2 border-toffee-brown/30">
                <Image
                  src={leader.photoUrl}
                  alt={leader.fullName}
                  fill
                  className="object-cover object-top"
                  unoptimized
                  priority
                />
              </div>
            )}

            {/* Name & role */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-toffee-brown/80">
                {getLocalizedContent(leader.role, locale)}
              </p>
              <h1 className="mt-3 font-serif text-4xl font-bold text-parchment md:text-5xl">
                {leader.fullName}
              </h1>
              <DiamondDivider variant="parchment" className="mt-6" />

              {/* Partner badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="border border-toffee-brown/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-toffee-brown/80">
                  APMT
                </span>
                <span className="border border-toffee-brown/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-toffee-brown/80">
                  UNEPREF
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <section className="bg-carbon-black">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {[
              { value: "2004", label: locale === "pt" ? "Missionário na Europa" : locale === "en" ? "Missionary in Europe" : "Missionnaire en Europe" },
              { value: "2016", label: locale === "pt" ? "Em França" : locale === "en" ? "In France" : "En France" },
              { value: "APMT", label: locale === "pt" ? "Agência missionária" : locale === "en" ? "Missionary agency" : "Agence missionnaire" },
              { value: "UNEPREF", label: locale === "pt" ? "Parceiro local" : locale === "en" ? "Local partner" : "Partenaire local" },
            ].map((fact) => (
              <div key={fact.value} className="px-6 py-8 text-center">
                <p className="font-serif text-2xl font-bold text-toffee-brown md:text-3xl">
                  {fact.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-powder-petal/50">
                  {fact.label}
                </p>
              </div>
            ))}
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

          {/* Email */}
          {leader.email && (
            <div className="mt-12 border-t border-dust-grey pt-8">
              <a
                href={`mailto:${leader.email}`}
                className="text-sm text-night-bordeaux-2/70 underline decoration-night-bordeaux-2/20 underline-offset-4 transition-colors hover:text-night-bordeaux-2"
              >
                {leader.email}
              </a>
            </div>
          )}

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
