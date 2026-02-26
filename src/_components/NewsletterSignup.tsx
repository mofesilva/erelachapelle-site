"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import {
  subscribeNewsletter,
  type NewsletterResult,
} from "@/app/actions/newsletter";
import { LetterBold } from "solar-icon-set";

export function NewsletterSignup() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState<
    NewsletterResult | null,
    FormData
  >(subscribeNewsletter, null);

  if (state?.success) {
    return (
      <p className="text-sm text-green-400">{t("success")}</p>
    );
  }

  return (
    <form action={formAction} className="flex gap-2">
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <Input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="relative flex-1">
        <LetterBold size={16} color="var(--muted-foreground)" className="absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          name="email"
          type="email"
          required
          placeholder={t("placeholder")}
          className="pl-10"
          aria-label={t("placeholder")}
        />
      </div>

      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "..." : t("subscribe")}
      </Button>

      {state && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </form>
  );
}
