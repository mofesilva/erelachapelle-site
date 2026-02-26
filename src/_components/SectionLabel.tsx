import { cn } from "@/lib/utils";

/* ── Colour variants ─────────────────────────────────────── */
const colorVariants = {
    gold: {
        iconColor: "var(--toffee-brown)",
        title: "text-toffee-brown",
        line: "bg-toffee-brown/30",
        diamond: "text-toffee-brown/50",
    },
    bordeaux: {
        iconColor: "var(--night-bordeaux-2)",
        title: "text-night-bordeaux-2",
        line: "bg-night-bordeaux-2/25",
        diamond: "text-night-bordeaux-2/40",
    },
    black: {
        iconColor: "var(--carbon-black)",
        title: "text-carbon-black",
        line: "bg-carbon-black/20",
        diamond: "text-carbon-black/30",
    },
    parchment: {
        iconColor: "var(--parchment)",
        title: "text-parchment",
        line: "bg-parchment/30",
        diamond: "text-parchment/40",
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
                    "font-serif text-3xl font-bold md:text-5xl",
                    c.title,
                )}
            >
                {title}
            </h2>

            {/* Diamond divider */}
            <div className={cn("flex items-center gap-3", a.divider)}>
                <span className={cn("h-px w-10", c.line)} />
                <span className={cn("text-[10px]", c.diamond)}>◆</span>
                <span className={cn("h-px w-10", c.line)} />
            </div>
        </div>
    );
}
