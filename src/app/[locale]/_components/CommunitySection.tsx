import { getTranslations } from "next-intl/server";
import { PeekRectangle } from "@/_components/PeekRectangle";
import { SkeletonImage } from "@/_components/SkeletonImage";
import { SectionLabel } from "@/_components/SectionLabel";

import { UsersGroupRoundedBoldDuotone } from "solar-icon-set";

const cards = [
  {
    src: "https://erelachapelle.dzign-e.app/bible-study.jpg",
    labelKey: "bibleStudyLabel",
    titleKey: "bibleStudyTitle",
    color: "gold",
    position: "bottom-right",
    objectPosition: "object-center",
  },
  {
    src: "https://erelachapelle.dzign-e.app/prayer-group.jpg",
    labelKey: "prayerGroupLabel",
    titleKey: "prayerGroupTitle",
    color: "bordeaux",
    position: "bottom-right",
    objectPosition: "object-right",
  },
  {
    src: "https://erelachapelle.dzign-e.app/open-bible-black-background-religion-concept.jpg",
    labelKey: "insideChurchLabel",
    titleKey: "insideChurchTitle",
    color: "gold",
    position: "bottom-right",
    objectPosition: "object-center",
  },
] as const;

export async function CommunitySection() {
  const t = await getTranslations("homepage.community");

  return (
    <section className="bg-parchment py-16 md:pt-32 md:pb-16 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionLabel icon={UsersGroupRoundedBoldDuotone} title={t("title")} color="bordeaux" />

        <div className="mt-12 md:mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <PeekRectangle key={card.src} color={card.color} position={card.position}>
              <div className="overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                {/* 3:4 image */}
                <div className="relative aspect-[3/4]">
                  <SkeletonImage
                    src={card.src}
                    alt={t(card.titleKey)}
                    fill
                    className={`object-cover ${card.objectPosition}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-black/75 via-carbon-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-toffee-brown">
                      {t(card.labelKey)}
                    </p>
                    <h3 className="mt-2 font-serif font-bold text-white text-2xl">
                      {t(card.titleKey)}
                    </h3>
                  </div>
                </div>
              </div>
            </PeekRectangle>
          ))}
        </div>

      </div>
    </section>
  );
}

