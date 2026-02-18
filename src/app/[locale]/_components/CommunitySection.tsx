import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { SplitButton } from "@/components/shared/SplitButton";
import { getGroups } from "@/lib/data/groups";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { Users, Heart, BookOpen, Music } from "lucide-react";

const groupIcons = [Users, Heart, BookOpen, Music];

export async function CommunitySection() {
  const t = await getTranslations("homepage.community");
  const tGroups = await getTranslations("community.groups.types");
  const locale = (await getLocale()) as Locale;
  const groups = getGroups().slice(0, 4);

  return (
    <section className="relative bg-[#643036] py-20 md:py-32 overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(140,94,53,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(61,0,10,0.8),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionLabel
          label={t("label")}
          className="[&_span]:text-white/30 [&_.text-primary]:text-[#8C5E35]"
        />
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-white md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/20">
          ◆────◆
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, index) => {
            const Icon = groupIcons[index % groupIcons.length];
            return (
              <div
                key={group._id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#8C5E35]/40 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(140,94,53,0.2)]"
              >
                {/* Icon with glow */}
                <div className="relative mb-5">
                  <div className="absolute -inset-3 rounded-full bg-[#8C5E35]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <Icon className="relative h-8 w-8 text-[#8C5E35]" />
                </div>

                <h3 className="font-serif text-xl font-bold text-white">
                  {getLocalizedContent(group.name, locale)}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/50">
                  {getLocalizedContent(group.description, locale)}
                </p>

                {/* Type badge */}
                <span className="mt-4 inline-block rounded-full border border-[#8C5E35]/30 bg-[#8C5E35]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8C5E35]">
                  {tGroups(group.groupType)}
                </span>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-16 w-16 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-[#8C5E35]/50 to-transparent" />
                  <div className="absolute top-0 right-0 h-8 w-px bg-gradient-to-b from-[#8C5E35]/50 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <SplitButton href={`/${locale}/community/groups`}>
            {t("cta")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
