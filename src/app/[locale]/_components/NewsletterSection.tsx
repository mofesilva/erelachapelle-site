import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/_components/SectionLabel";
import { NewsletterSplitForm } from "./NewsletterSplitForm";
import { LetterBoldDuotone } from "solar-icon-set";

export async function NewsletterSection() {
    const t = await getTranslations("homepage.newsletter");

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-rich-mahogany via-night-bordeaux to-night-bordeaux-2 py-24 md:py-32">
            {/* Decorative radial glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_60%)]" />
            {/* Subtle shimmer — top only to avoid seam with footer */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(147,102,57,0.08)_0%,_transparent_50%)]" />

            <div className="relative mx-auto max-w-5xl px-6">
                {/* Header */}
                <SectionLabel icon={LetterBoldDuotone} title={t("title")} color="parchment" />
                <p className="mx-auto mt-6 max-w-lg text-center leading-relaxed text-white/60">
                    {t("subtitle")}
                </p>

                {/* Newsletter form */}
                <div className="mt-10 md:mt-12 flex justify-center">
                    <NewsletterSplitForm />
                </div>
            </div>
        </section>
    );
}
