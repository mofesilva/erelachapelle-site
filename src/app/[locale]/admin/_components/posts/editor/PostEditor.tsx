"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AltArrowLeftBold, SettingsBold } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/admin-api";
import type { MultiSelectOption } from "../../MultiSelect";
import { RichTextEditor, useRichTextEditor } from "./RichTextEditor";
import { EditorToolbar } from "./EditorToolbar";
import { PostSettingsSheet } from "./PostSettingsSheet";
import { postFormSchema, type PostFormValues } from "../../../_features/posts/post.schema";
import { buildPostBody } from "../../../_features/posts/post.service";
import { localizedName, type Post } from "../../../_features/posts/post.type";
import { uploadMediaAsset } from "../../../_features/media-assets/media-asset.service";
import { useAdminAuth } from "../../../_lib/auth-context";
import type { Category } from "../../../_features/categories/category.type";
import type { Theme } from "../../../_features/themes/theme.type";
import type { Locale } from "@/types/common";

const AUTOSAVE_DELAY_MS = 2000;

const EMPTY_VALUES: PostFormValues = {
  title: { fr: "" },
  excerpt: { fr: "" },
  content: { fr: "" },
  author: "",
  categoryId: "",
  themeIds: [],
  tags: [],
  featuredImage: null,
  published: false,
  publishedAt: new Date(),
};

function valuesFromPost(post: Post): PostFormValues {
  return {
    title: { fr: post.title.fr },
    excerpt: { fr: post.excerpt.fr },
    content: { fr: post.content.fr },
    author: post.author,
    categoryId: post.category.id,
    themeIds: post.themes?.map((theme) => theme.id) ?? [],
    tags: post.tags ?? [],
    featuredImage: post.featuredImage ? { id: post.featuredImage.id, url: post.featuredImage.url } : null,
    published: post.published,
    publishedAt: new Date(post.publishedAt),
  };
}

type SaveState = "idle" | "saving" | "saved" | "error";

type Props = {
  mode: "create" | "edit";
  post: Post | null;
  categories: Category[];
  themes: Theme[];
  onCreateTheme: (name: string) => Promise<Theme>;
  onCreate: (values: PostFormValues) => Promise<Post>;
  onSave: (values: PostFormValues) => Promise<Post>;
  onAutosave: (patch: Partial<ReturnType<typeof buildPostBody>>) => Promise<void>;
};

export function PostEditor({ mode, post, categories, themes, onCreateTheme, onCreate, onSave, onAutosave }: Props) {
  const t = useTranslations("admin.posts");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, accessToken } = useAdminAuth();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: post ? valuesFromPost(post) : { ...EMPTY_VALUES, author: user?.name ?? "" },
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedSecondsAgo, setSavedSecondsAgo] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Snapshot do último corpo salvo — o autosave diffa contra isso pra mandar só os campos
  // alterados, em vez de reenviar o post inteiro a cada pausa de digitação.
  const lastSavedBodyRef = useRef<ReturnType<typeof buildPostBody> | null>(
    post ? buildPostBody(valuesFromPost(post), categories, themes) : null
  );
  const skipNextAutosaveRef = useRef(true);

  useEffect(() => {
    if (saveState !== "saved") return;
    setSavedSecondsAgo(0);
    const interval = setInterval(() => setSavedSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [saveState]);

  const watched = form.watch();

  useEffect(() => {
    // Autosave só existe pra um post que já tem `_id` (modo edição / já criado no create).
    // A primeira execução do watch é o load inicial do form — não é uma edição de verdade.
    if (mode !== "edit" || !post) return;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    const handle = setTimeout(async () => {
      const nextBody = buildPostBody(watched, categories, themes);
      const prevBody = lastSavedBodyRef.current;
      const patch: Partial<ReturnType<typeof buildPostBody>> = {};
      if (!prevBody || JSON.stringify(nextBody.title) !== JSON.stringify(prevBody.title)) patch.title = nextBody.title;
      if (!prevBody || JSON.stringify(nextBody.excerpt) !== JSON.stringify(prevBody.excerpt))
        patch.excerpt = nextBody.excerpt;
      if (!prevBody || JSON.stringify(nextBody.content) !== JSON.stringify(prevBody.content))
        patch.content = nextBody.content;
      if (!prevBody || nextBody.author !== prevBody.author) patch.author = nextBody.author;
      if (!prevBody || JSON.stringify(nextBody.category) !== JSON.stringify(prevBody.category))
        patch.category = nextBody.category;
      if (!prevBody || JSON.stringify(nextBody.themes) !== JSON.stringify(prevBody.themes))
        patch.themes = nextBody.themes;
      if (!prevBody || JSON.stringify(nextBody.tags) !== JSON.stringify(prevBody.tags)) patch.tags = nextBody.tags;
      if (!prevBody || JSON.stringify(nextBody.featuredImage) !== JSON.stringify(prevBody.featuredImage))
        patch.featuredImage = nextBody.featuredImage;
      if (!prevBody || nextBody.publishedAt !== prevBody.publishedAt) patch.publishedAt = nextBody.publishedAt;

      if (Object.keys(patch).length === 0) return;

      setSaveState("saving");
      try {
        await onAutosave(patch);
        lastSavedBodyRef.current = nextBody;
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watched)]);

  async function persist(values: PostFormValues) {
    const valid = await form.trigger();
    if (!valid) {
      setFormError(t("errorValidation"));
      return;
    }
    setSaveState("saving");
    setFormError(null);
    try {
      if (mode === "create") {
        const created = await onCreate(values);
        router.push(`/${locale}/admin/posts/${created._id}`);
        return;
      }
      const saved = await onSave(values);
      lastSavedBodyRef.current = buildPostBody(values, categories, themes);
      form.reset(valuesFromPost(saved));
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setFormError(err instanceof ApiError && err.status === 403 ? t("errorForbidden") : t("errorGeneric"));
    }
  }

  function handleSaveDraft() {
    return persist(form.getValues());
  }

  function handleTogglePublish() {
    const nextPublished = !form.getValues("published");
    form.setValue("published", nextPublished);
    return persist({ ...form.getValues(), published: nextPublished });
  }

  async function handleUploadInlineImage(file: File): Promise<string> {
    if (!accessToken) throw new Error("Sessão ausente");
    const asset = await uploadMediaAsset(file, accessToken);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    return asset.url.startsWith("/") ? `${API_URL}${asset.url}` : asset.url;
  }

  async function handleCreateTheme(name: string): Promise<MultiSelectOption> {
    const created = await onCreateTheme(name);
    return { id: created._id, label: localizedName(created.name, locale) };
  }

  const { editor, handleImageUpload, handleAddYoutube } = useRichTextEditor({
    content: form.watch("content.fr"),
    onChange: (html) => form.setValue("content.fr", html, { shouldDirty: true }),
    placeholder: t("contentPlaceholder"),
    onUploadImage: handleUploadInlineImage,
  });

  const published = form.watch("published");
  const categoryOptions = categories.map((c) => ({ id: c._id, label: localizedName(c.name, locale) }));
  const themeOptions = themes.map((th) => ({ id: th._id, label: localizedName(th.name, locale) }));

  return (
    // `-m-4` cancela o padding do layout do admin ((app)/layout.tsx tem `p-4` em toda página) —
    // sem isso a barra sticky e as bordas ficavam com uma margem visível em vez de ir até a
    // borda real da área de conteúdo. `p-4` de volta no filho de baixo recompõe o respiro só
    // onde ainda faz sentido ter (fora da barra sticky).
    <div className="-m-4 flex flex-col">
      {/* Um único bloco sticky: barra de ações + toolbar de formatação ficam presas no topo
          juntas, acima de título/subtítulo/corpo — nada da área de escrita passa por cima. */}
      <div className="sticky top-0 z-20 flex flex-col bg-parchment">
        <div className="flex items-center justify-between gap-4 border-b border-dust-grey px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            className="gap-1.5 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
            onClick={() => router.push(`/${locale}/admin/posts`)}
          >
            <AltArrowLeftBold size={16} />
            {t("back")}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-coffee-bean/60">
              {saveState === "saving" && t("saving")}
              {saveState === "saved" && t("savedAgo", { seconds: savedSecondsAgo })}
              {saveState === "error" && <span className="text-destructive">{t("errorGeneric")}</span>}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("settingsTitle")}
              className="size-10 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsBold size={20} />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-dust-grey"
              onClick={handleSaveDraft}
              disabled={saveState === "saving"}
            >
              {t("saveDraft")}
            </Button>
            <Button
              type="button"
              className="h-10 bg-night-bordeaux-2 hover:bg-rich-mahogany"
              onClick={handleTogglePublish}
              disabled={saveState === "saving"}
            >
              {published ? t("unpublish") : t("publish")}
            </Button>
          </div>
        </div>

        {editor && (
          // Borda de ponta a ponta (igual à da barra de ações acima); o grupo de ícones fica
          // centralizado no meio dessa barra inteira, não alinhado à coluna de título/corpo.
          <div className="flex justify-center border-b border-dust-grey">
            <EditorToolbar editor={editor} onUploadImage={handleImageUpload} onAddYoutube={handleAddYoutube} />
          </div>
        )}
      </div>

      {formError && (
        <p className="mx-4 mt-4 border border-destructive/30 bg-destructive/5 p-3 text-destructive" role="alert">
          {formError}
        </p>
      )}

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 pt-6 pb-12">
        <Input
          {...form.register("title.fr")}
          placeholder={t("titlePlaceholder")}
          // Input/Textarea do shadcn têm `md:text-sm` embutido: em telas ≥768px essa variante
          // vence um `text-4xl` sem prefixo (é mais específica na cascata), então o tamanho
          // grande precisa ser repetido com `md:` pra não ser sobrescrito no desktop.
          className="h-auto border-0 px-0 font-serif text-4xl md:text-4xl text-carbon-black shadow-none placeholder:text-coffee-bean/30 focus-visible:ring-0"
        />

        <Textarea
          {...form.register("excerpt.fr")}
          placeholder={t("excerptPlaceholder")}
          rows={1}
          // `min-h-16` do Textarea base sobra bem mais que uma linha de text-xl — sem
          // zerar aqui, fica uma faixa vazia entre o resumo e o corpo do texto.
          className="min-h-0 resize-none border-0 px-0 py-0 text-xl md:text-xl text-coffee-bean/60 shadow-none placeholder:text-coffee-bean/30 focus-visible:ring-0"
        />

        {editor && <RichTextEditor editor={editor} />}
      </div>

      <PostSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        author={form.watch("author")}
        onAuthorChange={(value) => form.setValue("author", value, { shouldDirty: true })}
        categoryId={form.watch("categoryId")}
        onCategoryChange={(value) => form.setValue("categoryId", value, { shouldDirty: true })}
        categoryOptions={categoryOptions}
        themeIds={form.watch("themeIds")}
        onThemeIdsChange={(ids) => form.setValue("themeIds", ids, { shouldDirty: true })}
        themeOptions={themeOptions}
        onCreateTheme={handleCreateTheme}
        tags={form.watch("tags")}
        onTagsChange={(tags) => form.setValue("tags", tags, { shouldDirty: true })}
        featuredImage={form.watch("featuredImage")}
        onFeaturedImageChange={(value) => form.setValue("featuredImage", value, { shouldDirty: true })}
        publishedAt={form.watch("publishedAt")}
        onPublishedAtChange={(date) => form.setValue("publishedAt", date, { shouldDirty: true })}
      />
    </div>
  );
}
