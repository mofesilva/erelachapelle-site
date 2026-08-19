"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  AltArrowLeftBold,
  AltArrowRightBold,
  FolderBold,
  FolderOpenBold,
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
import { formatDate } from "@/lib/utils";
import { PAGE_SIZE } from "../../_features/categories/category.controller";
import { localizedName, type Category } from "../../_features/categories/category.type";
import type { Locale } from "@/types/common";

const HEAD_CLASS = "h-11 px-4 font-semibold uppercase text-coffee-bean";
// bg-accent, o padrão do Skeleton do shadcn, resolve pro toffee-brown da marca nesse
// projeto — forte demais pra um placeholder de carregamento. Um cinza neutro da própria
// paleta (o mesmo usado nas bordas) é o que se espera de um skeleton.
const SKELETON_CLASS = "bg-dust-grey";
// Larguras alternando por linha só pra não parecer uma grade artificial — puramente estético.
const NAME_SKELETON_WIDTHS = ["w-32", "w-44", "w-40"];

type Props = {
  categories: Category[];
  loading: boolean;
  loadFailed: boolean;
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function CategoriesTable({
  categories,
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
  const t = useTranslations("admin.categories");
  const locale = useLocale() as Locale;

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

  if (!loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <FolderOpenBold size={44} color="var(--toffee-brown)" />
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
            <TableHead className={HEAD_CLASS}>{t("columnName")}</TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnSlug")}</TableHead>
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
                    <Skeleton className={`h-4 w-28 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : categories.map((category) => (
                <TableRow
                  key={category._id}
                  className="group border-dust-grey transition-colors hover:bg-toffee-brown/[0.06]"
                >
                  <TableCell className="px-4 py-3.5">
                    <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                      <FolderBold size={16} color="var(--toffee-brown)" />
                    </span>
                  </TableCell>
                  <TableCell className="select-none px-4 py-3.5">
                    <span className="cursor-default font-serif text-carbon-black">
                      {localizedName(category.name, locale)}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                    {category.slug}
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/60">
                    {formatDate(category.createdAt, locale)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("edit")}
                        className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
                        onClick={() => onEdit(category)}
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
                        onClick={() => onDelete(category)}
                      >
                        <TrashBinTrashBoldDuotone size={22} className="size-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>

        {/* TableFooter/TableCell em vez de uma div solta embaixo: assim o ícone e o texto
            caem exatamente nas mesmas colunas das linhas, porque é o próprio motor de
            tabela do navegador alinhando — não margens calculadas no olho. Só aparece com
            dado de verdade carregado, pra não mostrar uma contagem de placeholder. */}
        {!loading && (
          <TableFooter className="border-t border-dust-grey bg-powder-petal/20 hover:bg-powder-petal/20">
            <TableRow className="border-dust-grey hover:bg-transparent">
              <TableCell className="px-4 py-3">
                <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                  <FolderBold size={16} color="var(--toffee-brown)" />
                </span>
              </TableCell>
              {/* Paginação por cursor não sabe o total de páginas sem uma query à parte —
                  por isso não tem "página X de Y", só o que dá pra saber sem custo extra. */}
              <TableCell colSpan={3} className="px-4 py-3 font-normal text-coffee-bean/70">
                {t.rich("pageCount", {
                  count: categories.length,
                  strong: (chunks) => (
                    <strong className="font-semibold text-carbon-black">{chunks}</strong>
                  ),
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
