import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function CommunityLifeSection() {
    const t = await getTranslations("about");

    return (
        <section className="bg-parchment py-20 md:py-28">
            <div className="mx-auto max-w-3xl px-6">
                {/* Section header */}
                <div className="text-center">
                    <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
                        ERE La Chapelle
                    </p>
                    <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                        {t("communityLife")}
                    </h2>
                    <CrossDivider variant="burgundy" className="mt-6 justify-center" />
                </div>

                {/* Schedule — elegant typographic accent */}
                <p className="mt-12 text-center font-serif text-2xl italic text-coffee-bean/40 md:text-3xl">
                    {t("communityLifeSchedule")}
                </p>

                {/* Body text */}
                <p className="mx-auto mt-6 max-w-xl text-center leading-[1.8] text-coffee-bean md:leading-[1.9]">
                    {t("communityLifeText")}
                </p>
            </div>
        </section>
    );
}
