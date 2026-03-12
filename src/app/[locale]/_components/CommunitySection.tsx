import { getTranslations, getLocale } from "next-intl/server";
import { getGroups } from "@/lib/groups";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { UsersGroupRoundedBoldDuotone, UsersGroupRoundedBold, HeartBold, Book2Bold, MusicNoteBold } from "solar-icon-set";
import { SectionLabel } from "@/_components/SectionLabel";
import { CommunityGroupCard } from "./CommunityGroupCard";

const groupIcons = [UsersGroupRoundedBold, HeartBold, Book2Bold, MusicNoteBold];

export async function CommunitySection() {
  const t = await getTranslations("homepage.community");
  const tGroups = await getTranslations("community.groups.types");
  const locale = (await getLocale()) as Locale;
  const groups = (await getGroups()).slice(0, 4);

  return (
    <section className="bg-parchment h-auto py-16 md:pt-32 md:pb-16 px-6">
      <div className="mx-auto max-w-5xl ">
        <SectionLabel icon={UsersGroupRoundedBoldDuotone} title={t("title")} color="bordeaux" />

        {/* Groups list — generous vertical spacing on mobile */}
        <div className="mt-12 md:mt-16 space-y-8 md:space-y-10 md:grid md:gap-x-16 md:gap-y-14 md:grid-cols-2">
          {groups.map((group, index) => {
            const Icon = groupIcons[index % groupIcons.length];
            return (
              <CommunityGroupCard
                key={group._id}
                icon={Icon}
                name={getLocalizedContent(group.name, locale)}
                description={getLocalizedContent(group.description, locale)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
