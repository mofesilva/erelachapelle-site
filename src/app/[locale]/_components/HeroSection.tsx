import { getTranslations, getLocale } from "next-intl/server";
import { AltArrowDownBold } from "solar-icon-set";
import type { Locale } from "@/types/common";
import HeroBanner from "./HeroBanner";
import { SplitButton } from "@/_components/SplitButton";
import { CrossDivider } from "@/_components/CrossDivider";
import { SocialIconButton } from "@/_components/SocialIconButton";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/_components/icons";
import { SITE_CONFIG } from "@/lib/constants";

export async function HeroSection() {
    const t = await getTranslations("homepage.hero");
    const locale = (await getLocale()) as Locale;

    return (
        <section
            className="relative overflow-hidden"
            style={{ height: "100dvh" }}
            aria-labelledby="hero-title"
        >
            <HeroBanner />
            <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-night-bordeaux-2/60 to-night-bordeaux-2"
                style={{ height: "50%" }}
            />
            <div
                className="relative flex flex-col justify-center pt-24 pb-16 md:items-center md:justify-center md:pt-[48px] md:pb-0"
                style={{ height: "100%" }}
            >
                <div className="mx-auto w-full max-w-7xl pt-4 px-4 md:px-8 lg:px-16 xl:px-4 text-left md:text-left">
                    <CrossDivider className="mb-2 md:mb-8 justify-start md:justify-start" />
                    <h1
                        id="hero-title"
                        className="font-serif font-bold text-white mx-auto md:mx-0 max-w-full md:max-w-[61.8%] "
                    >
                        {t("title")}
                    </h1>
                    <h6 className="mt-10 md:mt-6 text-white/85 tracking-wide mx-auto md:mx-0 max-w-full md:max-w-[50%]">
                        {t("subtitle")}
                    </h6>
                    <div className="mt-5 md:mt-10">
                        <SplitButton href={`/${locale}/about`}>
                            {t("cta")}
                        </SplitButton>
                    </div>
                    <div className="mt-6 md:mt-8 flex items-center gap-4 justify-start">
                        <SocialIconButton
                            href={SITE_CONFIG.socialMedia.facebook}
                            icon={<FacebookIcon />}
                            variant="gold"
                            aria-label="Facebook"
                        />
                        <SocialIconButton
                            href={SITE_CONFIG.socialMedia.instagram}
                            icon={<InstagramIcon />}
                            variant="gold"
                            aria-label="Instagram"
                        />
                        <SocialIconButton
                            href={SITE_CONFIG.socialMedia.tiktok}
                            icon={<TikTokIcon />}
                            variant="gold"
                            aria-label="TikTok"
                        />
                        <SocialIconButton
                            href={SITE_CONFIG.socialMedia.youtube}
                            icon={<YouTubeIcon />}
                            variant="gold"
                            aria-label="YouTube"
                        />
                    </div>
                </div>
            </div>
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
