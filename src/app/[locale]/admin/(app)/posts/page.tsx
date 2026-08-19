"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AddCircleBold, DocumentTextBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../../_components/PageHeader";
import { PostsTable } from "../../_components/posts/PostsTable";
import { DeletePostDialog } from "../../_components/posts/DeletePostDialog";
import { usePosts } from "../../_features/posts/post.controller";
import type { Post } from "../../_features/posts/post.type";

export default function PostsAdminPage() {
  const t = useTranslations("admin.posts");
  const locale = useLocale();
  const router = useRouter();
  const {
    posts,
    loading,
    loadFailed,
    remove,
    togglePublish,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = usePosts();

  const [deleting, setDeleting] = useState<Post | null>(null);

  function openCreate() {
    router.push(`/${locale}/admin/posts/new`);
  }

  function openEdit(post: Post) {
    router.push(`/${locale}/admin/posts/${post._id}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader icon={DocumentTextBold} title={t("title")} subtitle={t("subtitle")}>
        <Button
          className="h-11 gap-2 bg-night-bordeaux-2 px-5 hover:bg-rich-mahogany"
          onClick={openCreate}
        >
          <AddCircleBold size={18} />
          {t("add")}
        </Button>
      </PageHeader>

      <PostsTable
        posts={posts}
        loading={loading}
        loadFailed={loadFailed}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setDeleting}
        onTogglePublish={togglePublish}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      <DeletePostDialog post={deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={remove} />
    </div>
  );
}
