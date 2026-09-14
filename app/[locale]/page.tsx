import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Globe from "@/components/Globe";
import { CommunityScene, PracticeScene, ScienceScene } from "@/components/PillarArt";
import { HourScene, MMIScene, OasisScene } from "@/components/NewsArt";

type Props = { params: Promise<{ locale: string }> };

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("home.title"), description: t("home.description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const activities = t.raw("activities") as { tag: string; title: string; desc: string }[];
  // The three home cards use three different layouts (art above, art below,
  // wide feature), so they are read positionally rather than mapped.
  const [artTop, artBottom, feature] = activities;
  const marquee = t.raw("marquee") as string[];
  const checklist = t.raw("visionChecklist") as string[];

  return (
    <main>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero__glow hero__glow--1"></div>
        <div className="hero__glow hero__glow--2"></div>
        <div className="hero__glow hero__glow--3"></div>
        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <h1>
                {t("heroLine1")}
                <br />
                {t("heroLine2")}
              </h1>
              <p className="hero__sub">{t("heroSub")}</p>
              <div className="hero__cta">
                <Link href="/practice" className="btn btn--accent btn--lg">{t("heroCta1")}</Link>
                <Link href="/vision" className="btn btn--ghost btn--lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>{t("heroCta2")}</Link>
              </div>
            </div>

            <Globe />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>

      {/* Vision teaser */}
      <section className="section" id="vision">
        <div className="container split">
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="66" cy="70" r="38" fill="rgba(255,255,255,.92)" />
                <path d="M66 48 C58 57 54 63 54 70 C54 77 60 82 66 82 C72 82 78 77 78 70 C78 63 74 57 66 48 Z" fill="#6366f1" />
                <circle cx="140" cy="84" r="30" fill="rgba(255,255,255,.9)" />
                <path d="M140 66 C134 73 131 77 131 83 C131 88 135 91 140 91 C145 91 149 88 149 83 C149 77 146 73 140 66 Z" fill="#0e7490" />
                <path d="M78 70 C95 76 118 78 133 80" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 7" />
              </svg>
            </div>
          </div>
          <div>
            <span className="eyebrow reveal">{t("visionEyebrow")}</span>
            <h2 className="reveal">{t("visionTitle")}</h2>
            <p className="lead reveal">{t("visionLead")}</p>
            <ul className="checklist reveal">
              {checklist.map((item) => (
                <li key={item}><span className="checklist__mark"><Check /></span>{item}</li>
              ))}
            </ul>
            <Link href="/vision" className="btn btn--primary" style={{ marginTop: 28 }}>{t("visionCta")}</Link>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <h2 className="reveal">{t("pillarsTitle")}</h2>
          </div>
          <div className="platform-grid">
            <article className="platform-card reveal">
              <div className="platform-card__media" aria-hidden="true">
                <span className="platform-card__kicker">01 / 03</span>
                <PracticeScene />
              </div>
              <div className="platform-card__body">
                <h3>{t("pillarPracticeTitle")}</h3>
                <p>{t("pillarPracticeDesc")}</p>
                <Link href="/practice" className="platform-card__cta">
                  {t("pillarPracticeLink")}
                </Link>
              </div>
            </article>
            <article className="platform-card reveal reveal--delay-1">
              <div className="platform-card__media" aria-hidden="true">
                <span className="platform-card__kicker">02 / 03</span>
                <ScienceScene />
              </div>
              <div className="platform-card__body">
                <h3>{t("pillarScienceTitle")}</h3>
                <p>{t("pillarScienceDesc")}</p>
                <Link href="/science" className="platform-card__cta">
                  {t("pillarScienceLink")}
                </Link>
              </div>
            </article>
            <article className="platform-card platform-card--feature reveal reveal--delay-2">
              <div className="platform-card__media" aria-hidden="true">
                <span className="platform-card__kicker">03 / 03</span>
                <CommunityScene />
              </div>
              <div className="platform-card__overlay">
                <div className="platform-card__content">
                  <h3>{t("pillarCommunityTitle")}</h3>
                  <p>{t("pillarCommunityDesc")}</p>
                </div>
                <Link href="/community" className="platform-card__cta platform-card__cta--ghost">
                  {t("pillarCommunityLink")}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* Latest activities & news */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <h2 className="reveal">{t("activitiesTitle")}</h2>
          </div>
          <div className="news-grid">
            {/* 1 — wide feature card, leading the row */}
            {feature && (
              <article className="platform-card platform-card--feature reveal">
                <div className="platform-card__media" aria-hidden="true">
                  <OasisScene />
                  <span className="platform-card__kicker">{feature.tag}</span>
                </div>
                <div className="platform-card__overlay">
                  <div className="platform-card__content">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              </article>
            )}

            {/* 2 — artwork above the caption */}
            {artTop && (
              <article className="platform-card reveal reveal--delay-1">
                <div className="platform-card__media" aria-hidden="true">
                  <MMIScene />
                </div>
                <div className="platform-card__body">
                  <span className="eyebrow">{artTop.tag}</span>
                  <h3>{artTop.title}</h3>
                  <p>{artTop.desc}</p>
                </div>
              </article>
            )}

            {/* 3 — caption above the artwork */}
            {artBottom && (
              <article className="platform-card reveal reveal--delay-2">
                <div className="platform-card__body">
                  <span className="eyebrow">{artBottom.tag}</span>
                  <h3>{artBottom.title}</h3>
                  <p>{artBottom.desc}</p>
                </div>
                <div className="platform-card__media" aria-hidden="true">
                  <HourScene />
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>{t("finalCtaTitle")}</h2>
              <p>{t("finalCtaDesc")}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">{t("finalCta1")}</Link>
                <Link href="/support" className="btn btn--light btn--lg">{t("finalCta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
