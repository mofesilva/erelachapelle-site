import { getTranslations, getLocale } from "next-intl/server";
import { AltArrowDownBold } from "solar-icon-set";
import type { Locale } from "@/types/common";
import HeroBanner from "./HeroBanner";
import { SplitButton } from "@/_components/SplitButton";
import { CrossDivider } from "@/_components/CrossDivider";

export async function HeroSection() {
  const t = await getTranslations("homepage.hero");
  const locale = (await getLocale()) as Locale;

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "100svh" }}
      aria-labelledby="hero-title"
    >
      <HeroBanner />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-night-bordeaux-2/60 to-night-bordeaux-2"
        style={{ height: "50%" }}
      />

      {/* Content — vertically centered, padded past the fixed h-16 header */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "100%", paddingTop: "48px" }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-16 xl:px-4 text-center md:text-left">
          <CrossDivider className="mb-2 md:mb-8 justify-center md:justify-start" />
          <h1
            id="hero-title"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mx-auto md:mx-0 max-w-full md:max-w-[61.8%]"
          >
            {t("title")}
          </h1>
          <p className="mt-2 md:mt-6 text-sm sm:text-base text-white/85 font-light tracking-wide mx-auto md:mx-0 max-w-full md:max-w-[50%]">
            {t("subtitle")}
          </p>
          <div className="mt-5 md:mt-10">
            <SplitButton href={`/${locale}/about`}>
              {t("cta")}
            </SplitButton>
          </div>

          {/* Social media links */}
          <div className="mt-6 md:mt-8 flex items-center gap-4 justify-center md:justify-start">
            <a
              href="https://www.facebook.com/erelachapelle/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/erelachapelle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@erelachapelle/featured"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022ZM10 15.5l6-3.5-6-3.5v7Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "24px" }}
        aria-hidden="true"
      >
        <AltArrowDownBold size={24} color="rgba(255,255,255,0.6)" className="animate-bounce-3x" />
      </div>
    </section>
  );
}
