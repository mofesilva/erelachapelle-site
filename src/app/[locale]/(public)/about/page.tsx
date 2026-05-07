import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
import { MissionVisionSection } from "./_components/MissionVisionSection";
import { ChurchOriginsSection } from "./_components/ChurchOriginsSection";
import { LocalContextSection } from "./_components/LocalContextSection";
import { CommunityLifeSection } from "./_components/CommunityLifeSection";
import { ValuesSection } from "./_components/ValuesSection";
import { FaithSection } from "./_components/FaithSection";
import { TeamSection } from "./_components/TeamSection";
import { VisitCtaSection } from "./_components/VisitCtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("missionText"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <main>
      <SecondaryHeroSection
        variant="quote"
        title={t("heroQuote")}
        description={t("heroSubtitle")}
        bgImage="/images/inside-church.jpg"
      />
      <MissionVisionSection />
      <ChurchOriginsSection />
      <LocalContextSection />
      <ValuesSection />
      <FaithSection />
      <TeamSection />
      <VisitCtaSection />
    </main>
  );
}
