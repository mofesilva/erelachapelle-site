"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCircleBold, UsersGroupRoundedBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { UsersTable } from "../../_components/users/UsersTable";
import { UserFormSheet } from "../../_components/users/UserFormSheet";
import { DeleteUserDialog } from "../../_components/users/DeleteUserDialog";
import { useUsers } from "../../_features/users/user.controller";
import type { UserFormValues } from "../../_features/users/user.schema";
import type { User } from "../../_features/users/user.type";

export default function UsersAdminPage() {
  const t = useTranslations("admin.users");
  const { users, loading, loadFailed, create, update, remove, toggleActive } = useUsers();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setSheetOpen(true);
  }

  function submit(values: UserFormValues) {
    return editing ? update(editing._id, values) : create(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={UsersGroupRoundedBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <UsersTable
        users={users}
        loading={loading}
        loadFailed={loadFailed}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setDeleting}
        onToggleActive={toggleActive}
      />

      <UserFormSheet open={sheetOpen} onOpenChange={setSheetOpen} onSubmit={submit} user={editing} />

      <DeleteUserDialog
        user={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
