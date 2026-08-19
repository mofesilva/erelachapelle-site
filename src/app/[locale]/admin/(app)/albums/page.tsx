"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, AlbumBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { AlbumsGrid } from "../../_components/albums/AlbumsGrid";
import { AlbumDetail } from "../../_components/albums/AlbumDetail";
import { AlbumFormSheet } from "../../_components/albums/AlbumFormSheet";
import { DeleteAlbumDialog } from "../../_components/albums/DeleteAlbumDialog";
import { AddImagesToAlbumDialog } from "../../_components/albums/AddImagesToAlbumDialog";
import { useAlbums } from "../../_features/albums/album.controller";
import type { AlbumFormValues } from "../../_features/albums/album.schema";
import type { Album } from "../../_features/albums/album.type";

export default function AlbumsAdminPage() {
  const t = useTranslations("admin.albums");
  const { albums, loading, loadFailed, create, updateMetadata, remove, addImages, removeImage } = useAlbums();

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState<Album | null>(null);
  const [addImagesOpen, setAddImagesOpen] = useState(false);

  // Mantém a tela de detalhe sincronizada sempre que a lista é rebuscada (edição de
  // metadados, adição/remoção de imagem, exclusão) — se o álbum aberto sumiu da lista
  // (foi excluído), volta pra grid em vez de ficar com uma referência obsoleta.
  useEffect(() => {
    if (!selectedAlbum) return;
    const fresh = albums.find((album) => album._id === selectedAlbum._id);
    setSelectedAlbum(fresh ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albums]);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(album: Album) {
    setEditing(album);
    setSheetOpen(true);
  }

  function submit(values: AlbumFormValues) {
    return editing ? updateMetadata(editing._id, values) : create(values);
  }

  async function handleDelete(id: string) {
    await remove(id);
    if (selectedAlbum?._id === id) setSelectedAlbum(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {selectedAlbum ? (
        <AlbumDetail
          album={selectedAlbum}
          onBack={() => setSelectedAlbum(null)}
          onEdit={openEdit}
          onAddImages={() => setAddImagesOpen(true)}
          onRemoveImage={(imageId) => removeImage(selectedAlbum, imageId)}
        />
      ) : (
        <>
          <PageHeader icon={AlbumBold} title={t("title")} subtitle={t("subtitle")}>
            <Button
              className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
              onClick={openCreate}
            >
              <AddCircleBold size={18} />
              {t("add")}
            </Button>
          </PageHeader>

          <AlbumsGrid
            albums={albums}
            loading={loading}
            loadFailed={loadFailed}
            onOpen={setSelectedAlbum}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        </>
      )}

      <AlbumFormSheet open={sheetOpen} onOpenChange={setSheetOpen} onSubmit={submit} album={editing} />

      <DeleteAlbumDialog
        album={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />

      <AddImagesToAlbumDialog
        open={addImagesOpen}
        onOpenChange={setAddImagesOpen}
        album={selectedAlbum}
        onConfirm={addImages}
      />
    </div>
  );
}
