"use client";

import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import {
  AltArrowLeftBold,
  AltArrowRightBold,
  DocumentTextBold,
  PenNewSquareBoldDuotone,
  TrashBinTrashBoldDuotone,
} from "solar-icon-set";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "../../_features/posts/post.controller";
import { localizedName, postStatus, type Post } from "../../_features/posts/post.type";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;
const HEAD_CLASS = "h-11 px-4 font-semibold uppercase text-coffee-bean";
const SKELETON_CLASS = "bg-dust-grey";
const NAME_SKELETON_WIDTHS = ["w-32", "w-44", "w-40"];

const STATUS_VARIANT: Record<ReturnType<typeof postStatus>, string> = {
  draft: "bg-dust-grey text-coffee-bean",
  published: "bg-toffee-brown/12 text-toffee-brown",
  scheduled: "bg-powder-petal text-night-bordeaux-2",
};

type Props = {
  posts: Post[];
  loading: boolean;
  loadFailed: boolean;
  onAdd: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onTogglePublish: (post: Post) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function PostsTable({
  posts,
  loading,
  loadFailed,
  onAdd,
  onEdit,
  onDelete,
  onTogglePublish,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: Props) {
  const t = useTranslations("admin.posts");
  const locale = useLocale() as Locale;

  if (loadFailed) {
    return (
      <p className="border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
        {t("loadError")}
      </p>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <DocumentTextBold size={44} color="var(--toffee-brown)" />
        <p className="mt-5 font-serif text-carbon-black">{t("emptyTitle")}</p>
        <p className="mt-1.5 max-w-sm text-coffee-bean/70">{t("emptyDescription")}</p>
        <Button onClick={onAdd} className="mt-6 h-11 bg-toffee-brown px-5 hover:bg-olive-wood">
          {t("add")}
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-dust-grey">
      <Table>
        <TableHeader>
          <TableRow className="border-dust-grey bg-powder-petal/40 hover:bg-powder-petal/40">
            <TableHead className={`${HEAD_CLASS} w-11`} />
            <TableHead className={HEAD_CLASS}>{t("columnName")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnStatus")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnCreatedAt")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnPublish")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnPublishedAt")}</TableHead>
            <TableHead className={`${HEAD_CLASS} text-end`}>{t("columnActions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i} className="border-dust-grey hover:bg-transparent">
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`size-8 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 ${NAME_SKELETON_WIDTHS[i % 3]} ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-20 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-24 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-5 w-9 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-24 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : posts.map((post) => {
                const status = postStatus(post);
                return (
                  <TableRow
                    key={post._id}
                    className="group border-dust-grey transition-colors hover:bg-toffee-brown/[0.06]"
                  >
                    <TableCell className="px-4 py-3.5">
                      <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                        <DocumentTextBold size={16} color="var(--toffee-brown)" />
                      </span>
                    </TableCell>
                    <TableCell className="select-none px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => onEdit(post)}
                        className="cursor-pointer text-left font-serif text-carbon-black hover:text-toffee-brown"
                      >
                        {localizedName(post.title, locale)}
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Badge variant="secondary" className={STATUS_VARIANT[status]}>
                        {t(`status${status.charAt(0).toUpperCase()}${status.slice(1)}` as "statusDraft")}
                      </Badge>
                    </TableCell>
                    <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                      {format(new Date(post.createdAt), "d MMM yyyy", { locale: dateLocales[locale] })}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Switch checked={post.published} onCheckedChange={() => onTogglePublish(post)} />
                    </TableCell>
                    <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                      {post.published
                        ? format(new Date(post.publishedAt), "d MMM yyyy HH:mm", { locale: dateLocales[locale] })
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("edit")}
                          className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
                          onClick={() => onEdit(post)}
                        >
                          <PenNewSquareBoldDuotone size={22} className="size-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("delete")}
                          className="size-9 text-coffee-bean hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(post)}
                        >
                          <TrashBinTrashBoldDuotone size={22} className="size-6" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>

        {!loading && (
          <TableFooter className="border-t border-dust-grey bg-powder-petal/20 hover:bg-powder-petal/20">
            <TableRow className="border-dust-grey hover:bg-transparent">
              <TableCell className="px-4 py-3">
                <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                  <DocumentTextBold size={16} color="var(--toffee-brown)" />
                </span>
              </TableCell>
              <TableCell colSpan={5} className="px-4 py-3 font-normal text-coffee-bean/70">
                {t.rich("pageCount", {
                  count: posts.length,
                  strong: (chunks) => <strong className="font-semibold text-carbon-black">{chunks}</strong>,
                })}
              </TableCell>
              <TableCell className="px-4 py-3">
                {(hasPreviousPage || hasNextPage) && (
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={t("previous")}
                      className="size-9 border-dust-grey hover:border-toffee-brown hover:bg-toffee-brown/10"
                      disabled={!hasPreviousPage}
                      onClick={onPreviousPage}
                    >
                      <AltArrowLeftBold size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={t("next")}
                      className="size-9 border-dust-grey hover:border-toffee-brown hover:bg-toffee-brown/10"
                      disabled={!hasNextPage}
                      onClick={onNextPage}
                    >
                      <AltArrowRightBold size={16} />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
