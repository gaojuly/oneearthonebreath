import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("practice.title"), description: t("practice.description") };
}

export default async function PracticePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Practice");
  const tc = await getTranslations("Common");
  const d = await getTranslations("Data");
  const practices = d.raw("practices") as { name: string; desc: string }[];
  const universalItems = t.raw("universalItems") as string[];
  const professionalItems = t.raw("professionalItems") as string[];
  const beyondCards = t.raw("beyondCards") as { title: string; desc: string }[];
  const beyondTones = ["", "card--teal", "card--amber"];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("practice")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <path d="M20 90 C40 55 55 55 65 90 C75 125 90 125 100 90 C110 55 125 55 135 90 C145 125 160 125 180 90" stroke="rgba(255,255,255,.95)" strokeWidth="3" strokeLinecap="round" />
                <path d="M30 110 C50 80 65 80 75 110 C85 140 100 140 110 110 C120 80 135 80 170 110" stroke="#7dd3fc" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>
          </div>
          <div>
            <span className="eyebrow reveal">{t("oceanEyebrow")}</span>
            <h2 className="reveal">{t("oceanTitle")}</h2>
            <p className="lead reveal">{t("oceanLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("oceanP")}</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("practicesEyebrow")}</span>
            <h2 className="reveal">{t("practicesTitle")}</h2>
            <p className="reveal">{t("practicesDesc")}</p>
          </div>
          <div className="grid grid--3">
            {practices.map((p, i) => (
              <article key={p.name} className={`card ${["", "card--teal", "", "card--amber", "", "card--teal"][i]} reveal${i > 0 ? ` reveal--delay-${Math.min(i, 3)}` : ""}`}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("tiersEyebrow")}</span>
            <h2 className="reveal">{t("tiersTitle")}</h2>
          </div>
          <div className="grid grid--2">
            <div className="tier reveal">
              <h3>{t("universalName")}</h3>
              <div className="tier__amount">{t("universalPrice")}</div>
              <p className="tier__desc">{t("universalDesc")}</p>
              <ul>
                {universalItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/community" className="btn btn--ghost">{t("universalCta")}</Link>
            </div>
            <div className="tier tier--featured reveal reveal--delay-1">
              <span className="tier__flag">{t("professionalFlag")}</span>
              <h3>{t("professionalName")}</h3>
              <div className="tier__amount">{t("professionalPrice")}</div>
              <p className="tier__desc">{t("professionalDesc")}</p>
              <ul>
                {professionalItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/contact" className="btn btn--primary">{t("professionalCta")}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("beyondEyebrow")}</span>
            <h2 className="reveal">{t("beyondTitle")}</h2>
          </div>
          <div className="grid grid--3">
            {beyondCards.map((c, i) => (
              <article key={c.title} className={`card ${beyondTones[i]} reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M12 7c-2-2-5-2-5 1 0 3 5 4 5 9 0 3 3 3 5 1 0-3-5-4-5-9 0-3-3-3-5-1Z" /></svg></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
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
                <Link href="/community" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/support" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
