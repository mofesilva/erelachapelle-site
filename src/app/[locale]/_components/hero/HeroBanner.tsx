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
                        {/* Remap luminosity: shadows → dark borgonha, highlights → light borgonha/rose */}
                        <feComponentTransfer in="gray" result="mapped">
                            <feFuncR type="table" tableValues="0.12 0.42 0.78" />
                            <feFuncG type="table" tableValues="0.05 0.18 0.38" />
                            <feFuncB type="table" tableValues="0.08 0.22 0.42" />
                        </feComponentTransfer>
                    </filter>
                </defs>
            </svg>

            {/* Background Image with Gradient Map applied */}
            <div className="absolute inset-0" style={{ filter: "url(#gradient-map-borgonha)" }}>
                <Image
                    src="/images/hero-church.jpg"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div></>
    );
}