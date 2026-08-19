"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, MicrophoneBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { SermonsTable } from "../../_components/sermons/SermonsTable";
import { SermonFormSheet } from "../../_components/sermons/SermonFormSheet";
import { DeleteSermonDialog } from "../../_components/sermons/DeleteSermonDialog";
import { useSermons } from "../../_features/sermons/sermon.controller";
import type { SermonFormValues } from "../../_features/sermons/sermon.schema";
import type { Sermon } from "../../_features/sermons/sermon.type";

export default function SermonsAdminPage() {
  const t = useTranslations("admin.sermons");
  const {
    sermons,
    categories,
    themes,
    loading,
    loadFailed,
    create,
    update,
    remove,
    createTheme,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useSermons();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [deleting, setDeleting] = useState<Sermon | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(sermon: Sermon) {
    setEditing(sermon);
    setSheetOpen(true);
  }

  function submit(values: SermonFormValues) {
    return editing ? update(editing._id, values) : create(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={MicrophoneBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <SermonsTable
        sermons={sermons}
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

      <SermonFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={submit}
        sermon={editing}
        categories={categories}
        themes={themes}
        onCreateTheme={createTheme}
      />

      <DeleteSermonDialog
        sermon={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
