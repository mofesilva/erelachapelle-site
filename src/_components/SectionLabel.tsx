import { cn } from "@/lib/utils";
import { DiamondDivider } from "@/_components/DiamondDivider";

/* ── Colour variants ─────────────────────────────────────── */
const colorVariants = {
    gold: {
        iconColor: "var(--toffee-brown)",
        title: "text-toffee-brown",
    },
    bordeaux: {
        iconColor: "var(--night-bordeaux-2)",
        title: "text-night-bordeaux-2",
    },
    black: {
        iconColor: "var(--carbon-black)",
        title: "text-carbon-black",
    },
    parchment: {
        iconColor: "var(--parchment)",
        title: "text-parchment",
    },
} as const;

/* ── Alignment variants ───────────────────────────────────── */
const alignVariants = {
    center: {
        wrapper: "items-center text-center",
        divider: "justify-center",
    },
    start: {
        wrapper: "items-start text-left",
        divider: "justify-start",
    },
    end: {
        wrapper: "items-end text-right",
        divider: "justify-end",
    },
} as const;

/* ── Props ────────────────────────────────────────────────── */
interface SectionLabelProps {
    /** Solar Icon Set duotone component (e.g. `CalendarBoldDuotone`) */
    icon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
    /** Section title */
    title: string;
    /** Colour scheme */
    color?: keyof typeof colorVariants;
    /** Horizontal alignment */
    align?: keyof typeof alignVariants;
    /** Additional classes on wrapper */
    className?: string;
}

export function SectionLabel({
    icon: Icon,
    title,
    color = "gold",
    align = "center",
    className,
}: SectionLabelProps) {
    const c = colorVariants[color];
    const a = alignVariants[align];

    return (
        <div className={cn("flex w-full flex-col gap-4", a.wrapper, className)}>
            {/* Icon */}
            {Icon && (
                <Icon size={36} color={c.iconColor} />
            )}

            {/* Title */}
            <h2
                className={cn(
                    "font-serif font-bold",
                    c.title,
                )}
            >
                {title}
            </h2>

            {/* Diamond divider */}
            <DiamondDivider variant={color} className={a.divider} />
        </div>
    );
}
