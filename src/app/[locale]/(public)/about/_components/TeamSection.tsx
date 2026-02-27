import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { SectionLabel } from "@/_components/SectionLabel";
import { getLeadershipTeam } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { UsersGroupRoundedBoldDuotone } from "solar-icon-set";

export async function TeamSection() {
  const t = await getTranslations("about.team");
  const locale = (await getLocale()) as Locale;
  const team = getLeadershipTeam();

  return (
    <section className="bg-dust-grey/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionLabel
          icon={UsersGroupRoundedBoldDuotone}
          title={t("title")}
          color="bordeaux"
        />
        <p className="mx-auto mt-3 max-w-md text-center text-coffee-bean/60">
          {t("subtitle")}
        </p>

        {/* Horizontal team cards — stacked */}
        <div className="mt-14 space-y-6">
          {team.map((member) => (
            <div
              key={member._id}
              className="flex flex-col items-center gap-6 rounded-xl border border-dust-grey bg-white p-6 sm:flex-row sm:items-start sm:p-8"
            >
              {/* Photo */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-powder-petal ring-2 ring-toffee-brown/15 sm:h-24 sm:w-24">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.fullName}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="font-serif text-3xl font-bold text-coffee-bean/30">
                    {member.fullName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 text-center sm:text-left">
                <h5 className="font-serif font-bold text-carbon-black">
                  {member.fullName}
                </h5>
                <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-toffee-brown">
                  {getLocalizedContent(member.role, locale)}
                </span>
                <p className="mt-3 leading-relaxed text-coffee-bean">
                  {getLocalizedContent(member.bio, locale)}
                </p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 inline-block text-sm text-night-bordeaux-2/60 underline decoration-night-bordeaux-2/15 underline-offset-4 transition-fast hover:text-night-bordeaux-2 hover:decoration-night-bordeaux-2/40"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
