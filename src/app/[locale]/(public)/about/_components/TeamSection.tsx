import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/_components/SectionLabel";
import { getLeadershipTeam } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { UsersGroupRoundedBoldDuotone } from "solar-icon-set";
import { PeekRectangle } from "@/_components/PeekRectangle";

export async function TeamSection() {
  const t = await getTranslations("about.team");
  const locale = (await getLocale()) as Locale;
  const team = getLeadershipTeam();
  const pastor = team[0];

  if (!pastor) return null;

  return (
    <section id="team" className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel
          icon={UsersGroupRoundedBoldDuotone}
          title={t("title")}
          color="bordeaux"
        />
        <p className="mx-auto mt-3 max-w-md text-center text-coffee-bean/60">
          {t("subtitle")}
        </p>

        {/* Featured single-pastor card */}
        <div className="mt-14 mx-auto max-w-4xl">
          <PeekRectangle color="dark" position="bottom-right">
            <div className="flex flex-col md:flex-row border border-dust-grey bg-white overflow-hidden">
              {/* Photo */}
              <div className="relative w-full md:w-72 shrink-0 aspect-square md:aspect-auto bg-powder-petal overflow-hidden">
                {pastor.photoUrl ? (
                  <Image
                    src={pastor.photoUrl}
                    alt={pastor.fullName}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-6xl font-bold text-coffee-bean/30">
                      {pastor.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-toffee-brown">
                  {getLocalizedContent(pastor.role, locale)}
                </p>
                <h3 className="mt-2 font-serif font-bold text-carbon-black text-2xl md:text-3xl">
                  {pastor.fullName}
                </h3>
                <p className="mt-4 leading-relaxed text-coffee-bean/80 line-clamp-3">
                  {getLocalizedContent(pastor.bio, locale)}
                </p>
                <p className="leading-relaxed text-coffee-bean/80">…</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/about/pasteur/${pastor.slug}`}
                    className="inline-flex items-center gap-2 bg-night-bordeaux-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-parchment transition-fast hover:bg-night-bordeaux-2/80"
                  >
                    {t("readMore")}
                  </Link>
                </div>
              </div>
            </div>
          </PeekRectangle>
        </div>
      </div>
    </section>
  );
}
