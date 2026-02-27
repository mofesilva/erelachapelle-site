import { getTranslations, getLocale } from "next-intl/server";
import { SplitButton } from "@/_components/SplitButton";
import type { Locale } from "@/types/common";

export async function AboutSection() {
  const t = await getTranslations("homepage.about");
  const tAbout = await getTranslations("about");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif font-bold text-primary">
              {t("title")}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {tAbout("mission")}
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <SplitButton href={`/${locale}/about`} variant="burgundy">
              {t("cta")}
            </SplitButton>
          </div>
        </div>
      </div>
    </section>
  );
}
