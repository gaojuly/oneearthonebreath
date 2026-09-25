"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";

/* The primary menu. An entry with `children` is a group: its own heading is a
   label rather than a link (the group has no page of its own), and the pages
   under it hang from a dropdown — on a pointer, a tap, or a keyboard focus. */
type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };

/* "About Us" gathers the four pages that tell the story — where we are going,
   how we practise, what we measure, and who walks with us. Like "Resources", it
   is a heading without a page of its own, so it never links anywhere itself. */
const NAV: (NavLink | NavGroup)[] = [
  { href: "/", label: "home" },
  {
    label: "aboutUs",
    children: [
      { href: "/vision", label: "vision" },
      { href: "/practice", label: "practice" },
      { href: "/science", label: "science" },
      { href: "/community", label: "community" },
    ],
  },
  { label: "resources", children: [{ href: "/research", label: "researchPublications" }] },
  { href: "/contact", label: "contact" },
];

function isGroup(item: NavLink | NavGroup): item is NavGroup {
  return "children" in item;
}

export default function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /* Which dropdown is open by tap or click: a pointer or a keyboard focus opens
     one through CSS, this is what makes the same menu work on a touch screen. */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

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

  /* A tap anywhere else closes the open group. */
  useEffect(() => {
    if (!openGroup) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [openGroup]);

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

        <nav ref={navRef} className={`nav__links ${open ? "is-open" : ""}`} aria-label="Primary">
          {NAV.map((item) =>
            isGroup(item) ? (
              <div key={item.label} className={`nav__group ${openGroup === item.label ? "is-open" : ""}`}>
                <button
                  type="button"
                  className={`nav__group-label ${item.children.some((child) => isActive(child.href)) ? "active" : ""}`}
                  aria-expanded={openGroup === item.label}
                  onClick={() => setOpenGroup((value) => (value === item.label ? null : item.label))}
                >
                  {t(item.label)}
                  <svg className="nav__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="nav__submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={isActive(child.href) ? "active" : ""}
                      onClick={() => {
                        setOpen(false);
                        setOpenGroup(null);
                      }}
                    >
                      {t(child.label)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {t(item.label)}
              </Link>
            )
          )}
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
            type="button"
            className={`nav__toggle ${open ? "is-open" : ""}`}
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
