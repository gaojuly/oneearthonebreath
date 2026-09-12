"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "home" },
  { href: "/vision", label: "vision" },
  { href: "/science", label: "science" },
  { href: "/practice", label: "practice" },
  { href: "/community", label: "community" },
  { href: "/roadmap", label: "roadmap" },
  { href: "/contact", label: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const otherLocale = locale === "en" ? "zh-Hant" : "en";

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container nav">
        <Link href="/" className="brand" aria-label="One Earth One Breath — home" onClick={() => setOpen(false)}>
          <Logo />
          <span className="brand__name">
            One Earth One Breath
            <span className="brand__tag">{t("tagline")}</span>
          </span>
        </Link>

        <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <Link
            href={pathname}
            locale={otherLocale}
            className="lang-toggle"
            title={otherLocale === "zh-Hant" ? "繁體中文" : "English"}
          >
            {otherLocale === "zh-Hant" ? "繁中" : "EN"}
          </Link>
          <Link href="/support" className="btn btn--primary btn--sm">
            {t("support")}
          </Link>
          <button
            className="nav__toggle"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
