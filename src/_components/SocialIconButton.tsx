import type { ReactNode } from "react";

type SocialIconButtonVariant = "bordeaux" | "parchment" | "gold" | "black";

interface SocialIconButtonProps {
    href: string;
    icon: ReactNode;
    variant: SocialIconButtonVariant;
    "aria-label": string;
}

const variants: Record<SocialIconButtonVariant, string> = {
    bordeaux:
        "bg-rich-mahogany text-night-parchmenthover:bg-night-bordeaux hover:text-parchment",
    parchment:
        "bg-parchment text-night-bordeaux-2 hover:bg-parchment/80 hover:text-night-bordeaux",
    gold: "bg-coffee-bean text-parchment hover:bg-olive-wood hover:text-night-bordeaux",
    black: "bg-carbon-black text-parchment hover:bg-carbon-black/80 hover:text-olive-wood",
};

const baseClasses =
    "flex h-10 w-10 items-center justify-center transition-all duration-300 hover:scale-110";

export function SocialIconButton({
    href,
    icon,
    variant,
    "aria-label": ariaLabel,
}: SocialIconButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {icon}
        </a>
    );
}
