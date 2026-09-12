import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PayPalButton from "@/components/PayPalButton";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("support.title"), description: t("support.description") };
}

const modelMeta = [
  { cls: "", icon: <path d="M12 2 2 7l10 5 10-5-10-5Z" /> },
  { cls: "card--teal reveal--delay-1", icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /> },
  { cls: "card--amber reveal--delay-2", icon: <path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /> },
];

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Support");
  const tc = await getTranslations("Common");
  const modelCards = t.raw("modelCards") as { title: string; desc: string }[];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("support")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("oasisEyebrow")}</span>
            <h2 className="reveal">{t("oasisTitle")}</h2>
            <p className="lead reveal">{t("oasisLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("oasisP")}</p>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="100" cy="75" r="50" fill="rgba(255,255,255,.92)" />
                <path d="M100 42 C88 52 82 59 82 68 C82 76 90 82 100 82 C110 82 118 76 118 68 C118 59 112 52 100 42 Z" fill="#0e7490" />
                <path d="M100 50 L100 78" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M70 118 C84 110 116 110 130 118" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("modelEyebrow")}</span>
            <h2 className="reveal">{t("modelTitle")}</h2>
          </div>
          <div className="grid grid--3">
            {modelCards.map((c, i) => (
              <article key={c.title} className={`card ${modelMeta[i].cls} reveal`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{modelMeta[i].icon}</svg></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="give">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("donateEyebrow")}</span>
            <h2 className="reveal">{t("donateTitle")}</h2>
            <p className="reveal">{t("donateDesc")}</p>
          </div>
          <PayPalButton />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>{t("ctaTitle")}</h2>
              <p>{t("ctaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/contact" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/vision" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
