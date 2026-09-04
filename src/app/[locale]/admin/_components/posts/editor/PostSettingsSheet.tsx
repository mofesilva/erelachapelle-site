"use client";

import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "../../DateTimePicker";
import { MultiSelect, type MultiSelectOption } from "../../MultiSelect";
import { FeaturedImageField } from "./FeaturedImageField";
import { TagsInput } from "./TagsInput";
import { POST_TYPES, type PostType } from "../../../_features/posts/post.type";

type Value = { id: string; url: string } | null;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: string;
  onAuthorChange: (value: string) => void;
  postType: PostType;
  onPostTypeChange: (value: PostType) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: MultiSelectOption[];
  themeIds: string[];
  onThemeIdsChange: (ids: string[]) => void;
  themeOptions: MultiSelectOption[];
  onCreateTheme: (name: string) => Promise<MultiSelectOption>;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  featuredImage: Value;
  onFeaturedImageChange: (value: Value) => void;
  publishedAt: Date;
  onPublishedAtChange: (date: Date) => void;
};

/**
 * Painel de metadados, à parte da tela de escrita (estilo Substack): a área principal do
 * editor fica só com título/subtítulo/corpo; autor, categoria, temas, tags, imagem de capa
 * e data de publicação vivem aqui, abertos pelo ícone de configurações na barra superior.
 */
export function PostSettingsSheet({
  open,
  onOpenChange,
  author,
  onAuthorChange,
  postType,
  onPostTypeChange,
  categoryId,
  onCategoryChange,
  categoryOptions,
  themeIds,
  onThemeIdsChange,
  themeOptions,
  onCreateTheme,
  tags,
  onTagsChange,
  featuredImage,
  onFeaturedImageChange,
  publishedAt,
  onPublishedAtChange,
}: Props) {
  const t = useTranslations("admin.posts");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto bg-parchment sm:max-w-md">
        <SheetHeader className="border-b border-dust-grey">
          <SheetTitle className="font-serif text-h6 text-carbon-black">{t("settingsTitle")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("featuredImageLabel")}</label>
            <FeaturedImageField value={featuredImage} onChange={onFeaturedImageChange} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("authorLabel")}</label>
            <Input
              value={author}
              onChange={(e) => onAuthorChange(e.target.value)}
              className="h-11 border-dust-grey bg-white focus-visible:border-toffee-brown focus-visible:ring-toffee-brown/25"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("postTypeLabel")}</label>
            <Select value={postType} onValueChange={(value) => onPostTypeChange(value as PostType)}>
              <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                <SelectValue placeholder={t("postTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent className="border-dust-grey bg-parchment">
                {POST_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-coffee-bean/60">{t(`typeHints.${postType}`)}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("categoryLabel")}</label>
            <Select value={categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11 w-full border-dust-grey bg-white">
                <SelectValue placeholder={t("categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="border-dust-grey bg-parchment">
                {categoryOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("themeLabel")}</label>
            <MultiSelect
              options={themeOptions}
              value={themeIds}
              onChange={onThemeIdsChange}
              placeholder={t("themePlaceholder")}
              searchPlaceholder={t("searchPlaceholder")}
              emptyLabel={t("noOptions")}
              onCreate={onCreateTheme}
              createLabel={(name) => t("createThemeOption", { name })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("tagsLabel")}</label>
            <TagsInput value={tags} onChange={onTagsChange} placeholder={t("tagsPlaceholder")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-bean">{t("publishedAtLabel")}</label>
            <DateTimePicker
              value={publishedAt}
              onChange={(date) => date && onPublishedAtChange(date)}
              placeholder={t("dateTimePlaceholder")}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
