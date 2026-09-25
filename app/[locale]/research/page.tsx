import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PUBLICATIONS, PROFILE, publicationHref, type Publication } from "@/data/publications";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("research.title"), description: t("research.description") };
}

/* Newest first, and grouped by year, which is how a publication list is read. */
function byYear(publications: Publication[]) {
  const years = new Map<string, Publication[]>();
  for (const paper of publications) {
    const bucket = years.get(paper.year);
    if (bucket) bucket.push(paper);
    else years.set(paper.year, [paper]);
  }
  return [...years.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}

export default async function ResearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Research");
  const tc = await getTranslations("Common");
  const grouped = byYear(PUBLICATIONS);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{tc("home")}</Link><span>/</span><span>{tc("research")}</span></div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
        </div>
      </section>

      {/* The list itself: year by year, each paper with its authors and venue. */}
      {grouped.length > 0 && (
        <section className="section" id="publications">
          <div className="container">
            {grouped.map(([year, papers]) => (
              <div className="pub-year" key={year}>
                <h3 className="pub-year__label">{year}</h3>
                <ul className="pub-list">
                  {papers.map((paper) => {
                    const href = publicationHref(paper);
                    const meta = [paper.venue, paper.details, paper.note].filter(Boolean).join(" · ");
                    return (
                      <li className="pub reveal" key={paper.title}>
                        <p className="pub__title">
                          {href ? (
                            <a href={href} target="_blank" rel="noreferrer">{paper.title}</a>
                          ) : (
                            paper.title
                          )}
                        </p>
                        {paper.titleAlt && <p className="pub__title-alt" lang="zh-Hant">{paper.titleAlt}</p>}
                        <p className="pub__authors">{paper.authors}</p>
                        <p className="pub__meta">
                          {meta}
                          {href && (
                            <a className="pub__link" href={href} target="_blank" rel="noreferrer">
                              {paper.doi ? t("doiLabel") : t("readPaper")}
                            </a>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {PROFILE.url && (
              <p className="pub-profile reveal">
                {t("profileLead")}{" "}
                <a href={PROFILE.url} target="_blank" rel="noreferrer">{PROFILE.label}</a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* How to take part in the work behind the list. */}
      <section className="section section--soft">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">{t("joinEyebrow")}</span>
            <h2 className="reveal">{t("joinTitle")}</h2>
            <p className="lead reveal">{t("joinLead")}</p>
            <ul className="checklist reveal">
              {(t.raw("joinPoints") as string[]).map((item) => (
                <li key={item}>
                  <span className="checklist__mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>
              <Link href="/contact" className="btn btn--accent btn--lg">{t("joinCta")}</Link>
              <Link href="/community" className="btn btn--ghost btn--lg">{t("joinCta2")}</Link>
            </div>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="66" cy="62" r="26" fill="rgba(255,255,255,.92)" />
                <circle cx="134" cy="62" r="26" fill="rgba(255,255,255,.86)" />
                <circle cx="100" cy="104" r="22" fill="rgba(255,255,255,.8)" />
                <path d="M66 62 L134 62 M66 62 L100 104 M134 62 L100 104" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="66" cy="62" r="7" fill="#0e7490" />
                <circle cx="134" cy="62" r="7" fill="#0e7490" />
                <circle cx="100" cy="104" r="7" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
