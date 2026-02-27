import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/_components/DiamondDivider";

export async function MissionVisionSection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Two side-by-side cards */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Mission card */}
          <div className="rounded-xl border border-dust-grey bg-white p-8 md:p-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-toffee-brown">
              01
            </span>
            <h3 className="mt-3 font-serif font-bold text-night-bordeaux-2">
              {t("mission")}
            </h3>
            <DiamondDivider variant="bordeaux" className="mt-4 justify-start" />
            <p className="mt-6 leading-relaxed text-coffee-bean">
              {t("missionText")}
            </p>
          </div>

          {/* Vision card */}
          <div className="rounded-xl border border-dust-grey bg-white p-8 md:p-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-toffee-brown">
              02
            </span>
            <h3 className="mt-3 font-serif font-bold text-night-bordeaux-2">
              {t("vision")}
            </h3>
            <DiamondDivider variant="bordeaux" className="mt-4 justify-start" />
            <p className="mt-6 leading-relaxed text-coffee-bean">
              {t("visionText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
