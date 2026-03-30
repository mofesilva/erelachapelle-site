"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Textarea } from "@/_components/ui/textarea";
import { Label } from "@/_components/ui/label";
import {
    submitGroupInterest,
    type GroupInterestResult,
} from "@/app/actions/groups";

interface JoinGroupFormProps {
    groupId: string;
}

export function JoinGroupForm({ groupId }: JoinGroupFormProps) {
    const t = useTranslations("community.groups.form");
    const tCommon = useTranslations("common");
    const [state, formAction, isPending] = useActionState<
        GroupInterestResult | null,
        FormData
    >(submitGroupInterest, null);

    if (state?.success) {
        return (
            <div className="border border-green-200 bg-green-50 p-4 text-center text-green-700">
                {t("success")}
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
                <Label htmlFor="join-name">{t("name")} *</Label>
                <Input
                    id="join-name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Jean Dupont"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="join-email">Email *</Label>
                <Input
                    id="join-email"
                    name="email"
                    type="email"
                    required
                    placeholder="jean@exemple.fr"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="join-message">{t("message")}</Label>
                <Textarea
                    id="join-message"
                    name="message"
                    maxLength={500}
                    rows={3}
                />
            </div>

            {state && !state.success && (
                <p className="text-destructive">{state.message}</p>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "..." : tCommon("submit")}
            </Button>
        </form>
    );
}
