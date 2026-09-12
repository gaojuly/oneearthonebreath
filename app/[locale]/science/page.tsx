import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("science.title"), description: t("science.description") };
}

const measureTones = ["", "card--teal", "", "card--amber"];

export default async function SciencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Science");
  const tc = await getTranslations("Common");
  const measures = t.raw("measures") as { title: string; desc: string }[];
  const privacy = t.raw("privacyChecklist") as string[];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("science")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("mmiEyebrow")}</span>
            <h2 className="reveal">{t("mmiTitle")}</h2>
            <p className="lead reveal">{t("mmiLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("mmiP")}</p>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <path d="M20 90 C40 40 60 40 70 90 C80 140 100 140 110 90 C120 40 140 40 160 90 C170 110 180 110 190 100" stroke="rgba(255,255,255,.95)" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 110 C45 70 65 70 75 110 C85 150 105 150 115 110 C125 70 145 70 165 110 C175 125 185 125 190 120" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("measuresEyebrow")}</span>
            <h2 className="reveal">{t("measuresTitle")}</h2>
          </div>
          <div className="grid grid--4">
            {measures.map((m, i) => (
              <article key={m.title} className={`card ${measureTones[i]} reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 3 10 3-7 2 2h4" /></svg></div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("privacyEyebrow")}</span>
            <h2 className="reveal">{t("privacyTitle")}</h2>
            <p className="lead reveal">{t("privacyLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("privacyP")}</p>
            <ul className="checklist reveal">
              {privacy.map((item) => (
                <li key={item}><span className="checklist__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <rect x="40" y="40" width="120" height="70" rx="12" fill="rgba(255,255,255,.9)" />
                <path d="M55 95 L55 70 L80 85 L100 60 L120 78 L145 70 L145 95 Z" fill="#0e7490" opacity="0.85" />
                <circle cx="100" cy="50" r="7" fill="#6366f1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>{t("ctaTitle")}</h2>
              <p>{t("ctaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/roadmap" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
