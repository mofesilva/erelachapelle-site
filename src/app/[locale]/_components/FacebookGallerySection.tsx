import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SplitButton } from "@/_components/SplitButton";
import { SectionLabel } from "@/_components/SectionLabel";
import { getAllPagePhotos } from "@/lib/integrations/facebook";
import { SITE_CONFIG } from "@/lib/constants";
import { GalleryBoldDuotone } from "solar-icon-set";

export async function FacebookGallerySection() {
    const t = await getTranslations("homepage.gallery");
    const photos = await getAllPagePhotos();

    if (photos.length === 0) return null;

    return (
        <section className="bg-parchment pt-8 pb-24 md:py-32">
            {/* Section separator */}
            <div className="mx-auto mb-20 md:mb-24 flex items-center justify-center gap-4 max-w-xs">
                <span className="h-px flex-1 bg-toffee-brown/15" />
                <span className="text-toffee-brown/25 text-[10px]">✦</span>
                <span className="h-px flex-1 bg-toffee-brown/15" />
            </div>

            {/* Centered header */}
            <div className="mx-auto max-w-5xl px-6">
                <SectionLabel icon={GalleryBoldDuotone} title={t("title")} />
            </div>

            {/* Horizontal scrollable photo row */}
            <div
                className="mt-12 md:mt-14 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 md:px-12 scrollbar-hide"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Left spacer for centering effect on wide screens */}
                <div className="shrink-0 w-0 md:w-[calc((100vw-80rem)/2)]" aria-hidden="true" />

                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="relative shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 snap-center rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(61,0,8,0.10)] hover:scale-[1.02]"
                    >
                        <Image
                            src={photo.imageUrl}
                            alt={photo.alt || t("title")}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                            loading="lazy"
                            unoptimized
                        />
                        {/* Subtle vignette overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>
                ))}

                {/* Right spacer */}
                <div className="shrink-0 w-0 md:w-[calc((100vw-80rem)/2)]" aria-hidden="true" />
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
                <SplitButton
                    href={`${SITE_CONFIG.socialMedia.facebook}photos`}
                    variant="burgundy"
                    external
                >
                    {t("cta")}
                </SplitButton>
            </div>
        </section>
    );
}
