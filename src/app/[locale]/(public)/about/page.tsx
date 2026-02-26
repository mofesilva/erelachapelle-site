import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { SectionLabel } from "@/_components/SectionLabel";
import { Card, CardContent } from "@/_components/ui/card";
import { getLeadershipTeam } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("missionText"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as Locale;
  const team = getLeadershipTeam();

  return (
    <main>
      {/* Title */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {t("mission")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("missionText")}
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {t("vision")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("visionText")}
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {t("history")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("historyText")}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {t("values")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("valuesText")}
          </p>
        </div>
      </section>

      {/* Faith */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {t("faith")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("faithText")}
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionLabel title={t("team.title")} />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member._id} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.fullName}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-3xl text-muted-foreground">
                        {member.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-semibold">
                    {member.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-primary">
                    {getLocalizedContent(member.role, locale)}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {getLocalizedContent(member.bio, locale)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
