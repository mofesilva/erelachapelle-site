import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SecondaryHeroSection } from "@/_components/SecondaryHeroSection";
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
      <SecondaryHeroSection
        title={t("title")}
      />

      {/* ── Section 1: Formulário de contato ────────────────────── */}
      <section className="bg-parchment py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ContactForm />
        </div>
      </section>

      {/* ── Section 2: Dados da igreja + mapa ───────────────────── */}
      <ChurchInfoSection />
    </main>
  );
}
