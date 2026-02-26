import Image from "next/image";

export default function HeroBanner() {
    return (
        <>
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id="gradient-map-borgonha" colorInterpolationFilters="sRGB">
                        {/* Convert to grayscale first */}
                        <feColorMatrix
                            type="saturate"
                            values="0"
                            in="SourceGraphic"
                            result="gray"
                        />
                        {/* Remap luminosity: rich-mahogany → night-bordeaux → night-bordeaux-2/40 */}
                        <feComponentTransfer in="gray" result="mapped">
                            <feFuncR type="table" tableValues="0.24 0.32 0.76" />
                            <feFuncG type="table" tableValues="0.00 0.00 0.60" />
                            <feFuncB type="table" tableValues="0.03 0.08 0.64" />
                        </feComponentTransfer>
                    </filter>
                </defs>
            </svg>

            {/* Background Image with Gradient Map applied */}
            <div className="absolute inset-0" style={{ filter: "url(#gradient-map-borgonha)" }}>
                <Image
                    src="https://cappuccino.dzign-e.app/erelachappelle-assets/igreja-lachappelle.jpg"
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