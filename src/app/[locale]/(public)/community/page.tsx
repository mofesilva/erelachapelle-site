import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/types/common";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("community");
  return {
    title: t("title"),
  };
}

export default async function CommunityPage() {
  const t = await getTranslations("community");
  const tGroups = await getTranslations("community.groups");
  const locale = (await getLocale()) as Locale;

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
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {tGroups("title")}
          </h2>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href={`/${locale}/community/groups`}>
                {tGroups("title")} <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
