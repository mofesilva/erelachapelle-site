import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { PeekRectangle } from "@/_components/PeekRectangle";

export async function MissionVisionSection() {
  const t = await getTranslations("about");

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Two side-by-side cards */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Mission card */}
          <PeekRectangle color="bordeaux" position="top-left">
            <div className="h-full border border-dust-grey bg-white p-8 md:p-10">
              <p className="font-bold uppercase tracking-[0.2em] text-toffee-brown">
                01
              </p>
              <h3 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                {t("mission")}
              </h3>
              <DiamondDivider variant="bordeaux" className="mt-4 justify-start" />
              <p className="mt-6 leading-relaxed text-coffee-bean">
                {t("missionText")}
              </p>
            </div>
          </PeekRectangle>

          {/* Vision card */}
          <PeekRectangle color="gold" position="bottom-right">
            <div className="h-full border border-dust-grey bg-white p-8 md:p-10">
              <p className="font-bold uppercase tracking-[0.2em] text-toffee-brown">
                02
              </p>
              <h3 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                {t("vision")}
              </h3>
              <DiamondDivider variant="bordeaux" className="mt-4 justify-start" />
              <p className="mt-6 leading-relaxed text-coffee-bean">
                {t("visionText")}
              </p>
            </div>
          </PeekRectangle>
        </div>
      </div>
    </section>
  );
}
