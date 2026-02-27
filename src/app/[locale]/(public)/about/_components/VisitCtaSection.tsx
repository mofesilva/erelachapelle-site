import { getTranslations, getLocale } from "next-intl/server";
import { SplitButton } from "@/_components/SplitButton";
import { DiamondDivider } from "@/_components/DiamondDivider";
import type { Locale } from "@/types/common";

export async function VisitCtaSection() {
  const t = await getTranslations("about.cta");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="bg-night-bordeaux-2 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <DiamondDivider variant="parchment" className="justify-center" />

        <h2 className="mt-8 font-serif font-bold text-parchment">
          {t("title")}
        </h2>

        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-powder-petal/50">
          {t("subtitle")}
        </p>

        <div className="mt-10">
          <SplitButton href={`/${locale}/contact`} variant="gold">
            {t("button")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
