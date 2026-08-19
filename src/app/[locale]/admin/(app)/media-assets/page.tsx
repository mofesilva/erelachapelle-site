"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GalleryWideBold } from "solar-icon-set";
import { PageHeader } from "../../_components/PageHeader";
import { MediaUploadDropzone } from "../../_components/media-assets/MediaUploadDropzone";
import { MediaAssetsToolbar } from "../../_components/media-assets/MediaAssetsToolbar";
import { MediaAssetsGrid } from "../../_components/media-assets/MediaAssetsGrid";
import { DeleteMediaAssetDialog } from "../../_components/media-assets/DeleteMediaAssetDialog";
import { useMediaAssets } from "../../_features/media-assets/media-asset.controller";
import type { MediaAsset } from "../../_features/media-assets/media-asset.type";

export default function MediaAssetsAdminPage() {
  const t = useTranslations("admin.mediaAssets");
  const {
    assets,
    loading,
    loadFailed,
    uploads,
    uploadFiles,
    dismissUpload,
    remove,
    fileType,
    setFilters,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useMediaAssets();

  const [deleting, setDeleting] = useState<MediaAsset | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={GalleryWideBold} title={t("title")} subtitle={t("subtitle")} />

      <MediaUploadDropzone uploads={uploads} onUpload={uploadFiles} onDismissUpload={dismissUpload} />

      <MediaAssetsToolbar fileType={fileType} onChange={setFilters} />

      <MediaAssetsGrid
        assets={assets}
        loading={loading}
        loadFailed={loadFailed}
        onDelete={setDeleting}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      <DeleteMediaAssetDialog
        asset={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
