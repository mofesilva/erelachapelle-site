"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, FileTextBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { PublicFilesTable } from "../../_components/public-files/PublicFilesTable";
import { PublicFileFormSheet } from "../../_components/public-files/PublicFileFormSheet";
import { DeletePublicFileDialog } from "../../_components/public-files/DeletePublicFileDialog";
import { usePublicFiles } from "../../_features/public-files/public-file.controller";
import type { PublicFileFormValues } from "../../_features/public-files/public-file.schema";
import type { PublicFile } from "../../_features/public-files/public-file.type";

export default function PublicFilesAdminPage() {
  const t = useTranslations("admin.publicFiles");
  const {
    files,
    loading,
    loadFailed,
    create,
    update,
    remove,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = usePublicFiles();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<PublicFile | null>(null);
  const [deleting, setDeleting] = useState<PublicFile | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(file: PublicFile) {
    setEditing(file);
    setSheetOpen(true);
  }

  function submit(values: PublicFileFormValues) {
    return editing ? update(editing._id, values) : create(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={FileTextBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <PublicFilesTable
        files={files}
        loading={loading}
        loadFailed={loadFailed}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setDeleting}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      <PublicFileFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={submit}
        publicFile={editing}
      />

      <DeletePublicFileDialog
        file={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
