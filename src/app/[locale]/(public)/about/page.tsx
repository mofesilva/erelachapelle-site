import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutHeroSection } from "./_components/AboutHeroSection";
import { HistorySection } from "./_components/HistorySection";
import { ValuesSection } from "./_components/ValuesSection";
import { FaithSection } from "./_components/FaithSection";
import { TeamSection } from "./_components/TeamSection";
import { VisitCtaSection } from "./_components/VisitCtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("historyText"),
  };
}

export default async function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <HistorySection />
      <ValuesSection />
      <FaithSection />
      <TeamSection />
      <VisitCtaSection />
    </main>
  );
}
