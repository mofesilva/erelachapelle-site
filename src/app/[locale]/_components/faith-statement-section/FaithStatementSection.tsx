import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CrossDivider } from "@/_components/CrossDivider";
import { ScrollReveal } from "./ScrollReveal";

export async function FaithStatementSection() {
  const t = await getTranslations("homepage.faith");

  return (
    <section className="relative bg-night-bordeaux-2 py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Row: quote text + image — image matches text height */}
        <div className="flex flex-col md:flex-row md:items-stretch items-center gap-8 md:gap-16">
          {/* Text content — slides in from the left */}
          <ScrollReveal from="left" className="flex-1 text-center md:text-right md:order-1">
            <span className="font-serif text-4xl md:text-8xl text-toffee-brown leading-none select-none">&ldquo;</span>
            <p className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed text-white italic">
              {t("statement")}
            </p>
          </ScrollReveal>

          {/* Image — slides in from the right */}
          <ScrollReveal from="right" className="w-full md:w-80 lg:w-96 shrink-0 self-stretch md:order-2">
            {/* Mobile: landscape */}
            <div className="block md:hidden relative w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://cappuccino.dzign-e.app/erelachappelle-assets/top-view-crown-thorns-bible-arrangement.jpg"
                alt=""
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
            {/* Desktop: fills wrapper height, 3/4 aspect ratio on wrapper width */}
            <div className="hidden md:block relative h-full rounded-2xl overflow-hidden">
              <Image
                src="https://cappuccino.dzign-e.app/erelachappelle-assets/top-view-crown-thorns-bible.jpg"
                alt=""
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Divider — below the row, not aligned with image */}
        <CrossDivider variant="white" className="mt-8 md:mt-10 justify-center" />
      </div>
    </section>
  );
}
