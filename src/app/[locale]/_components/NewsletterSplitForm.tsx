"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/_components/ui/input";
import { SplitButton } from "@/_components/SplitButton";
import { subscribeNewsletter } from "@/lib/newsletter/controller";
import type { NewsletterResult } from "@/lib/newsletter/model";
import { LetterBold } from "solar-icon-set";

export function NewsletterSplitForm() {
    const t = useTranslations("homepage.newsletter");
    const locale = useLocale();
    const [state, formAction, isPending] = useActionState<
        NewsletterResult | null,
        FormData
    >(subscribeNewsletter, null);

    if (state?.success) {
        return (
            <div className="flex items-center justify-center gap-3">
                <span className="text-toffee-brown text-lg">✦</span>
                <p className="font-semibold uppercase tracking-wider text-green-300">
                    {t("success")}
                </p>
                <span className="text-toffee-brown text-lg">✦</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <form action={formAction} className="shadow-lg">
                <input type="hidden" name="locale" value={locale} />

                {/* Honeypot */}
                <div className="sr-only" aria-hidden="true">
                    <Input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Hidden submit for Enter key */}
                <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
                    Submit
                </button>

                <div className="flex">
                    {/* Email input with icon */}
                    <div className="relative bg-parchment flex items-center">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <LetterBold size={16} color="var(--night-bordeaux)" />
                        </span>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder={t("placeholder")}
                            aria-label={t("placeholder")}
                            className="sm:w-72 md:w-80 bg-transparent text-night-bordeaux placeholder:text-night-bordeaux pl-11 pr-6 py-3.5 text-sm tracking-wider border-0 outline-none"
                        />
                    </div>

                    {/* SplitButton component as submit */}
                    <SplitButton type="submit" disabled={isPending}>
                        {isPending ? "..." : t("subscribe")}
                    </SplitButton>
                </div>
            </form>

            {/* Error message */}
            {state && !state.success && (
                <p className="text-red-300">{state.message}</p>
            )}
        </div>
    );
}
