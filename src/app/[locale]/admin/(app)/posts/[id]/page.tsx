"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { PostEditor } from "../../../_components/posts/editor/PostEditor";
import { usePostEditor } from "../../../_features/posts/post.controller";

export default function EditPostAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("admin.posts");
  const { post, categories, themes, loading, loadFailed, createTheme, create, save, autosave } = usePostEditor(id);

  if (loading) return null;

  if (loadFailed || !post) {
    return (
      <p className="border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
        {t("loadError")}
      </p>
    );
  }

  return (
    <PostEditor
      mode="edit"
      post={post}
      categories={categories}
      themes={themes}
      onCreateTheme={createTheme}
      onCreate={create}
      onSave={save}
      onAutosave={autosave}
    />
  );
}
