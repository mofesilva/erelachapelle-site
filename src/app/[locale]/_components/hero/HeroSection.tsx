import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/types/common";
import HeroBanner from "./HeroBanner";
import { SplitButton } from "@/components/shared/SplitButton";

export async function HeroSection() {
  const t = await getTranslations("homepage.hero");
  const locale = (await getLocale()) as Locale;

  return (
    <section
      className="relative h-[80dvh] overflow-hidden"
      aria-labelledby="hero-title"
    >
      <HeroBanner />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-4xl px-6 text-center">
          <div className="mx-auto mb-8 flex items-center justify-center gap-5">
            <span className="h-px w-24 bg-background" />
            <span className="text-background text-2xl">✟</span>
            <span className="h-px w-24 bg-background" />
          </div>
          <h1
            id="hero-title"
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/85 font-light tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            {t("subtitle")}
          </p>

          <div className="mt-10">
            <SplitButton href={`/${locale}/about`}>
              {t("cta")}
            </SplitButton>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
        role="presentation"
      >
        <div className="flex flex-col items-center gap-2">
          <ChevronDown className="w-6 h-6 text-white/60 animate-bounce-3x" />
        </div>
      </div>
    </section>
  );
}
