import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { NewsletterSignup } from "@/_components/NewsletterSignup";
import type { Locale } from "@/types/common";

export async function Footer() {
  const t = await getTranslations("navigation");
  const tNewsletter = await getTranslations("newsletter");
  const locale = (await getLocale()) as Locale;

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-bold text-primary">
              {SITE_CONFIG.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${locale}/about`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("about")}
              </Link>
              <Link
                href={`/${locale}/sermons`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("sermons")}
              </Link>
              <Link
                href={`/${locale}/events`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("events")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("contact")}
              </Link>
            </nav>
          </div>

          {/* Locations */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              Locations
            </h4>
            <ul className="flex flex-col gap-2">
              {SITE_CONFIG.locations.map((location) => (
                <li
                  key={location}
                  className="text-sm text-muted-foreground"
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              {tNewsletter("title")}
            </h4>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </div>
      </div>
    </footer>
  );
}
