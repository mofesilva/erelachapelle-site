"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { UserBold, LetterBold, BookmarkBold, ChatRoundBold, CheckCircleBold } from "solar-icon-set";
import { SplitButton } from "@/_components/SplitButton";
import { submitContactForm, type ContactResult } from "@/app/actions/contact";

const fieldClass =
  "w-full border-0 border-b-2 border-toffee-brown/30 bg-transparent px-0 pb-2 pt-1 text-coffee-bean placeholder:text-coffee-bean/40 outline-none focus:border-toffee-brown transition-colors duration-200 resize-none";

const labelClass =
  "block text-[10px] uppercase tracking-widest font-semibold text-coffee-bean/60 mb-2";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction, isPending] = useActionState<
    ContactResult | null,
    FormData
  >(submitContactForm, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-none border border-olive-wood bg-toffee-brown p-10 text-center">
        <CheckCircleBold size={48} color="var(--parchment)" />
        <p className="font-serif text-xl text-parchment">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          {t("name")} *
        </label>
        <div className="flex items-end gap-3">
          <UserBold size={20} color="var(--toffee-brown)" className="mb-2 shrink-0 opacity-60" />
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Jean Dupont"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")} *
        </label>
        <div className="flex items-end gap-3">
          <LetterBold size={20} color="var(--toffee-brown)" className="mb-2 shrink-0 opacity-60" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jean@exemple.fr"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelClass}>
          {t("subject")} *
        </label>
        <div className="flex items-end gap-3">
          <BookmarkBold size={20} color="var(--toffee-brown)" className="mb-2 shrink-0 opacity-60" />
          <input
            id="subject"
            name="subject"
            required
            minLength={3}
            maxLength={200}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")} *
        </label>
        <div className="flex items-start gap-3">
          <ChatRoundBold size={20} color="var(--toffee-brown)" className="mt-1 shrink-0 opacity-60" />
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className={fieldClass}
          />
        </div>
      </div>

      {state && !state.success && (
        <p className="text-sm font-medium text-night-bordeaux-2">{state.message}</p>
      )}

      <div className="flex justify-center pt-2">
        <SplitButton type="submit" variant="gold" disabled={isPending}>
          {isPending ? "..." : t("send")}
        </SplitButton>
      </div>
    </form>
  );
}
