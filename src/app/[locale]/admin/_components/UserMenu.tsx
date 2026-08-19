"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LogoutBold } from "solar-icon-set";
import { useAdminAuth } from "../_lib/auth-context";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : [parts[0]];
  return initials.map((part) => part[0]?.toUpperCase()).join("");
}

export function UserMenu() {
  const t = useTranslations("admin.nav");
  const tUsers = useTranslations("admin.users");
  const locale = useLocale();
  const router = useRouter();
  const { user, clearSession } = useAdminAuth();

  if (!user) return null;

  function handleLogout() {
    clearSession();
    router.replace(`/${locale}/admin/login`);
  }

  return (
    <div className="ml-auto flex h-11 bg-dust-grey/40">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-night-bordeaux-2 text-xs font-medium text-white">
        {getInitials(user.name)}
      </div>

      <div className="flex flex-col justify-center pr-4 pl-3 leading-tight">
        <p className="text-sm font-medium text-carbon-black">{user.name}</p>
        <p className="text-xs text-coffee-bean/70">
          {tUsers(user.role === "admin" ? "roleAdmin" : "roleEditor")}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        aria-label={t("logout")}
        title={t("logout")}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center bg-night-bordeaux-2 text-white transition-colors hover:bg-rich-mahogany"
      >
        <LogoutBold size={20} />
      </button>
    </div>
  );
}
