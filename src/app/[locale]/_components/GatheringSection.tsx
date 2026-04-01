import { getTranslations, getLocale } from "next-intl/server";
import { getLocations } from "@/lib/data/locations";
import { getLocalizedContent } from "@/lib/utils";
import { getDirectionsUrl } from "@/lib/integrations/maps";
import type { Locale } from "@/types/common";
import Image from "next/image";
import { MapPointBoldDuotone, ClockCircleBoldDuotone, LetterBoldDuotone, ArrowRightBold } from "solar-icon-set";

export async function GatheringSection() {
    const t = await getTranslations("homepage.gathering");
    const locale = (await getLocale()) as Locale;
    const locations = getLocations();
    const location = locations[0];

    if (!location) return null;

    const directionsHref = getDirectionsUrl(
        location.coordinates.lat,
        location.coordinates.lng
    );

    return (
        <section className="relative min-h-150 md:min-h-175">
            {/* ── Full-bleed background image ── */}
            <Image
                src="https://erelachapelle.dzign-e.app/inside-church.png"
                alt={t("churchName")}
                fill
                className="object-cover"
                sizes="100vw"
                priority
            />
            <div className="absolute inset-0 bg-rich-mahogany/70" />
            <div className="absolute inset-0 bg-linear-to-t from-carbon-black/60 via-transparent to-carbon-black/30" />
            <div className="absolute inset-0 bg-linear-to-r from-carbon-black/40 via-transparent to-transparent" />
            <div className="relative flex min-h-150 items-end md:min-h-175">
                <div className="w-full pb-16 pt-24 md:pb-24">
                    <div className="mx-auto max-w-6xl px-6 md:px-10">
                        {/* Label */}
                        <div className="flex items-center gap-4">
                            <span className="h-px w-10 bg-powder-petal/30" />
                            <p className="font-bold uppercase tracking-[0.3em] text-powder-petal/50">
                                {t("label")}
                            </p>
                        </div>

                        {/* Church name */}
                        <h2 className="mt-5 max-w-2xl font-serif font-bold text-white">
                            {t("churchName")}
                        </h2>

                        {/* Gold accent */}
                        <div className="mt-6 flex items-center gap-2">
                            <div className="h-0.5 w-16 bg-toffee-brown" />
                            <div className="h-1 w-1 rotate-45 bg-toffee-brown" />
                        </div>

                        {/* Info row — icons on top, consistent sizing */}
                        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-0">
                            {/* Address */}
                            <div className="flex flex-col items-start sm:pr-10">
                                <MapPointBoldDuotone size={28} color="#fff" />
                                <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                                    {t("addressLabel")}
                                </p>
                                <address className="mt-2 not-italic text-base font-semibold leading-relaxed text-parchment">
                                    {location.address}
                                    <br />
                                    {location.postalCode} {location.city}
                                    <br />
                                    {location.country}
                                </address>
                            </div>

                            {/* Vertical divider */}
                            <div className="hidden w-px self-stretch bg-parchment/10 sm:block" />

                            {/* Schedule */}
                            <div className="flex flex-col items-start sm:px-10">
                                <ClockCircleBoldDuotone size={28} color="#fff" />
                                <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                                    {t("scheduleLabel")}
                                </p>
                                <p className="mt-2 text-base font-semibold text-parchment">
                                    {getLocalizedContent(location.worshipSchedule, locale)}
                                </p>
                            </div>

                            {/* Vertical divider */}
                            <div className="hidden w-px self-stretch bg-parchment/10 sm:block" />

                            {/* Contact email */}
                            {location.contactEmail && (
                                <div className="flex flex-col items-start sm:pl-10">
                                    <LetterBoldDuotone size={28} color="#fff" />
                                    <p className="mt-3 font-bold uppercase tracking-[0.2em] text-white">
                                        {t("contactLabel")}
                                    </p>
                                    <a
                                        href={`mailto:${location.contactEmail}`}
                                        className="mt-2 text-base font-semibold text-parchment underline decoration-parchment/30 underline-offset-4 transition-colors hover:text-toffee-brown hover:decoration-toffee-brown"
                                    >
                                        {location.contactEmail}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Directions — centered at the bottom */}
                        <div className="mt-14 flex justify-center">
                            <a
                                href={directionsHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn inline-flex items-stretch shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span className="flex items-center bg-toffee-brown px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 group-hover/btn:bg-olive-wood">
                                    {t("directions")}
                                </span>
                                <span className="flex items-center justify-center bg-olive-wood px-4 transition-colors duration-300 group-hover/btn:bg-coffee-bean">
                                    <ArrowRightBold size={16} color="#fff" className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
