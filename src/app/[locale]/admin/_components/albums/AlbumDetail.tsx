"use client";

import { useLocale, useTranslations } from "next-intl";
import { AddCircleBold, AltArrowLeftBold, GalleryBold, PenNewSquareBoldDuotone, TrashBinTrashBoldDuotone } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { localizedName, type Album } from "../../_features/albums/album.type";
import type { Locale } from "@/types/common";

type Props = {
  album: Album;
  onBack: () => void;
  onEdit: (album: Album) => void;
  onAddImages: () => void;
  onRemoveImage: (imageId: string) => void;
};

export function AlbumDetail({ album, onBack, onEdit, onAddImages, onRemoveImage }: Props) {
  const t = useTranslations("admin.albums");
  const locale = useLocale() as Locale;
  const title = localizedName(album.title, locale);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="h-9 w-fit gap-1.5 px-2 text-coffee-bean hover:bg-toffee-brown/10"
          onClick={onBack}
        >
          <AltArrowLeftBold size={16} />
          {t("backToAlbums")}
        </Button>

        <div className="flex items-end justify-between gap-4 border-b border-dust-grey pb-5">
          <div>
            <h1 className="font-serif text-h5 text-carbon-black">{title}</h1>
            <p className="text-sm text-coffee-bean/70">{t("imageCount", { count: album.images.length })}</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-11 gap-2 border-dust-grey text-coffee-bean hover:border-toffee-brown hover:bg-toffee-brown/10"
              onClick={() => onEdit(album)}
            >
              <PenNewSquareBoldDuotone size={20} />
              {t("edit")}
            </Button>
            <Button
              className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
              onClick={onAddImages}
            >
              <AddCircleBold size={18} />
              {t("addImages")}
            </Button>
          </div>
        </div>
      </div>

      {album.images.length === 0 ? (
        <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
          <GalleryBold size={44} color="var(--toffee-brown)" />
          <p className="mt-5 font-serif text-carbon-black">{t("detailEmptyTitle")}</p>
          <p className="mt-1.5 max-w-sm text-coffee-bean/70">{t("detailEmptyDescription")}</p>
          <Button className="mt-6 h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany" onClick={onAddImages}>
            <AddCircleBold size={18} />
            {t("addImages")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {album.images.map((image) => (
            <div key={image.id} className="group relative flex flex-col border border-dust-grey bg-white">
              <div className="flex aspect-video items-center justify-center bg-powder-petal/30">
                {/* eslint-disable-next-line @next/next/no-img-element -- fonte externa (API), sem otimização do next/image aqui */}
                <img
                  src={image.url}
                  alt={image.altText ? localizedName(image.altText, locale) : title}
                  className="size-full object-cover"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label={t("removeImage")}
                className="absolute right-2 top-2 size-9 bg-white/90 text-coffee-bean opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                onClick={() => onRemoveImage(image.id)}
              >
                <TrashBinTrashBoldDuotone size={20} className="size-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
