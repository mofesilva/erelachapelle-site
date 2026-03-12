"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Textarea } from "@/_components/ui/textarea";
import { Label } from "@/_components/ui/label";
import { submitContactForm } from "@/lib/contact/controller";
import type { ContactResult } from "@/lib/contact/model";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tCommon = useTranslations("common");
  const [state, formAction, isPending] = useActionState<
    ContactResult | null,
    FormData
  >(submitContactForm, null);

  if (state?.success) {
    return (
      <div className="border border-green-200 bg-green-50 p-4 text-center text-green-700">
        {t("success")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <Input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Jean Dupont"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{tCommon("email")} *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jean@exemple.fr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t("subject")} *</Label>
        <Input
          id="subject"
          name="subject"
          required
          minLength={3}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")} *</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
        />
      </div>

      {state && !state.success && (
        <p className="text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "..." : t("send")}
      </Button>
    </form>
  );
}
