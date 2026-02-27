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
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  variant?: "light" | "dark";
}

export function NewsletterSignup({ variant = "light" }: NewsletterSignupProps) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState<
    NewsletterResult | null,
    FormData
  >(subscribeNewsletter, null);

  const isDark = variant === "dark";

  if (state?.success) {
    return (
      <p className={cn(isDark ? "text-green-300" : "text-green-400")}>
        {t("success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <Input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="relative">
        <LetterBold
          size={16}
          color={isDark ? "rgba(255,255,255,0.4)" : "var(--muted-foreground)"}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder={t("placeholder")}
          className={cn(
            "pl-10",
            isDark &&
            "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-toffee-brown focus:ring-toffee-brown/30"
          )}
          aria-label={t("placeholder")}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        size="sm"
        className={cn(
          isDark &&
          "bg-toffee-brown text-white hover:bg-olive-wood border-0 cursor-pointer"
        )}
      >
        {isPending ? "..." : t("subscribe")}
      </Button>

      {state && !state.success && (
        <p className={cn(isDark ? "text-red-300" : "text-destructive")}>
          {state.message}
        </p>
      )}
    </form>
  );
}
