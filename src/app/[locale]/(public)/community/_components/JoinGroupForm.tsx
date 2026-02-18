"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  submitGroupInterest,
  type GroupInterestResult,
} from "@/app/actions/groups";

interface JoinGroupFormProps {
  groupId: string;
}

export function JoinGroupForm({ groupId }: JoinGroupFormProps) {
  const t = useTranslations("community.groups");
  const tForm = useTranslations("contact.form");
  const tCommon = useTranslations("common");
  const [state, formAction, isPending] = useActionState<
    GroupInterestResult | null,
    FormData
  >(submitGroupInterest, null);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-700">
        {t("interestSuccess")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />

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
        <Label htmlFor="message">{tForm("message")}</Label>
        <Textarea
          id="message"
          name="message"
          maxLength={500}
          rows={3}
        />
      </div>

      {state && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "..." : t("joinGroup")}
      </Button>
    </form>
  );
}
