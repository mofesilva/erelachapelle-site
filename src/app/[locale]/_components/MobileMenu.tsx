"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { CloseSquareBold } from "solar-icon-set";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
    navItems: readonly string[];
    labels: Record<string, string>;
}

export function MobileMenu({ isOpen, onClose, locale, navItems, labels }: MobileMenuProps) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Mount → animate in. Close → animate out → unmount.
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // Force a reflow before adding the "visible" class so the transition fires
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
            const timer = setTimeout(() => setMounted(false), 500); // match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Lock scroll
    useEffect(() => {
        if (mounted) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mounted]);

    const getHref = useCallback((item: string) => {
        if (item === "home") return `/${locale}`;
        if (item === "community") return `/${locale}/community/groups`;
        return `/${locale}/${item}`;
    }, [locale]);

    if (!mounted) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                transform: visible ? "translateX(0)" : "translateX(100%)",
                transition: "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--rich-mahogany)",
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "1.75rem",
                    right: "1.5rem",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    background: "none",
                    border: "none",
                    padding: "0.5rem",
                }}
                aria-label="Close menu"
            >
                <CloseSquareBold size={28} />
            </button>

            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "2.5rem" }}>
                <Image
                    src="/logos/logo_white_h.png"
                    alt="La Chapelle"
                    width={320}
                    height={180}
                    style={{ height: "3rem", width: "auto" }}
                />
            </div>

            {/* Decorative accent */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 2rem 0" }}>
                <div style={{ height: "1px", flex: 1, background: "rgba(var(--toffee-brown-rgb, 183,135,38), 0.3)" }} />
                <div style={{ height: "6px", width: "6px", transform: "rotate(45deg)", background: "var(--toffee-brown)" }} />
                <div style={{ height: "1px", flex: 1, background: "rgba(var(--toffee-brown-rgb, 183,135,38), 0.3)" }} />
            </div>

            {/* Navigation links */}
            <nav style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.75rem", padding: "0 2.5rem" }}>
                {navItems.map((item, i) => (
                    <Link
                        key={item}
                        href={getHref(item)}
                        onClick={onClose}
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            color: "var(--toffee-brown)",
                            textDecoration: "none",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateX(0)" : "translateX(40px)",
                            transition: `opacity 400ms ease ${150 + i * 60}ms, transform 400ms ease ${150 + i * 60}ms`,
                        }}
                    >
                        {labels[item] ?? item}
                    </Link>
                ))}
            </nav>

            {/* Language switcher */}
            <div style={{ marginTop: "auto", padding: "0 2.5rem 2.5rem" }}>
                <LanguageSwitcher variant="light" />
            </div>
        </div>,
        document.body
    );
}
