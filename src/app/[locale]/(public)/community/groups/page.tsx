import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { filterGroups, getGroups, getGroupTypes } from "@/lib/data/groups";
import type { Locale } from "@/types/common";
import { GroupCard } from "../_components/GroupCard";
import { GroupFilters } from "../_components/GroupFilters";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("community.groups");
  return {
    title: t("title"),
  };
}

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function GroupsPage({ searchParams }: PageProps) {
  const t = await getTranslations("community.groups");
  const tTypes = await getTranslations("community.groups.types");
  const tDays = await getTranslations("community.groups.days");
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;

  const hasFilters = !!params.type;
  const groups = hasFilters
    ? filterGroups({ groupType: params.type })
    : getGroups();

  const groupTypes = getGroupTypes();

  return (
    <main>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Suspense fallback={null}>
              <GroupFilters groupTypes={groupTypes} />
            </Suspense>
          </div>

          {groups.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("noGroups")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  locale={locale}
                  typeLabel={tTypes(group.groupType)}
                  dayLabel={tDays(group.meetingDay)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
