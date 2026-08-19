"use client";

import { useTranslations } from "next-intl";
import { AlbumBold } from "solar-icon-set";
import { Skeleton } from "@/components/ui/skeleton";
import type { Album } from "../../_features/albums/album.type";
import { AlbumCard } from "./AlbumCard";

const SKELETON_CLASS = "bg-dust-grey";
const SKELETON_COUNT = 8;

type Props = {
  albums: Album[];
  loading: boolean;
  loadFailed: boolean;
  onOpen: (album: Album) => void;
  onEdit: (album: Album) => void;
  onDelete: (album: Album) => void;
};

export function AlbumsGrid({ albums, loading, loadFailed, onOpen, onEdit, onDelete }: Props) {
  const t = useTranslations("admin.albums");

  if (loadFailed) {
    return (
      <p className="border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
        {t("loadError")}
      </p>
    );
  }

  if (!loading && albums.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <AlbumBold size={44} color="var(--toffee-brown)" />
        <p className="mt-5 font-serif text-carbon-black">{t("emptyTitle")}</p>
        <p className="mt-1.5 max-w-sm text-coffee-bean/70">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {loading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="flex flex-col border border-dust-grey bg-white">
              <Skeleton className={`aspect-video ${SKELETON_CLASS}`} />
              <div className="flex flex-col gap-2 px-3 py-2.5">
                <Skeleton className={`h-4 w-3/4 ${SKELETON_CLASS}`} />
                <Skeleton className={`h-3 w-1/2 ${SKELETON_CLASS}`} />
              </div>
            </div>
          ))
        : albums.map((album) => (
            <AlbumCard key={album._id} album={album} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
          ))}
    </div>
  );
}
