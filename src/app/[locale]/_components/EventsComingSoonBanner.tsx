import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/_components/SectionLabel";
import { CalendarBoldDuotone } from "solar-icon-set";

export async function EventsComingSoonBanner() {
  const t = await getTranslations("homepage.events");

  return (
    <section className="relative bg-parchment py-16 md:py-24 overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--toffee-brown)/6%_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 flex flex-col items-center text-center gap-6">
        <SectionLabel
          icon={CalendarBoldDuotone}
          title={t("label")}
          align="center"
          color="gold"
        />

        <h2 className="font-serif text-night-bordeaux-2 leading-snug">
          {t("title")}
        </h2>

        <p className="text-carbon-black/60 text-lg leading-relaxed max-w-xl">
          {t("comingSoon")}
        </p>

        {/* Decorative pill */}
        <span className="inline-flex items-center gap-2 rounded-full border border-toffee-brown/30 bg-toffee-brown/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-toffee-brown">
          {t("comingSoonBadge")}
        </span>
      </div>
    </section>
  );
}
