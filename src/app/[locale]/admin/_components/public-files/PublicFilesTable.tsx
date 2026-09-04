"use client";

import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { fr, pt, enUS } from "date-fns/locale";
import {
  AltArrowLeftBold,
  AltArrowRightBold,
  FileTextBold,
  PenNewSquareBoldDuotone,
  TrashBinTrashBoldDuotone,
} from "solar-icon-set";
import { Button } from "@/components/ui/button";
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
import { PAGE_SIZE } from "../../_features/public-files/public-file.controller";
import { localizedName, type PublicFile } from "../../_features/public-files/public-file.type";
import type { Locale } from "@/types/common";

const dateLocales = { fr, pt, en: enUS } as const;

const HEAD_CLASS = "h-11 px-4 font-semibold uppercase text-coffee-bean";
const SKELETON_CLASS = "bg-dust-grey";
const NAME_SKELETON_WIDTHS = ["w-32", "w-44", "w-40"];

type Props = {
  files: PublicFile[];
  loading: boolean;
  loadFailed: boolean;
  onAdd: () => void;
  onEdit: (file: PublicFile) => void;
  onDelete: (file: PublicFile) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function PublicFilesTable({
  files,
  loading,
  loadFailed,
  onAdd,
  onEdit,
  onDelete,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: Props) {
  const t = useTranslations("admin.publicFiles");
  const locale = useLocale() as Locale;

  function formatDate(date: string) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return format(parsed, "d MMM yyyy", { locale: dateLocales[locale] });
  }

  if (loadFailed) {
    return (
      <p
        className="border border-destructive/30 bg-destructive/5 p-4 text-destructive"
        role="alert"
      >
        {t("loadError")}
      </p>
    );
  }

  if (!loading && files.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <FileTextBold size={44} color="var(--toffee-brown)" />
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
            {/* Sem rótulo: é decorativo, o mesmo ícone se repete em toda linha. */}
            <TableHead className={`${HEAD_CLASS} w-11`} />
            <TableHead className={HEAD_CLASS}>{t("columnTitle")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnDocumentType")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnCreatedAt")}</TableHead>
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
                    <Skeleton className={`h-4 w-24 ${SKELETON_CLASS}`} />
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
            : files.map((file) => (
                <TableRow
                  key={file._id}
                  className="group border-dust-grey transition-colors hover:bg-toffee-brown/[0.06]"
                >
                  <TableCell className="px-4 py-3.5">
                    <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                      <FileTextBold size={16} color="var(--toffee-brown)" />
                    </span>
                  </TableCell>
                  <TableCell className="select-none px-4 py-3.5">
                    <span className="cursor-default font-serif text-carbon-black">
                      {localizedName(file.title, locale)}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                    {t(`documentType.${file.documentType}`)}
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                    {formatDate(file.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("edit")}
                        className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
                        onClick={() => onEdit(file)}
                      >
                        {/* className="size-*", não o prop `size`: o Button força pra 16px
                            qualquer <svg> sem classe size-*, e ganha do width/height inline. */}
                        <PenNewSquareBoldDuotone size={22} className="size-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("delete")}
                        className="size-9 text-coffee-bean hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(file)}
                      >
                        <TrashBinTrashBoldDuotone size={22} className="size-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>

        {/* Paginação por cursor não sabe o total de páginas sem uma query à parte — por
            isso não tem "página X de Y", só o que dá pra saber sem custo extra. */}
        {!loading && (
          <TableFooter className="border-t border-dust-grey bg-powder-petal/20 hover:bg-powder-petal/20">
            <TableRow className="border-dust-grey hover:bg-transparent">
              <TableCell className="px-4 py-3">
                <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                  <FileTextBold size={16} color="var(--toffee-brown)" />
                </span>
              </TableCell>
              <TableCell colSpan={3} className="px-4 py-3 font-normal text-coffee-bean/70">
                {t.rich("pageCount", {
                  count: files.length,
                  strong: (chunks) => <strong className="font-semibold text-carbon-black">{chunks}</strong>,
                })}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("previous")}
                    disabled={!hasPreviousPage}
                    className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown disabled:opacity-30"
                    onClick={onPreviousPage}
                  >
                    <AltArrowLeftBold size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("next")}
                    disabled={!hasNextPage}
                    className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown disabled:opacity-30"
                    onClick={onNextPage}
                  >
                    <AltArrowRightBold size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
