import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/_components/SectionLabel";
import { PeekRectangle } from "@/_components/PeekRectangle";
import {
  StarBoldDuotone,
  HeartBold,
  ShieldCheckBold,
  HandStarsBold,
  BookBold,
  UsersGroupRoundedBold,
} from "solar-icon-set";

const VALUE_KEYS = [
  "welcome",
  "authenticity",
  "service",
  "prayer",
  "teaching",
  "fellowship",
] as const;

const VALUE_ICONS = [
  HeartBold,
  ShieldCheckBold,
  HandStarsBold,
  StarBoldDuotone,
  BookBold,
  UsersGroupRoundedBold,
];

export async function ValuesSection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-parchment py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel
          icon={StarBoldDuotone}
          title={t("values")}
          color="gold"
        />
        <p className="mx-auto mt-3 max-w-lg text-center text-coffee-bean/60">
          {t("valuesSubtitle")}
        </p>

        {/* PeekRectangle card grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_KEYS.map((key, index) => {
            const Icon = VALUE_ICONS[index];
            return (
              <PeekRectangle key={key} color="gold" position="bottom-right">
                <div className="flex h-full flex-col border border-dust-grey bg-white p-6 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
                  <div className="mb-4">
                    <Icon size={28} color="var(--toffee-brown)" />
                  </div>
                  <h6 className="font-serif font-bold text-carbon-black">
                    {t(`valuesItems.${key}.title`)}
                  </h6>
                  <p className="mt-2 flex-1 leading-relaxed text-coffee-bean">
                    {t(`valuesItems.${key}.description`)}
                  </p>
                </div>
              </PeekRectangle>
            );
          })}
        </div>
      </div>
    </section>
  );
}
