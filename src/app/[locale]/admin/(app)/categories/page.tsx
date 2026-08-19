"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, FolderBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { CategoriesTable } from "../../_components/categories/CategoriesTable";
import { CategoryFormSheet } from "../../_components/categories/CategoryFormSheet";
import { DeleteCategoryDialog } from "../../_components/categories/DeleteCategoryDialog";
import { useCategories } from "../../_features/categories/category.controller";
import type { CategoryFormValues } from "../../_features/categories/category.schema";
import type { Category } from "../../_features/categories/category.type";

export default function CategoriesAdminPage() {
  const t = useTranslations("admin.categories");
  const {
    categories,
    loading,
    loadFailed,
    create,
    update,
    remove,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useCategories();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setSheetOpen(true);
  }

  function submit(values: CategoryFormValues) {
    return editing ? update(editing._id, values) : create(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={FolderBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <CategoriesTable
        categories={categories}
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

      <CategoryFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={submit}
        category={editing}
      />

      <DeleteCategoryDialog
        category={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
