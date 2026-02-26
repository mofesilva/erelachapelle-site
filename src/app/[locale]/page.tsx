import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "./_components/hero/HeroSection";
import { FaithStatementSection } from "./_components/faith-statement-section/FaithStatementSection";
import { GatheringSection } from "./_components/gathering-section/GatheringSection";
import { EventsPreviewSection } from "./_components/EventsPreviewSection";
import { CommunitySection } from "./_components/community-section/CommunitySection";
import { BlogPreviewSection } from "./_components/BlogPreviewSection";
import { NewsletterSection } from "./_components/NewsletterSection";
import { churchJsonLd } from "@/lib/structured-data";
import { getLocations } from "@/lib/data/locations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homepage.hero");
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function HomePage() {
  const locations = getLocations();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(churchJsonLd(locations)),
        }}
      />
      <HeroSection />
      <FaithStatementSection />
      <GatheringSection />
      <CommunitySection />
      <EventsPreviewSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </>
  );
}
