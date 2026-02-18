import { getTranslations, getLocale } from "next-intl/server";
import { SplitButton } from "@/components/shared/SplitButton";
import type { Locale } from "@/types/common";

export async function FaithStatementSection() {
  const t = await getTranslations("homepage.faith");
  const locale = (await getLocale()) as Locale;

  return (
    <section
      className="relative bg-[#E7C6B5] py-20 md:py-32 overflow-hidden"
      aria-label={t("cta")}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233D000A\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Decorative quote marks */}
        <div className="mb-8">
          <span className="font-serif text-6xl md:text-8xl text-[#8C5E35]/30 leading-none select-none">"</span>
        </div>

        <p className="font-serif text-2xl leading-relaxed text-[#3D000A] md:text-4xl lg:text-5xl md:leading-relaxed italic">
          {t("statement")}
        </p>

        {/* Decorative divider */}
        <div className="mx-auto mt-10 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#8C5E35]/50" />
          <span className="text-[#8C5E35] text-xs">◆</span>
          <span className="h-px w-12 bg-[#8C5E35]/50" />
        </div>

        <div className="mt-10">
          <SplitButton href={`/${locale}/about`} variant="burgundy">
            {t("cta")}
          </SplitButton>
        </div>
      </div>
    </section>
  );
}
