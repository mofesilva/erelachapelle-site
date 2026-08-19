"use client";

import { useLocale, useTranslations } from "next-intl";
import { AlbumBold, PenNewSquareBoldDuotone, TrashBinTrashBoldDuotone } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { localizedName, type Album } from "../../_features/albums/album.type";
import type { Locale } from "@/types/common";

type Props = {
  album: Album;
  onOpen: (album: Album) => void;
  onEdit: (album: Album) => void;
  onDelete: (album: Album) => void;
};

export function AlbumCard({ album, onOpen, onEdit, onDelete }: Props) {
  const t = useTranslations("admin.albums");
  const locale = useLocale() as Locale;
  const cover = album.images[0];
  const title = localizedName(album.title, locale);

  return (
    <div className="group relative flex flex-col border border-dust-grey bg-white">
      <button
        type="button"
        onClick={() => onOpen(album)}
        className="flex aspect-video cursor-pointer items-center justify-center bg-powder-petal/30"
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- fonte externa (API), sem otimização do next/image aqui
          <img src={cover.url} alt={title} className="size-full object-cover" />
        ) : (
          <AlbumBold size={40} color="var(--toffee-brown)" />
        )}
      </button>

      <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("edit")}
          className="size-9 bg-white/90 text-coffee-bean hover:bg-toffee-brown/10"
          onClick={() => onEdit(album)}
        >
          <PenNewSquareBoldDuotone size={22} className="size-4.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("delete")}
          className="size-9 bg-white/90 text-coffee-bean hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(album)}
        >
          <TrashBinTrashBoldDuotone size={20} className="size-5" />
        </Button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(album)}
        className="flex cursor-pointer flex-col gap-1 px-3 py-2.5 text-left"
      >
        <span className="truncate font-serif text-carbon-black" title={title}>
          {title}
        </span>
        <span className="text-xs text-coffee-bean/60">
          {t("imageCount", { count: album.images.length })}
        </span>
      </button>
    </div>
  );
}
