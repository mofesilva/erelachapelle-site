import { getTranslations } from "next-intl/server";
import { SplitButton } from "@/_components/SplitButton";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { SITE_CONFIG } from "@/lib/constants";

export async function SermonsCtaSection() {
    const t = await getTranslations("sermons");

    return (
        <section className="bg-night-bordeaux-2 py-16 md:py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <DiamondDivider variant="parchment" className="justify-center" />

                <h2 className="mt-8 font-serif font-bold text-parchment">
                    {t("ctaTitle")}
                </h2>

                <p className="mx-auto mt-4 max-w-lg leading-relaxed text-powder-petal/50">
                    {t("ctaSubtitle")}
                </p>

                <div className="mt-10">
                    <SplitButton
                        href={SITE_CONFIG.socialMedia.youtube}
                        variant="gold"
                        external
                    >
                        {t("ctaButton")}
                    </SplitButton>
                </div>
            </div>
        </section>
    );
}
