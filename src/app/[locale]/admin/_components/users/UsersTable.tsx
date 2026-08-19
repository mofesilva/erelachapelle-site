"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AltArrowDownBold,
  AltArrowUpBold,
  PenNewSquareBoldDuotone,
  SortVerticalBold,
  TrashBinTrashBoldDuotone,
  UserCrossBold,
  UserRoundedBold,
} from "solar-icon-set";
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
import { formatDate } from "@/lib/utils";
import type { User } from "../../_features/users/user.type";
import type { Locale } from "@/types/common";

const HEAD_CLASS = "h-11 px-4 font-semibold uppercase text-coffee-bean";
// bg-accent, o padrão do Skeleton do shadcn, resolve pro toffee-brown da marca nesse
// projeto — forte demais pra um placeholder de carregamento. Um cinza neutro da própria
// paleta (o mesmo usado nas bordas) é o que se espera de um skeleton.
const SKELETON_CLASS = "bg-dust-grey";
// Larguras alternando por linha só pra não parecer uma grade artificial — puramente estético.
const NAME_SKELETON_WIDTHS = ["w-32", "w-44", "w-40"];
// Sem PAGE_SIZE (GET /users não pagina) — um número fixo de linhas basta pro placeholder.
const SKELETON_ROWS = 6;

type SortField = "name" | "role";
type SortState = { field: SortField; direction: "asc" | "desc" } | null;

type Props = {
  users: User[];
  loading: boolean;
  loadFailed: boolean;
  onAdd: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleActive: (user: User) => Promise<void>;
};

export function UsersTable({
  users,
  loading,
  loadFailed,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  const t = useTranslations("admin.users");
  const locale = useLocale() as Locale;
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>(null);

  // Terceiro clique volta pra ordem natural (a API já devolve por nome, A→Z).
  function toggleSort(field: SortField) {
    setSort((prev) => {
      if (!prev || prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  }

  // Ordenação em memória: GET /users já devolve a lista inteira de uma vez, sem
  // paginação — não há motivo pra ida ao servidor só pra reordenar o que já está aqui.
  const sortedUsers = useMemo(() => {
    if (!sort) return users;
    const getValue = (user: User) =>
      sort.field === "name" ? user.name : t(user.role === "admin" ? "roleAdmin" : "roleEditor");
    const sorted = [...users].sort((a, b) =>
      getValue(a).localeCompare(getValue(b), undefined, { sensitivity: "base" })
    );
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [users, sort, t]);

  async function handleToggle(user: User) {
    setTogglingId(user._id);
    try {
      await onToggleActive(user);
    } catch {
      // O controller já reverteu o estado local em caso de erro.
    } finally {
      setTogglingId(null);
    }
  }

  function sortIcon(field: SortField) {
    if (sort?.field !== field) return <SortVerticalBold size={14} className="opacity-40" />;
    return sort.direction === "asc" ? (
      <AltArrowUpBold size={14} />
    ) : (
      <AltArrowDownBold size={14} />
    );
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

  if (!loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center border border-dashed border-toffee-brown/30 bg-powder-petal/20 px-6 py-16 text-center">
        <UserCrossBold size={44} color="var(--toffee-brown)" />
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
            <TableHead
              className={HEAD_CLASS}
              aria-sort={
                sort?.field === "name" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
              }
            >
              <button
                type="button"
                onClick={() => toggleSort("name")}
                className="flex cursor-pointer items-center gap-1.5 uppercase hover:text-toffee-brown"
              >
                {sortIcon("name")}
                {t("columnName")}
              </button>
            </TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnEmail")}</TableHead>
            <TableHead
              className={HEAD_CLASS}
              aria-sort={
                sort?.field === "role" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
              }
            >
              <button
                type="button"
                onClick={() => toggleSort("role")}
                className="flex cursor-pointer items-center gap-1.5 uppercase hover:text-toffee-brown"
              >
                {sortIcon("role")}
                {t("columnRole")}
              </button>
            </TableHead>
            <TableHead className={HEAD_CLASS}>{t("columnCreatedAt")}</TableHead>
            <TableHead className={`${HEAD_CLASS} text-center`}>{t("columnActive")}</TableHead>
            <TableHead className={`${HEAD_CLASS} text-end`}>{t("columnActions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={i} className="border-dust-grey hover:bg-transparent">
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`size-8 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 ${NAME_SKELETON_WIDTHS[i % 3]} ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-40 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-16 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`h-4 w-28 ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Skeleton className={`mx-auto h-5 w-9 rounded-full ${SKELETON_CLASS}`} />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                      <Skeleton className={`size-9 ${SKELETON_CLASS}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : sortedUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="group border-dust-grey transition-colors hover:bg-toffee-brown/[0.06]"
                >
                  <TableCell className="px-4 py-3.5">
                    <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                      <UserRoundedBold size={16} color="var(--toffee-brown)" />
                    </span>
                  </TableCell>
                  <TableCell className="select-none px-4 py-3.5">
                    <span className="cursor-default font-serif text-carbon-black">
                      {user.name}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                    {user.email}
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/70">
                    {t(user.role === "admin" ? "roleAdmin" : "roleEditor")}
                  </TableCell>
                  <TableCell className="cursor-default select-none px-4 py-3.5 text-coffee-bean/60">
                    {formatDate(user.createdAt, locale)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex justify-center">
                      <Switch
                        checked={user.active}
                        disabled={togglingId === user._id}
                        onCheckedChange={() => handleToggle(user)}
                        aria-label={t(user.active ? "activeAriaLabel" : "inactiveAriaLabel", {
                          name: user.name,
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("edit")}
                        className="size-9 text-coffee-bean hover:bg-toffee-brown/10 hover:text-toffee-brown"
                        onClick={() => onEdit(user)}
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
                        onClick={() => onDelete(user)}
                      >
                        <TrashBinTrashBoldDuotone size={22} className="size-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>

        {/* TableFooter/TableCell em vez de uma div solta embaixo: assim o ícone e o texto
            caem exatamente nas mesmas colunas das linhas. Só a contagem, sem paginação —
            GET /users devolve a lista inteira de uma vez. */}
        {!loading && (
          <TableFooter className="border-t border-dust-grey bg-powder-petal/20 hover:bg-powder-petal/20">
            <TableRow className="border-dust-grey hover:bg-transparent">
              <TableCell className="px-4 py-3">
                <span className="flex size-8 items-center justify-center bg-toffee-brown/12">
                  <UserRoundedBold size={16} color="var(--toffee-brown)" />
                </span>
              </TableCell>
              <TableCell colSpan={6} className="px-4 py-3 font-normal text-coffee-bean/70">
                {t.rich("itemCount", {
                  count: users.length,
                  strong: (chunks) => (
                    <strong className="font-semibold text-carbon-black">{chunks}</strong>
                  ),
                })}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
