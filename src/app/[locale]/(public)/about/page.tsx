import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutHeroSection } from "./_components/AboutHeroSection";
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
  return (
    <main>
      <AboutHeroSection />
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
