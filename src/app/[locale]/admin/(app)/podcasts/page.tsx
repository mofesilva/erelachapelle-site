"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, PodcastBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { PodcastsTable } from "../../_components/podcasts/PodcastsTable";
import { PodcastFormSheet } from "../../_components/podcasts/PodcastFormSheet";
import { DeletePodcastDialog } from "../../_components/podcasts/DeletePodcastDialog";
import { usePodcasts } from "../../_features/podcasts/podcast.controller";
import type { PodcastFormValues } from "../../_features/podcasts/podcast.schema";
import type { Podcast } from "../../_features/podcasts/podcast.type";

export default function PodcastsAdminPage() {
  const t = useTranslations("admin.podcasts");
  const {
    podcasts,
    loading,
    loadFailed,
    create,
    update,
    remove,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = usePodcasts();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Podcast | null>(null);
  const [deleting, setDeleting] = useState<Podcast | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(podcast: Podcast) {
    setEditing(podcast);
    setSheetOpen(true);
  }

  function submit(values: PodcastFormValues) {
    return editing ? update(editing._id, values) : create(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={PodcastBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <PodcastsTable
        podcasts={podcasts}
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

      <PodcastFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={submit}
        podcast={editing}
      />

      <DeletePodcastDialog
        podcast={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
