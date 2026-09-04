import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type PeekColor = "gold" | "bordeaux" | "dark" | "light";
export type PeekPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface PeekRectangleProps {
    color?: PeekColor;
    position?: PeekPosition;
    className?: string;
    children: ReactNode;
}

const colorMap: Record<PeekColor, string> = {
    gold: "bg-toffee-brown",
    bordeaux: "bg-night-bordeaux-2",
    dark: "bg-carbon-black",
    light: "bg-dust-grey",
};

/*
 * A full-size rectangle behind the content, offset diagonally so it
 * "peeks" from one corner. The shift amount is 10-12 px.
 */
const positionMap: Record<PeekPosition, string> = {
    "top-left": "-translate-x-1.5 -translate-y-1.5 md:-translate-x-2 md:-translate-y-2",
    "top-right": "translate-x-1.5 -translate-y-1.5 md:translate-x-2 md:-translate-y-2",
    "bottom-left": "-translate-x-1.5 translate-y-1.5 md:-translate-x-2 md:translate-y-2",
    "bottom-right": "translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2",
};

/** Cycling helpers for lists — vary color & position per index */
const peekPositions: PeekPosition[] = ["top-right", "bottom-left", "top-left", "bottom-right"];
const peekColors: PeekColor[] = ["gold", "bordeaux", "dark", "light"];

export function getPeekProps(index: number) {
    return {
        position: peekPositions[index % peekPositions.length],
        color: peekColors[index % peekColors.length],
    } as const;
}

export function PeekRectangle({
    color = "gold",
    position = "top-right",
    className,
    children,
}: PeekRectangleProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Back rectangle — same size, offset diagonally */}
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 pointer-events-none",
                    colorMap[color],
                    positionMap[position]
                )}
            />
            {/* Content sits on top */}
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
}
