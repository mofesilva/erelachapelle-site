import type { Metadata } from "next";

export const defaultOpenGraphImages: NonNullable<
    NonNullable<Metadata["openGraph"]>["images"]
> = [
        {
            url: "/images/og-banner.jpg",
            width: 1200,
            height: 630,
            alt: "Église Réformée Évangélique La Chapelle",
        },
    ];

export const baseOpenGraph: Metadata["openGraph"] = {
    type: "website",
    siteName: "Église Réformée Évangélique La Chapelle",
    locale: "fr_FR",
    alternateLocale: ["pt_BR", "en_US"],
    images: defaultOpenGraphImages,
};
