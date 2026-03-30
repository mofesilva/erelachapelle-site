import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";
import { ScrollReveal } from "@/_components/ScrollReveal";

export async function FaithStatementSection() {
  const t = await getTranslations("homepage.faith");

  return (
    <section className="relative bg-night-bordeaux-2 py-20 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <ScrollReveal from="left">
          <span className="font-serif text-4xl md:text-8xl text-toffee-brown leading-none select-none">&ldquo;</span>
          <blockquote className="font-baskerville text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed text-white">
            {t("statement")}
          </blockquote>
        </ScrollReveal>

        <CrossDivider variant="white" className="mt-8 md:mt-10 justify-center" />
      </div>
    </section>
  );
}
