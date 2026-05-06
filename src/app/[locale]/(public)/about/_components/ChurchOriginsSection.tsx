import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";

export async function ChurchOriginsSection() {
    const t = await getTranslations("about");

    const dates = t.raw("originsDates") as { year: string; label: string }[];

    return (
        <section className="bg-parchment pt-10 pb-20 lg:pt-20 lg:pb-60">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section header */}
                <div className="text-center">
                    <p className="font-bold uppercase tracking-[0.3em] text-toffee-brown/70">
                        {t("whoWeAre")}
                    </p>
                    <h2 className="mt-3 font-serif font-bold text-night-bordeaux-2">
                        {t("origins")}
                    </h2>
                    <CrossDivider variant="burgundy" className="mt-6 justify-center" />
                </div>

                {/* Intro paragraph */}
                <p className="mt-6 mb-28 leading-[1.8] md:w-2/3 mx-auto text-justify md:text-center text-coffee-bean md:leading-[1.9]">
                    {t("whoWeAreText")}
                </p>

                {/* Timeline */}
                <div className="mt-14">
                    {/* ── Desktop: horizontal timeline ── */}
                    <div className="hidden md:block">
                        {/* Top row — even indexes: label; odd indexes: year */}
                        <div className="grid grid-cols-3 items-end">
                            {dates.map(({ year, label }, index) => (
                                <div key={`top-${year}`} className="px-4 pb-6 text-center">
                                    {index % 2 === 0 ? (
                                        <p className="mx-auto w-2/3 leading-relaxed text-coffee-bean">
                                            {label}
                                        </p>
                                    ) : (
                                        <p className="mx-auto font-serif text-5xl font-bold leading-none text-toffee-brown/50">
                                            {year}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Centre line + diamond markers */}
                        <div className="relative grid grid-cols-3">
                            {/* Horizontal line */}
                            <div className="absolute top-1/2 inset-x-0 h-px -translate-y-1/2 bg-toffee-brown/25" />
                            {dates.map(({ year }) => (
                                <div
                                    key={`marker-${year}`}
                                    className="relative z-10 flex justify-center"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center bg-parchment">
                                        <div className="h-3 w-3 rotate-45 bg-toffee-brown" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom row — even indexes: year; odd indexes: label */}
                        <div className="grid grid-cols-3 items-start">
                            {dates.map(({ year, label }, index) => (
                                <div key={`bottom-${year}`} className="px-4 pt-6 text-center">
                                    {index % 2 === 0 ? (
                                        <p className="font-serif text-5xl font-bold leading-none text-toffee-brown/50">
                                            {year}
                                        </p>
                                    ) : (
                                        <p className="mx-auto w-2/3 leading-relaxed text-coffee-bean">
                                            {label}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Mobile: vertical timeline — centered line, alternating sides ── */}
                    <div className="relative md:hidden">
                        {/* Centered vertical line */}
                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-toffee-brown/25" />
                        <div className="flex flex-col gap-10">
                            {dates.map(({ year, label }, index) => {
                                const isRight = index % 2 === 0;
                                return (
                                    <div key={year} className="flex items-start">
                                        {/* Left half */}
                                        <div className="min-w-0 flex-1 pr-4 text-right">
                                            {!isRight && (
                                                <>
                                                    <p className="font-serif text-4xl font-bold leading-none text-toffee-brown/50">
                                                        {year}
                                                    </p>
                                                    <p className="mt-2 text-sm leading-relaxed text-coffee-bean">
                                                        {label}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Diamond — inline in flow, flex-none so both flex-1 sides are equal (center = 50%).
                                            pt-3 nudges diamond down to visually align with the year number cap-height. */}
                                        <div className="relative z-10 flex w-8 flex-none justify-center pt-3">
                                            <div className="h-3 w-3 rotate-45 bg-toffee-brown" />
                                        </div>

                                        {/* Right half */}
                                        <div className="min-w-0 flex-1 pl-4">
                                            {isRight && (
                                                <>
                                                    <p className="font-serif text-4xl font-bold leading-none text-toffee-brown/50">
                                                        {year}
                                                    </p>
                                                    <p className="mt-2 text-sm leading-relaxed text-coffee-bean">
                                                        {label}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main narrative */}
                <p className="mt-28 leading-[1.8] mx-auto text-justify md:w-2/3 md:text-center text-coffee-bean md:leading-[1.9]">
                    {t("originsText")}
                </p>
            </div>
        </section>
    );
}
