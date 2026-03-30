import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
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

  return (
    <section className="bg-dust-grey/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel
          icon={UsersGroupRoundedBoldDuotone}
          title={t("title")}
          color="bordeaux"
        />
        <p className="mx-auto mt-3 max-w-md text-center text-coffee-bean/60">
          {t("subtitle")}
        </p>

        {/* Team cards — side by side grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => {
            return (
              <PeekRectangle key={member._id} color={"dark"} position={'bottom-right'}>
                <div className="flex h-full flex-col border border-dust-grey bg-white overflow-hidden">
                  {/* Photo — banner no topo do card */}
                  <div className="relative aspect-square w-full shrink-0 bg-powder-petal overflow-hidden">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.fullName}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-4xl font-bold text-coffee-bean/30">
                          {member.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h5 className="font-serif font-bold text-carbon-black">
                      {member.fullName}
                    </h5>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-toffee-brown">
                      {getLocalizedContent(member.role, locale)}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-coffee-bean">
                      {getLocalizedContent(member.bio, locale)}
                    </p>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-3 inline-block text-xs text-night-bordeaux-2/60 underline decoration-night-bordeaux-2/15 underline-offset-4 transition-fast hover:text-night-bordeaux-2 hover:decoration-night-bordeaux-2/40"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              </PeekRectangle>
            );
          })}
        </div>
      </div>
    </section>
  );
}
