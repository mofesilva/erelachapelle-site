"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeftBold, ArrowRightBold, CloseSquareBold } from "solar-icon-set";
import { getLocalizedContent } from "@/lib/utils";
import { resolveMediaAssetUrl } from "@/types/media-asset";
import type { MediaRef, MultilingualText } from "@/types/common";

interface AlbumGalleryProps {
  images: MediaRef[];
  albumTitle: MultilingualText;
  locale: "fr" | "pt" | "en";
}

export function AlbumGallery({ images, albumTitle, locale }: AlbumGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, close, showPrev, showNext]);

  function altFor(image: MediaRef) {
    return image.altText ? getLocalizedContent(image.altText, locale) : getLocalizedContent(albumTitle, locale);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-dust-grey"
          >
            <Image
              src={resolveMediaAssetUrl(image.url)}
              alt={altFor(image)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized
            />
          </button>
        ))}
      </div>

      {openIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-99999 flex items-center justify-center bg-carbon-black/90"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-6 top-6 cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              <CloseSquareBold size={32} />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 transition-colors hover:text-white md:left-8"
              >
                <ArrowLeftBold size={32} />
              </button>
            )}

            <div
              className="relative h-[80vh] w-[90vw] md:w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={resolveMediaAssetUrl(images[openIndex].url)}
                alt={altFor(images[openIndex])}
                fill
                className="object-contain"
                sizes="90vw"
                unoptimized
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 transition-colors hover:text-white md:right-8"
              >
                <ArrowRightBold size={32} />
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
