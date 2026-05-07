"use client";

import { useTranslations } from "next-intl";
import { SectionLabel } from "@/_components/SectionLabel";
import { Separator } from "@/_components/ui/separator";
import { TeamSection } from "./_components/TeamSection";

export function AboutPageContent() {
  const t = useTranslations("about");

  return (
    <article>
      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 text-center h-[50vh]">
          <h1 className="font-serif font-bold">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel title={t("mission")} />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t("missionText")}</p>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl" />

      {/* Vision */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel title={t("vision")} />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t("visionText")}</p>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl" />

      {/* History */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel title={t("history")} />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t("historyText")}</p>
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel title={t("faith")} />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t("faithText")}</p>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl" />

      {/* Values */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel title={t("values")} />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t("valuesText")}</p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <TeamSection />
    </article>
  );
}
