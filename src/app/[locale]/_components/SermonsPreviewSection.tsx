import { getTranslations, getLocale } from "next-intl/server";
import { SectionLabel } from "@/_components/SectionLabel";
import { SermonCard } from "./SermonCard";
import { SplitButton } from "@/_components/SplitButton";
import { getRecentSermons } from "@/lib/sermons";
import { getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import { VideocameraBoldDuotone } from "solar-icon-set";

export async function SermonsPreviewSection() {
  const t = await getTranslations("homepage.sermons");
  const locale = (await getLocale()) as Locale;
  const sermons = await getRecentSermons();

  if (sermons.length === 0) {
    return (
      <section className="relative bg-dust-grey py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <SectionLabel icon={VideocameraBoldDuotone} title={t("title")} />
          <div className="mt-14 flex flex-col items-center gap-4 text-rich-mahogany/40">
            <VideocameraBoldDuotone size={64} />
            <p className="font-light">{t("empty")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-dust-grey py-20 md:py-32">
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-toffee-brown to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel icon={VideocameraBoldDuotone} title={t("title")} />

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
