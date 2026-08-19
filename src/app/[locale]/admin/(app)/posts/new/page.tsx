"use client";

import { PostEditor } from "../../../_components/posts/editor/PostEditor";
import { usePostEditor } from "../../../_features/posts/post.controller";

export default function NewPostAdminPage() {
  const { post, categories, themes, loading, loadFailed, createTheme, create, save, autosave } = usePostEditor();

  if (loading || loadFailed) return null;

  return (
    <PostEditor
      mode="create"
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
