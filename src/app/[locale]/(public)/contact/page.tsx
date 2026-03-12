import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Card, CardContent } from "@/_components/ui/card";
import { getLocations } from "@/lib/locations";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { MapPointBold, PhoneBold, LetterBold, ClockCircleBold } from "solar-icon-set";
import { ContactForm } from "./_components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const locale = (await getLocale()) as Locale;
  const locations = await getLocations();

  return (
    <main>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif font-bold">
            {t("title")}
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-serif font-bold">
                {t("sendMessage")}
              </h2>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <h2 className="mb-6 font-serif font-bold">
                {t("ourLocations")}
              </h2>
              {locations.map((location) => (
                <Card key={location._id}>
                  <CardContent className="space-y-4 pt-6">
                    <h5 className="font-serif font-semibold text-primary">
                      {location.name}
                    </h5>

                    <div className="flex items-start gap-3">
                      <MapPointBold size={16} color="var(--primary)" className="mt-1" />
                      <div className="text-sm text-muted-foreground">
                        <p>{location.address}</p>
                        <p>
                          {location.postalCode} {location.city}
                        </p>
                      </div>
                    </div>

                    {location.contactPhone && (
                      <div className="flex items-center gap-3">
                        <PhoneBold size={16} color="var(--primary)" />
                        <a
                          href={`tel:${location.contactPhone}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {location.contactPhone}
                        </a>
                      </div>
                    )}

                    {location.contactEmail && (
                      <div className="flex items-center gap-3">
                        <LetterBold size={16} color="var(--primary)" />
                        <a
                          href={`mailto:${location.contactEmail}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {location.contactEmail}
                        </a>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <ClockCircleBold size={16} color="var(--primary)" className="mt-1" />
                      <p className="text-muted-foreground">
                        {getLocalizedContent(
                          location.worshipSchedule,
                          locale
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
