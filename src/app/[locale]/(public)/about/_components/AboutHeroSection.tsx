import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function AboutHeroSection() {
  const t = await getTranslations("about");

  return (
    <section className="relative bg-night-bordeaux-2 pb-20 pt-40 md:pb-28 md:pt-48 min-h-[50svh]">


      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <CrossDivider variant="white" className="justify-center" />

        <blockquote className="mt-8 font-serif text-2xl italic leading-relaxed text-parchment md:mt-10 md:text-3xl lg:text-4xl">
          “{t("heroQuote")}”
        </blockquote>

        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-powder-petal/60">
          {t("heroSubtitle")}
        </p>

        {/* Centered gold accent */}
        <div className="mx-auto mt-8 flex items-center justify-center gap-2">
          <div className="h-0.5 w-12 bg-toffee-brown/40" />
          <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
          <div className="h-0.5 w-12 bg-toffee-brown/40" />
        </div>
      </div>
    </section>
  );
}
