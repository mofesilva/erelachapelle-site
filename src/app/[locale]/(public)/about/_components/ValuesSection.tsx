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
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel
          icon={StarBoldDuotone}
          title={t("values")}
          color="gold"
        />
        <p className="mx-auto mt-3 max-w-lg text-center text-coffee-bean/60">
          {t("valuesSubtitle")}
        </p>

        {/* Two-column list with left gold border accent */}
        <div className="mt-14 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {VALUE_KEYS.map((key, index) => {
            const Icon = VALUE_ICONS[index];
            return (
              <div
                key={key}
                className="flex gap-5 border-l-2 border-toffee-brown/25 py-1 pl-6"
              >
                <div className="shrink-0 pt-0.5">
                  <Icon size={22} color="var(--toffee-brown)" />
                </div>
                <div>
                  <h6 className="font-serif font-bold text-carbon-black">
                    {t(`valuesItems.${key}.title`)}
                  </h6>
                  <p className="mt-1.5 text-sm leading-relaxed text-coffee-bean">
                    {t(`valuesItems.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
