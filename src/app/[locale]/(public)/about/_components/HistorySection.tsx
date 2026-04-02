import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CrossDivider } from "@/_components/CrossDivider";

export async function HistorySection() {
  const t = await getTranslations("about");

  return (
    <section className="relative py-28 md:py-40">
      {/* Background image */}
      <Image
        src="/images/community/bible-study.jpg"
        alt=""
        role="presentation"
        fill
        className="object-cover"
      />
      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-rich-mahogany/80" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Centered section header */}
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown">
            {t("historySubtitle")}
          </p>
          <h2 className="mt-3 font-serif font-bold text-parchment">
            {t("history")}
          </h2>
        </div>

        <CrossDivider variant="gold" className="mt-6 justify-center" />

        {/* Narrative text — large, elegant typography */}
        <div className="mt-10 md:mt-14">
          <span
            className="float-left mr-3 mt-1 font-serif text-6xl font-bold leading-none text-toffee-brown/40 md:text-7xl"
            aria-hidden="true"
          >
            {t("historyText").charAt(0)}
          </span>
          <h6 className="text-parchment">
            {t("historyText").slice(1)}
          </h6>
        </div>
      </div>
    </section>
  );
}
