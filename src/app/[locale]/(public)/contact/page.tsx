import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CrossDivider } from "@/_components/CrossDivider";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { ContactForm } from "./_components/ContactForm";
import { ChurchInfoSection } from "./_components/ChurchInfoSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <main>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative bg-night-bordeaux-2 pb-20 pt-40 md:pb-28 md:pt-48 h-[50vh]">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <CrossDivider variant="white" className="justify-center" />
          <h1 className="mt-8 font-serif text-4xl font-bold text-parchment md:text-5xl lg:text-6xl">
            Contactez-nous
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-powder-petal/60">
            {t("subtitle")}
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-2">
            <div className="h-0.5 w-12 bg-toffee-brown/40" />
            <div className="h-1 w-1 rotate-45 bg-toffee-brown/60" />
            <div className="h-0.5 w-12 bg-toffee-brown/40" />
          </div>
        </div>
      </section>

      {/* ── Section 1: Formulário de contato ────────────────────── */}
      <section className="bg-parchment py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-night-bordeaux-2">
              {t("sendMessage")}
            </h2>
            <DiamondDivider variant="bordeaux" />
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ── Section 2: Dados da igreja + mapa ───────────────────── */}
      <ChurchInfoSection />
    </main>
  );
}
