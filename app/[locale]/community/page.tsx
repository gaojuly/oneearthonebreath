import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("community.title"), description: t("community.description") };
}

// Force server rendering at request time so the schedule is always live.
export const dynamic = "force-dynamic";

function localHour(tz: string) {
  return parseInt(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: tz }).format(new Date()),
    10
  );
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Community");
  const tc = await getTranslations("Common");
  const d = await getTranslations("Data");
  const regions = d.raw("regions") as { name: string; cities: string }[];
  const relayCities = t.raw("relayCities") as { city: string; tz: string }[];

  const now = relayCities.map(({ city, tz }) => ({ city, hour: localHour(tz), live: localHour(tz) === 22 }));

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("community")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("relayEyebrow")}</span>
            <h2 className="reveal">{t("relayTitle")}</h2>
            <p className="lead reveal">{t("relayLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("relayP")}</p>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="100" cy="75" r="48" fill="rgba(255,255,255,.92)" />
                <path d="M100 40 C86 50 80 58 80 67 C80 75 88 81 100 81 C112 81 120 75 120 67 C120 58 114 50 100 40 Z" fill="#0e7490" />
                <circle cx="62" cy="66" r="4" fill="#f59e0b" />
                <circle cx="138" cy="66" r="4" fill="#f59e0b" />
                <circle cx="100" cy="102" r="4" fill="#6366f1" />
                <circle cx="100" cy="48" r="4" fill="#7dd3fc" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("citiesEyebrow")}</span>
            <h2 className="reveal">{t("citiesTitle")}</h2>
          </div>
          <div className="grid grid--4">
            {regions.map((r, i) => (
              <div key={r.name} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <h3>{r.name}</h3>
                <p>{r.cities}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">{t("liveEyebrow")}</span>
            <h2 className="reveal">{t("liveTitle")}</h2>
            <p className="reveal">{t("liveDesc")}</p>
          </div>
          <div className="grid grid--4">
            {now.map((n) => (
              <div key={n.city} className={`card ${n.live ? "card--amber" : ""}`}>
                <h3>{n.city}</h3>
                <p>{n.hour}:00 {t("local")} {n.live ? t("practisingNow") : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="100" cy="75" r="50" fill="rgba(255,255,255,.92)" />
                <path d="M100 42 C88 52 82 59 82 68 C82 76 90 82 100 82 C110 82 118 76 118 68 C118 59 112 52 100 42 Z" fill="#6366f1" />
                <path d="M100 50 L100 78" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="70" cy="60" r="3.5" fill="#f59e0b" />
                <circle cx="130" cy="85" r="3.5" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <div>
            <span className="eyebrow reveal">{t("hubEyebrow")}</span>
            <h2 className="reveal">{t("hubTitle")}</h2>
            <p className="lead reveal">{t("hubLead")}</p>
            <p className="reveal" style={{ marginTop: 16 }}>{t("hubP")}</p>
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
                <Link href="/contact" className="btn btn--light btn--lg">{t("cta2")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
