"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { submitContactForm, type ContactResult } from "@/app/actions/contact";
import { CheckCircleBold, ArrowRightBold } from "solar-icon-set";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction, isPending] = useActionState<
    ContactResult | null,
    FormData
  >(submitContactForm, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircleBold size={40} color="var(--toffee-brown)" />
        <h4 className="font-serif font-bold text-night-bordeaux-2">
          {t("successTitle")}
        </h4>
        <p className="max-w-sm leading-relaxed text-coffee-bean">
          {t("success")}
        </p>
        <DiamondDivider variant="gold" className="mt-2 justify-center" />
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name + Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block font-bold uppercase tracking-[0.15em] text-carbon-black/70">
            {t("name")} *
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Jean Dupont"
            className="mt-2 block w-full border-b-2 border-dust-grey bg-transparent py-3 text-carbon-black outline-none transition-colors placeholder:text-coffee-bean/30 focus:border-toffee-brown"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-bold uppercase tracking-[0.15em] text-carbon-black/70">
            {t("email")} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jean@exemple.fr"
            className="mt-2 block w-full border-b-2 border-dust-grey bg-transparent py-3 text-carbon-black outline-none transition-colors placeholder:text-coffee-bean/30 focus:border-toffee-brown"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block font-bold uppercase tracking-[0.15em] text-carbon-black/70">
          {t("subject")} *
        </label>
        <input
          id="subject"
          name="subject"
          required
          minLength={3}
          maxLength={200}
          className="mt-2 block w-full border-b-2 border-dust-grey bg-transparent py-3 text-carbon-black outline-none transition-colors placeholder:text-coffee-bean/30 focus:border-toffee-brown"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-bold uppercase tracking-[0.15em] text-carbon-black/70">
          {t("message")} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="mt-2 block w-full resize-none border-b-2 border-dust-grey bg-transparent py-3 text-carbon-black outline-none transition-colors placeholder:text-coffee-bean/30 focus:border-toffee-brown"
        />
      </div>

      {/* Error */}
      {state && !state.success && (
        <p className="text-scarlet-red">{t("error")}</p>
      )}

      {/* Submit — same style as GatheringSection directions button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="group/btn inline-flex items-stretch shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="flex items-center bg-night-bordeaux-2 px-8 py-3.5 font-semibold uppercase tracking-wider text-white transition-colors duration-300 group-hover/btn:bg-night-bordeaux">
            {isPending ? "..." : t("send")}
          </span>
          <span className="flex items-center justify-center bg-night-bordeaux px-4 transition-colors duration-300 group-hover/btn:bg-rich-mahogany">
            <ArrowRightBold size={16} color="#fff" className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </span>
        </button>
      </div>
    </form>
  );
}
