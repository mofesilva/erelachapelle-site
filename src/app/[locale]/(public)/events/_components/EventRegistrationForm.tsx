"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { registerForEvent } from "@/lib/events/controller";
import type { RegistrationResult } from "@/lib/events/model";

interface EventRegistrationFormProps {
  eventId: string;
}

export function EventRegistrationForm({ eventId }: EventRegistrationFormProps) {
  const t = useTranslations("events");
  const tForm = useTranslations("contact.form");
  const tCommon = useTranslations("common");
  const [state, formAction, isPending] = useActionState<RegistrationResult | null, FormData>(
    registerForEvent,
    null
  );

  if (state?.success) {
    return (
      <div className="border border-green-200 bg-green-50 p-4 text-center text-green-700">
        {t("registrationSuccess")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <Input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{tForm("name")} *</Label>
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
        <Label htmlFor="phone">{tCommon("phone")}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+33 6 00 00 00 00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">{t("attendees")} *</Label>
        <Input
          id="attendees"
          name="attendees"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          required
        />
      </div>

      {state && !state.success && (
        <p className="text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "..." : t("register")}
      </Button>
    </form>
  );
}
