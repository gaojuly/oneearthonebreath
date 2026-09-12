import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("contact.title"), description: t("contact.description") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const tc = await getTranslations("Common");
  const d = await getTranslations("Data");
  const partners = d.raw("partners") as { name: string; desc: string }[];
  const topicOptions = t.raw("topicOptions") as string[];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("contact")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("partnersEyebrow")}</span>
            <h2 className="reveal">{t("partnersTitle")}</h2>
          </div>
          <div className="grid grid--4">
            {partners.map((p, i) => (
              <article key={p.name} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /></svg></div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container two-col">
          <div>
            <span className="eyebrow reveal">{t("formEyebrow")}</span>
            <h2 className="reveal">{t("formTitle")}</h2>
            <p className="lead reveal" style={{ marginBottom: 26 }}>{t("formIntro")}</p>
            <form className="form" data-form>
              <div className="field"><label htmlFor="name">{t("formName")}</label><input id="name" name="name" type="text" required placeholder={t("formNamePlaceholder")} /></div>
              <div className="field"><label htmlFor="email">{t("formEmail")}</label><input id="email" name="email" type="email" required placeholder={t("formEmailPlaceholder")} /></div>
              <div className="field">
                <label htmlFor="topic">{t("formTopic")}</label>
                <select id="topic" name="topic">
                  {topicOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="message">{t("formMessage")}</label><textarea id="message" name="message" required placeholder={t("formMessagePlaceholder")}></textarea></div>
              <button className="btn btn--primary" type="submit">{t("formSend")}</button>
              <p className="form-message" data-form-message></p>
            </form>
          </div>
          <div>
            <span className="eyebrow reveal">{t("infoEyebrow")}</span>
            <h2 className="reveal" style={{ marginBottom: 26 }}>{t("infoTitle")}</h2>
            <ul className="info-list">
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg></span>
                <div><b>{t("infoEmail")}</b><a href="mailto:hello@1e1b.org">hello@1e1b.org</a></div>
              </li>
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
                <div><b>{t("infoBasedAt")}</b><p>{t("infoBasedAtValue")}</p></div>
              </li>
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg></span>
                <div><b>{t("infoWebsite")}</b><a href="/">1e1b.org</a></div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>{t("ctaTitle")}</h2>
              <p>{t("ctaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/vision" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/support" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
