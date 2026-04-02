import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { PeekRectangle } from "@/_components/PeekRectangle";
import { SectionLabel } from "@/_components/SectionLabel";

import { UsersGroupRoundedBoldDuotone } from "solar-icon-set";

const cards = [
  {
    src: "/images/community/bible-study.jpg",
    labelKey: "bibleStudyLabel",
    titleKey: "bibleStudyTitle",
    color: "gold",
    position: "bottom-right",
    objectPosition: "object-center",
  },
  {
    src: "/images/community/prayer-group.jpg",
    labelKey: "prayerGroupLabel",
    titleKey: "prayerGroupTitle",
    color: "gold",
    position: "bottom-right",
    objectPosition: "object-right",
  },
  {
    src: "/images/community/pulpit-1.png",
    labelKey: "sundayServiceLabel",
    titleKey: "sundayServiceTitle",
    color: "gold",
    position: "bottom-right",
    objectPosition: "object-right",
  },
] as const;

export async function CommunitySection() {
  const t = await getTranslations("homepage.community");

  return (
    <section className="bg-parchment py-10 md:py-12 lg:py-14 2xl:pt-32 2xl:pb-16 px-6">
      <div className="mx-auto max-w-xl sm:max-w-xl md:max-w-2xl lg:max-w-5xl 2xl:max-w-6xl">
        <SectionLabel icon={UsersGroupRoundedBoldDuotone} title={t("title")} color="bordeaux" />

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-10">
          {cards.map((card) => (
            <PeekRectangle key={card.src} color={card.color} position={card.position}>
              <div className="overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                {/* Responsive aspect ratio: tall on mobile, shorter on desktop */}
                <div className="relative aspect-[3/4]">
                  <Image
                    src={card.src}
                    alt={t(card.titleKey)}
                    fill
                    className={`object-cover ${card.objectPosition}`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* Bottom overlay — bordeaux gradient covering bottom quarter */}
                  <div className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-night-bordeaux via-night-bordeaux/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-toffee-brown">
                      {t(card.labelKey)}
                    </p>
                    <h4 className="mt-2 font-serif font-bold text-white">
                      {t(card.titleKey)}
                    </h4>
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

