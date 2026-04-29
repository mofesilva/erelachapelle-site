import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/_components/DiamondDivider";

const FAITH_KEYS = ["god", "bible", "jesus", "spirit"] as const;

export async function FaithSection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
            {t("faithSubtitle")}
          </p>
          <h2 className="mt-3 font-serif font-bold text-carbon-black">
            {t("faith")}
          </h2>
          <DiamondDivider variant="parchment" className="mt-5 justify-center" />
        </div>

        {/* 2×2 faith grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {FAITH_KEYS.map((key, index) => (
            <div key={key} className="text-center sm:text-left">
              <p className="font-serif text-3xl font-bold text-toffee-brown/20">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h5 className="mt-2 font-serif font-bold text-carbon-black">
                {t(`faithItems.${key}.title`)}
              </h5>
              <p className="mt-3 leading-relaxed text-coffee-bean">
                {t(`faithItems.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
