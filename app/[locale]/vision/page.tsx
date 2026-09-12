import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("vision.title"), description: t("vision.description") };
}

const middleMeta = [
  { cls: "", icon: <path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /> },
  { cls: "card--teal reveal--delay-1", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
  { cls: "card--amber reveal--delay-2", icon: <path d="M12 2 2 7l10 5 10-5-10-5Z" /> },
];

export default async function VisionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Vision");
  const tc = await getTranslations("Common");
  const middleCards = t.raw("middleCards") as { title: string; desc: string }[];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("vision")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("carbonEyebrow")}</span>
            <h2 className="reveal">{t("carbonTitle")}</h2>
            <p className="lead reveal">{t("carbonLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("carbonP1")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("carbonP2")}</p>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="70" cy="75" r="44" fill="rgba(255,255,255,.9)" />
                <path d="M70 48 C58 57 53 64 53 72 C53 80 60 86 70 86 C80 86 87 80 87 72 C87 64 82 57 70 48 Z" fill="#6366f1" />
                <circle cx="135" cy="70" r="26" fill="rgba(255,255,255,.85)" />
                <path d="M135 56 C129 62 126 66 126 71 C126 76 130 79 135 79 C140 79 144 76 144 71 C144 66 141 62 135 56 Z" fill="#0e7490" />
                <path d="M87 75 C100 82 116 84 128 82" stroke="#f59e0b" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow reveal">{t("middleEyebrow")}</span>
            <h2 className="reveal">{t("middleTitle")}</h2>
            <p className="reveal">{t("middleDesc")}</p>
          </div>
          <div className="grid grid--3">
            {middleCards.map((c, i) => (
              <article key={c.title} className={`card ${middleMeta[i].cls} reveal`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{middleMeta[i].icon}</svg></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <path d="M40 130 L40 90 Q40 60 100 55 Q160 60 160 90 L160 130 Z" fill="rgba(255,255,255,.9)" />
                <path d="M50 130 L50 92 Q50 68 100 64 Q150 68 150 92 L150 130 Z" fill="#6366f1" opacity="0.85" />
                <circle cx="100" cy="50" r="9" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <div>
            <span className="eyebrow reveal">{t("stupaEyebrow")}</span>
            <h2 className="reveal">{t("stupaTitle")}</h2>
            <p className="lead reveal">{t("stupaLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("stupaP1")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("stupaP2")}</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("aspirationEyebrow")}</span>
            <h2 className="reveal">{t("aspirationTitle")}</h2>
            <p className="reveal">{t("aspirationDesc")}</p>
          </div>
          <div className="cta-banner reveal" style={{ marginTop: 40 }}>
            <div>
              <h2>{t("ctaTitle")}</h2>
              <p>{t("ctaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/contact" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
