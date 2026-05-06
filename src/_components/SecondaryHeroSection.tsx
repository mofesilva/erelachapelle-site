import Image from "next/image";
import { CrossDivider } from "@/_components/CrossDivider";
import type { ComponentType, SVGProps } from "react";

type SecondaryHeroSectionProps = {
    title: string;
    description?: string;
    variant?: "title" | "quote";
    bgColor?: string;
    bgImage?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export function SecondaryHeroSection({
    title,
    description,
    variant = "title",
    bgColor = "bg-night-bordeaux-2",
    bgImage,
    icon: Icon,
}: SecondaryHeroSectionProps) {
    return (
        <section
            className={`relative pb-20 pt-40 md:pb-28 md:pt-48 min-h-[50svh] ${bgColor}`}
        >
            {bgImage && (
                <>
                    <Image
                        src={bgImage}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                        aria-hidden="true"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-night-bordeaux-2/80" />
                </>
            )}

            <div className="relative mx-auto max-w-4xl px-6 text-center">

                {Icon && (
                    <Icon className="mx-auto mb-4 h-10 w-10 text-parchment/70" aria-hidden="true" />
                )}

                {variant === "quote" ? (
                    <blockquote className="mt-8 font-serif text-2xl italic leading-relaxed text-parchment md:mt-10 md:text-3xl lg:text-4xl">
                        &ldquo;{title}&rdquo;
                    </blockquote>
                ) : (
                    <h1 className="mt-8 font-serif text-4xl font-bold text-parchment md:mt-10 md:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                )}

                {description && (
                    <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-powder-petal/60">
                        {description}
                    </p>
                )}

                <div className="mx-auto mt-8 flex items-center justify-center gap-2">
                    <div className="h-0.5 w-12 bg-toffee-brown/40" />
                    <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
                    <div className="h-0.5 w-12 bg-toffee-brown/40" />
                </div>
            </div>
        </section>
    );
}
