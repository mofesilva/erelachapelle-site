import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function FaithStatementSection() {
  const t = await getTranslations("homepage.faith");

  return (
    <section className="relative bg-night-bordeaux-2 py-20 md:py-16 md:pb-64 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="font-serif text-4xl md:text-8xl lg:text-9xl text-toffee-brown leading-none select-none">&ldquo;</span>
        <blockquote className="font-baskerville text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-relaxed md:leading-relaxed text-white">
          {t("statement")}
        </blockquote>

        <CrossDivider variant="white" className="mt-8 md:mt-10 justify-center" />
      </div>
    </section>
  );
}
