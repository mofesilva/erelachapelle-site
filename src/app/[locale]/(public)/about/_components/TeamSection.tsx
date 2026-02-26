import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { SectionLabel } from "@/_components/SectionLabel";
import { Card, CardContent } from "@/_components/ui/card";
import { getLeadershipTeam } from "@/lib/data/leadership";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";

export async function TeamSection() {
  const t = await getTranslations("homepage.team");
  const locale = (await getLocale()) as Locale;
  const team = getLeadershipTeam();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel title={t("title")} />

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
  );
}
