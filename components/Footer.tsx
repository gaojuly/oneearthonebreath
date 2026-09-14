"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("Footer");
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = form.querySelector("[data-form-message]");
    if (msg) {
      msg.textContent = t("newsletterThanks");
      msg.classList.add("show");
    }
    form.reset();
    setTimeout(() => msg && msg.classList.remove("show"), 5000);
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="brand" style={{ color: "#fff" }}>
              <Logo />
              <span className="brand__name">One Earth One Breath</span>
            </Link>
            <p>{t("tagline")}</p>
            <div className="socials" style={{ marginTop: 22 }}>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="X (formerly Twitter)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16M20 4L4 20" /></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></svg></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>{t("explore")}</h4>
            <ul>
              <li><Link href="/vision">{t("vision")}</Link></li>
              <li><Link href="/science">{t("science")}</Link></li>
              <li><Link href="/practice">{t("practice")}</Link></li>
              <li><Link href="/community">{t("community")}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t("supportTitle")}</h4>
            <ul>
              <li><Link href="/support">{t("donate")}</Link></li>
              <li><Link href="/support">{t("oasis")}</Link></li>
              <li><Link href="/contact">{t("partners")}</Link></li>
              <li><Link href="/contact">{t("contact")}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t("newsletterTitle")}</h4>
            <p style={{ fontSize: "0.95rem", marginBottom: 16 }}>{t("newsletterText")}</p>
            <form className="newsletter" onSubmit={onSubmit}>
              <input type="email" required placeholder={t("emailPlaceholder")} aria-label={t("emailPlaceholder")} />
              <button className="btn btn--primary btn--sm" type="submit">{t("join")}</button>
              <p className="form-message" data-form-message></p>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {t("copyright")}</span>
          <span>{t("motto")}</span>
        </div>
      </div>
    </footer>
  );
}
