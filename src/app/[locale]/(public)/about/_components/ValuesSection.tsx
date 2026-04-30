import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/_components/SectionLabel";
import {
  StarBoldDuotone,
  HeartBold,
  ShieldCheckBold,
  HandStarsBold,
  BookBold,
  UsersGroupRoundedBold,
} from "solar-icon-set";

const VALUE_KEYS = [
  "word",
  "growth",
  "witness",
  "community",
  "service",
  "unity",
] as const;

const VALUE_ICONS = [
  BookBold,
  StarBoldDuotone,
  HeartBold,
  UsersGroupRoundedBold,
  HandStarsBold,
  ShieldCheckBold,
];

export async function ValuesSection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-carbon-black py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel
          icon={StarBoldDuotone}
          title={t("values")}
          color="gold"
        />
        <p className="mx-auto mt-3 max-w-lg text-center text-powder-petal/60">
          {t("valuesSubtitle")}
        </p>

        {/* Two-column list with left gold border accent */}
        <div className="mt-14 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {VALUE_KEYS.map((key, index) => {
            const Icon = VALUE_ICONS[index];
            return (
              <div
                key={key}
                className="flex flex-col md:flex-row gap-5 border-l-2 border-toffee-brown/25 py-1 pl-6"
              >
                <div className="shrink-0 md:pt-0.5">
                  <Icon size={22} color="var(--toffee-brown)" />
                </div>
                <div>
                  <h6 className="font-serif font-bold text-parchment">
                    {t(`valuesItems.${key}.title`)}
                  </h6>
                  <p className="mt-1.5 leading-relaxed text-powder-petal/80">
                    {t(`valuesItems.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-sm italic leading-relaxed text-powder-petal/60">
          {t("valuesClosing")}
        </p>
      </div>
    </section>
  );
}
