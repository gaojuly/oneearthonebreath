import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("roadmap.title"), description: t("roadmap.description") };
}

export default async function RoadmapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Roadmap");
  const tc = await getTranslations("Common");
  const d = await getTranslations("Data");
  const phases = d.raw("roadmapPhases") as { name: string; timing: string; focus: string; desc: string }[];
  const phaseCards = t.raw("phaseCards") as { title: string; desc: string }[];

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("roadmap")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="timeline">
            {phases.map((p) => (
              <div key={p.name} className="timeline__item reveal">
                <span className="timeline__dot"></span>
                <span className="timeline__year">{p.timing} · {p.name}</span>
                <h3>{p.focus}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("phaseEyebrow")}</span>
            <h2 className="reveal">{t("phaseTitle")}</h2>
          </div>
          <div className="grid grid--4">
            {phaseCards.map((c, i) => (
              <article key={c.title} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
          <p className="lead reveal" style={{ textAlign: "center", marginTop: 32 }}>
            {t("phaseNote")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>{t("ctaTitle")}</h2>
              <p>{t("ctaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/support" className="btn btn--accent btn--lg">{t("cta1")}</Link>
                <Link href="/contact" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
