import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { getLocations } from "@/lib/data/locations";
import { getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
  const locations = getLocations();

  return (
    <main>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-serif text-2xl font-bold">
                {t("sendMessage")}
              </h2>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <h2 className="mb-6 font-serif text-2xl font-bold">
                {t("ourLocations")}
              </h2>
              {locations.map((location) => (
                <Card key={location._id}>
                  <CardContent className="space-y-4 pt-6">
                    <h3 className="font-serif text-xl font-semibold text-primary">
                      {location.name}
                    </h3>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-primary" />
                      <div className="text-sm text-muted-foreground">
                        <p>{location.address}</p>
                        <p>
                          {location.postalCode} {location.city}
                        </p>
                      </div>
                    </div>

                    {location.contactPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary" />
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
                        <Mail className="h-4 w-4 text-primary" />
                        <a
                          href={`mailto:${location.contactEmail}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {location.contactEmail}
                        </a>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">
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
