import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/_components/DiamondDivider";

export async function LocalContextSection() {
    const t = await getTranslations("about");

    return (
        <section className="bg-carbon-black py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-6">
                {/* Section header */}
                <div className="text-center">
                    <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/80">
                        Saint-Hippolyte-du-Fort
                    </p>
                    <h2 className="mt-3 font-serif font-bold text-parchment">
                        {t("localContext")}
                    </h2>
                    <DiamondDivider variant="parchment" className="mt-6 justify-center" />
                </div>

                {/* Hero stat */}
                <div className="mt-14 text-center">
                    <p className="font-serif font-bold leading-none text-toffee-brown" style={{ fontSize: "clamp(5rem, 18vw, 9rem)" }}>
                        98%
                    </p>
                    <p className="mt-3 text-sm uppercase tracking-[0.3em] text-powder-petal/60">
                        {t("localContextHighlight")}
                    </p>
                </div>

                {/* Main text */}
                <p className="mt-12 leading-[1.8] text-justify md:text-center text-powder-petal/80 md:leading-[1.9]">
                    {t("localContextText")}
                </p>
            </div>
        </section>
    );
}
