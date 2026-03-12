import Image from "next/image";

export default function HeroBanner() {
    return (
        <>


            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://cappuccino.dzign-e.app/erelachappelle-assets/igreja-lachappelle-hero-banner-2.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div>

            {/* Desaturation overlay: rich-mahogany at 30% to soften contrast */}
            <div className="absolute inset-0 bg-rich-mahogany/30" />
        </>
    );
}