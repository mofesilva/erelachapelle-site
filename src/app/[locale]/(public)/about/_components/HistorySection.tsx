import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function HistorySection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-powder-petal py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Centered section header */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-toffee-brown">
            {t("historySubtitle")}
          </span>
          <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">
            {t("history")}
          </h2>
        </div>

        <CrossDivider variant="burgundy" className="mt-6 justify-center" />

        {/* Narrative text — large, elegant typography */}
        <div className="mt-10 md:mt-14">
          <span
            className="float-left mr-3 mt-1 font-serif text-6xl font-bold leading-none text-toffee-brown/30 md:text-7xl"
            aria-hidden="true"
          >
            {t("historyText").charAt(0)}
          </span>
          <p className="text-lg leading-[1.8] text-coffee-bean md:text-xl md:leading-[1.9]">
            {t("historyText").slice(1)}
          </p>
        </div>
      </div>
    </section>
  );
}
