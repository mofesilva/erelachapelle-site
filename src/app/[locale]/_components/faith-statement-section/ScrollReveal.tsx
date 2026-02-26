"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

type Direction = "left" | "right";

interface ScrollRevealProps {
    children: ReactNode;
    from: Direction;
    className?: string;
    /** Max horizontal offset in pixels (default 96 = 6rem) */
    offset?: number;
}

/**
 * Scroll-driven reveal: opacity and translateX progress linearly
 * as the element travels from the bottom of the viewport to its
 * final resting position. Once fully revealed it stays put.
 */
export function ScrollReveal({
    children,
    from,
    className,
    offset = 96,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const rafId = useRef<number>(0);

    const update = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const windowH = window.innerHeight;

        // progress 0 → 1 as element goes from just entering bottom to 30% up the viewport
        const start = windowH;          // element top hits viewport bottom
        const end = windowH * 0.3;      // element top reaches 30% from top
        const raw = (start - rect.top) / (start - end);
        const progress = Math.min(1, Math.max(0, raw));

        const translateX = (1 - progress) * offset * (from === "left" ? -1 : 1);
        const opacity = progress;

        el.style.transform = `translate3d(${translateX}px, 0, 0)`;
        el.style.opacity = `${opacity}`;
    }, [from, offset]);

    useEffect(() => {
        // Run once on mount so initial state is correct
        update();

        const onScroll = () => {
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafId.current);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [update]);

    return (
        <div
            ref={ref}
            className={`will-change-[transform,opacity] ${className ?? ""}`}
            style={{ opacity: 0 }}
        >
            {children}
        </div>
    );
}
