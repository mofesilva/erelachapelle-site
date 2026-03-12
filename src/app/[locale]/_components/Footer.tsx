import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { MapPointBold, ClockCircleBold, PhoneBold, LetterBold } from "solar-icon-set";
import { SITE_CONFIG } from "@/lib/constants";
import { LOCATIONS } from "@/lib/data/locations";
import { DiamondDivider } from "@/_components/DiamondDivider";
import { SocialIconButton } from "@/_components/SocialIconButton";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/_components/icons";
import type { Locale } from "@/types/common";

const navItems = [
  { key: "about", href: "/about" },
  { key: "sermons", href: "/sermons" },
  { key: "events", href: "/events" },
  { key: "community", href: "/community/groups" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export async function Footer() {
  const tNav = await getTranslations("navigation");
  const tFooter = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;

  const location = LOCATIONS[0];

  return (
    <footer className="relative bg-night-bordeaux-2">
      {/* Subtle darkening towards bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-carbon-black/15 pointer-events-none" />

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 pt-12 pb-8">
        <div className="grid gap-12 sm:gap-10 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* ── Column 1: Brand ── */}
          <div className="flex flex-col items-center md:items-start">
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/logos/logo_white_h.png"
                alt={SITE_CONFIG.name}
                width={320}
                height={180}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 text-center md:text-left font-serif italic leading-relaxed text-white/60">
              {tFooter("tagline")}
            </p>

            {/* Social Icons */}
            <div className="mt-6">
              <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-white/40 text-center md:text-left">
                {tFooter("followUs")}
              </p>
              <div className="flex items-center gap-3">
                <SocialIconButton
                  href={SITE_CONFIG.socialMedia.facebook}
                  icon={<FacebookIcon />}
                  variant="gold"
                  aria-label="Facebook"
                />
                <SocialIconButton
                  href={SITE_CONFIG.socialMedia.instagram}
                  icon={<InstagramIcon />}
                  variant="gold"
                  aria-label="Instagram"
                />
                <SocialIconButton
                  href={SITE_CONFIG.socialMedia.youtube}
                  icon={<YouTubeIcon />}
                  variant="gold"
                  aria-label="YouTube"
                />
              </div>
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div className="flex flex-col items-center md:items-start">
            <h6 className="font-semibold pb-4 uppercase tracking-[0.2em] text-toffee-brown">
              {tFooter("quickLinks")}
            </h6>

            <nav aria-label="Footer navigation" className="flex flex-col gap-3">
              {navItems.map(({ key, href }) => (
                <Link
                  key={key}
                  href={`/${locale}${href}`}
                  className="group flex items-center gap-2 text-white/70 transition-all duration-300 hover:text-white hover:translate-x-1"
                >
                  <span className="inline-block h-px w-0 bg-toffee-brown transition-all duration-300 group-hover:w-4" />
                  {tNav(key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Column 3: Contact Info ── */}
          <div className="flex flex-col items-center md:items-start">
            <h6 className="font-semibold uppercase pb-4 tracking-[0.2em] text-toffee-brown">
              {tFooter("contactUs")}
            </h6>

            <div className="flex flex-col gap-4">
              {/* Address */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tFooter("address")}
                className="group flex items-start gap-3 text-white/70 transition-colors duration-300 hover:text-white"
              >
                <MapPointBold size={18} className="mt-0.5 shrink-0 text-toffee-brown/80" />
                <p>
                  {location.address}<br />
                  {location.postalCode} {location.city}<br />
                  {location.country}
                </p>
              </a>

              {/* Worship Schedule */}
              <div className="flex items-start gap-3 text-white/70">
                <ClockCircleBold size={18} className="mt-0.5 shrink-0 text-toffee-brown/80" />
                <p>{location.worshipSchedule[locale]}</p>
              </div>

              {/* Phone */}
              {location.contactPhone && (
                <a
                  href={`tel:${location.contactPhone.replace(/\s/g, "")}`}
                  aria-label={tFooter("phone")}
                  className="flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
                >
                  <PhoneBold size={18} className="shrink-0 text-toffee-brown/80" />
                  <p>{location.contactPhone}</p>
                </a>
              )}

              {/* Email */}
              {location.contactEmail && (
                <a
                  href={`mailto:${location.contactEmail}`}
                  aria-label={tFooter("email")}
                  className="flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
                >
                  <LetterBold size={18} className="shrink-0 text-toffee-brown/80" />
                  <p>{location.contactEmail}</p>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 sm:px-8 py-6 sm:flex-row">
          <p className="text-white/40">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. {tFooter("copyright")}
          </p>
          <p className="text-white/30">
            {tFooter("madeIn")} &hearts;
          </p>
        </div>
      </div>
    </footer>
  );
}
