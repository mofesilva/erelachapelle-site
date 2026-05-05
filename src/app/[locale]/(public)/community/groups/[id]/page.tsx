import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/_components/ui/badge";
import { getGroupById, getGroups } from "@/lib/data/groups";
import { getLocationById } from "@/lib/data/locations";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { UsersGroupRoundedBold, ClockCircleBold, MapPointBold } from "solar-icon-set";
import { JoinGroupForm } from "../../_components/JoinGroupForm";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getGroups().map((group) => ({ locale, id: group._id }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const group = getGroupById(id);
  if (!group) return {};
  return {
    title: group.name.fr,
    description: group.description.fr,
  };
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { id, locale: paramLocale } = await params;
  const locale = paramLocale as Locale;
  const t = await getTranslations("community.groups");
  const tTypes = await getTranslations("community.groups.types");
  const tDays = await getTranslations("community.groups.days");
  const tCommon = await getTranslations("common");
  const group = getGroupById(id);

  if (!group) notFound();

  const location = group.locationId
    ? getLocationById(group.locationId)
    : null;

  return (
    <main>
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href={`/${locale}/community/groups`}
            className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
          >
            ← {tCommon("back")}
          </Link>
          <h1 className="mt-4 font-serif font-bold">
            {getLocalizedContent(group.name, locale)}
          </h1>
          <Badge className="mt-4 bg-primary-foreground/20 text-primary-foreground">
            {tTypes(group.groupType)}
          </Badge>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="leading-relaxed text-muted-foreground">
                {getLocalizedContent(group.description, locale)}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 bg-muted/50 p-6">
                <div className="flex items-start gap-3">
                  <ClockCircleBold size={20} color="var(--primary)" className="mt-1" />
                  <div>
                    <p className="font-semibold">
                      {tDays(group.meetingDay)}
                    </p>
                    <p className="text-muted-foreground">
                      {group.meetingTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UsersGroupRoundedBold size={20} color="var(--primary)" className="mt-1" />
                  <div>
                    <p className="font-semibold">{t("leader")}</p>
                    <p className="text-muted-foreground">
                      {group.leaderName}
                    </p>
                  </div>
                </div>

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPointBold size={20} color="var(--primary)" className="mt-1" />
                    <div>
                      <p className="font-semibold">{location.name}</p>
                      <p className="text-muted-foreground">
                        {location.address}
                      </p>
                      <p className="text-muted-foreground">
                        {location.postalCode} {location.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border p-6">
                <h6 className="mb-4 font-serif font-semibold">
                  {t("joinGroup")}
                </h6>
                <JoinGroupForm groupId={group._id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
