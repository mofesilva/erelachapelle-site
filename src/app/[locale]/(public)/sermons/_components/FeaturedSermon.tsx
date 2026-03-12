import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { VideocameraBoldDuotone, PlayBold } from "solar-icon-set";
import { SectionLabel } from "@/_components/SectionLabel";
import { SplitButton } from "@/_components/SplitButton";
import { getRecentSermons } from "@/lib/sermons";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import { PeekRectangle } from "@/_components/PeekRectangle";

export async function FeaturedSermon() {
    const t = await getTranslations("sermons");
    const locale = (await getLocale()) as Locale;
    const [sermon] = await getRecentSermons(1);

    if (!sermon) return null;

    return (
        <section className="bg-parchment py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <SectionLabel
                    icon={VideocameraBoldDuotone}
                    title={t("latestSermon")}
                    color="gold"
                />

                <div className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
                    {/* Thumbnail */}
                    <PeekRectangle color="gold" position="bottom-right">
                        <div className="group relative aspect-video overflow-hidden shadow-lg">
                            <Image
                                src={getYouTubeThumbnailUrl(sermon.youtubeVideoId)}
                                alt={getLocalizedContent(sermon.title, locale)}
                                width={640}
                                height={360}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-night-bordeaux-2/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="flex h-16 w-16 items-center justify-center bg-white/90 shadow-lg">
                                    <PlayBold size={28} color="var(--night-bordeaux-2)" />
                                </div>
                            </div>
                        </div>
                    </PeekRectangle>

                    {/* Info */}
                    <div>
                        <p className="font-bold uppercase tracking-[0.2em] text-toffee-brown">
                            {formatDate(sermon.date, locale)} · {sermon.preacher}
                        </p>

                        <h3 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                            {getLocalizedContent(sermon.title, locale)}
                        </h3>

                        {sermon.description && (
                            <p className="mt-4 leading-relaxed text-coffee-bean/80">
                                {getLocalizedContent(sermon.description, locale)}
                            </p>
                        )}

                        {/* Badges */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            {sermon.series && (
                                <p className="border border-toffee-brown/30 px-3 py-0.5 text-coffee-bean/70">
                                    {sermon.series}
                                </p>
                            )}
                            {sermon.biblicalReference && (
                                <p className="border border-dust-grey px-3 py-0.5 text-coffee-bean/70">
                                    {sermon.biblicalReference.book}{" "}
                                    {sermon.biblicalReference.chapter}
                                    {sermon.biblicalReference.verses &&
                                        `:${sermon.biblicalReference.verses}`}
                                </p>
                            )}
                        </div>

                        <div className="mt-8">
                            <SplitButton
                                href={`/${locale}/sermons/${sermon.slug}`}
                                variant="burgundy"
                            >
                                {t("watchNow")}
                            </SplitButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
