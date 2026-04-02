"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { HamburgerMenuBold } from "solar-icon-set";
import { useState, useLayoutEffect, useEffect } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  "home",
  "about",
  // "sermons",   // hidden — no content yet
  // "events",    // hidden — no content yet
  // "community", // hidden — no content yet
  // "blog",      // hidden — no content yet
  "contact",
] as const;

export function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);

  // Sync scroll state before paint — prevents bg flash on mount/remount
  useLayoutEffect(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  // Enable CSS transitions only after first correct paint
  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      setReady(false);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Build labels object for mobile menu
  const labels: Record<string, string> = {};
  for (const item of navItems) labels[item] = t(item);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full ${ready ? "transition-all duration-300" : ""} ${scrolled
          ? "bg-rich-mahogany"
          : "bg-transparent"
          }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 ${ready ? "transition-all duration-300" : ""} ${scrolled ? "h-16" : "h-24"}`}>
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center"
          >
            <Image
              src="/logos/logo_white_h.png"
              alt="Église Réformée Évangélique La Chapelle"
              width={320}
              height={180}
              className={`w-auto ${ready ? "transition-all duration-300" : ""} ${scrolled ? "h-8 md:h-10" : "h-10 md:h-14 lg:h-16"}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${locale}${item === "home" ? "" : `/${item}`}`}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {t(item)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="light" />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer md:hidden text-white"
              aria-label="Open menu"
            >
              <HamburgerMenuBold size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={open}
        onClose={() => setOpen(false)}
        locale={locale}
        navItems={navItems}
        labels={labels}
      />
    </>
  );
}
