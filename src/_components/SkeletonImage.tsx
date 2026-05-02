"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SkeletonImageProps = ImageProps & {
    containerClassName?: string;
};

/**
 * Wraps next/image with a shimmer skeleton that fades out on load.
 * Drop-in replacement for <Image> inside <PeekRectangle>.
 *
 * When `fill` is true, the wrapper becomes `absolute inset-0` so it inherits
 * the dimensions from the nearest positioned ancestor (same semantics as fill).
 * When `fill` is false/undefined, the wrapper is `relative overflow-hidden`.
 */
export function SkeletonImage({
    containerClassName,
    className,
    onLoad,
    fill,
    ...props
}: SkeletonImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={cn(
                fill ? "absolute inset-0" : "relative overflow-hidden",
                containerClassName
            )}
        >
            {/* Shimmer overlay — visible until image loads */}
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 z-10 transition-opacity duration-500",
                    "bg-dust-grey",
                    loaded ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                <span
                    className="absolute inset-0 -translate-x-full animate-shimmer"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, var(--powder-petal) 50%, transparent 100%)",
                    }}
                />
            </div>

            <Image
                {...props}
                fill={fill}
                className={className}
                onLoad={(e) => {
                    setLoaded(true);
                    onLoad?.(e);
                }}
            />
        </div>
    );
}
