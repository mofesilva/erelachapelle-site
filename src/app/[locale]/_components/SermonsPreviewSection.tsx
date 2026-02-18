import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { SermonCard } from "./SermonCard";
import { SplitButton } from "@/components/shared/SplitButton";
import { getRecentSermons } from "@/lib/data/sermons";
import { getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import { Video } from "lucide-react";

export async function SermonsPreviewSection() {
  const t = await getTranslations("homepage.sermons");
  const locale = (await getLocale()) as Locale;
  const sermons = getRecentSermons();

  if (sermons.length === 0) {
    return (
      <section className="relative bg-[#E7C6B5] py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <SectionLabel label={t("label")} />
          <h2 className="mt-6 text-center font-serif text-3xl font-bold text-[#3D000A] md:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-14 flex flex-col items-center gap-4 text-[#3D000A]/40">
            <Video className="h-16 w-16" />
            <p className="text-lg font-light">{t("empty")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#E7C6B5] py-20 md:py-32">
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8C5E35] to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel label={t("label")} />
        <h2 className="mt-6 text-center font-serif text-3xl font-bold text-[#3D000A] md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[#3D000A]/30">
          ◆────◆
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <SermonCard
              key={sermon._id}
              thumbnail={getYouTubeThumbnailUrl(sermon.youtubeVideoId)}
              date={new Date(sermon.date)}
              preacher={sermon.preacher}
              series={sermon.series || ""}
              title={getLocalizedContent(sermon.title, locale)}
              videoUrl={`https://www.youtube.com/watch?v=${sermon.youtubeVideoId}`}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <SplitButton href={`/${locale}/sermons`} variant="burgundy">
            {t("cta")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
