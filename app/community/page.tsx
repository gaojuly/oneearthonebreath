import type { Metadata } from "next";
import Link from "next/link";
import { regions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Community — One Earth One Breath",
  description:
    "A rolling global Mindfulness Hour across 12 regional time-zone groups — shared evening practice around the world.",
};

// Force server rendering at request time so the schedule is always live.
export const dynamic = "force-dynamic";

const relay = [
  ["Tokyo", "Asia/Tokyo"],
  ["Sydney", "Australia/Sydney"],
  ["Beijing", "Asia/Shanghai"],
  ["Manila", "Asia/Manila"],
  ["New Delhi", "Asia/Kolkata"],
  ["Dubai", "Asia/Dubai"],
  ["Moscow", "Europe/Moscow"],
  ["London", "Europe/London"],
  ["New York", "America/New_York"],
  ["Los Angeles", "America/Los_Angeles"],
  ["São Paulo", "America/Sao_Paulo"],
];

function localHour(tz: string) {
  return parseInt(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: tz }).format(new Date()),
    10
  );
}

export default function CommunityPage() {
  const now = relay.map(([city, tz]) => ({ city, hour: localHour(tz), live: localHour(tz) === 22 }));

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Community</span></div>
          <h1>A global community of shared practice</h1>
          <p>Connecting individual practice with a shared global rhythm — a rolling &ldquo;Mindfulness Hour&rdquo; that follows the evening around the world.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">The Evening Relay</span>
            <h2 className="reveal">Twelve regions, one shared breath</h2>
            <p className="lead reveal">The proposed model organises communities into 12 regional time-zone groups across the 24-hour day, using two-hour planning bands.</p>
            <p className="reveal" style={{ marginTop: 16 }}>Each community holds a local Mindfulness Hour from 10:00–11:00 pm — the core session runs 10:00–10:30 pm, followed by 30 minutes of optional reflection, a gentle transition from daily activity to rest.</p>
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
            <span className="eyebrow reveal">Cities in the Relay</span>
            <h2 className="reveal">Following the evening around the globe</h2>
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
            <span className="eyebrow reveal">Live Now</span>
            <h2 className="reveal">Where the Mindfulness Hour is unfolding</h2>
            <p className="reveal">Computed live from each city&apos;s local time. Mindfulness Hour runs 10:00–11:00 pm local.</p>
          </div>
          <div className="grid grid--4">
            {now.map((n) => (
              <div key={n.city} className={`card ${n.live ? "card--amber" : ""}`}>
                <h3>{n.city}</h3>
                <p>{n.hour}:00 local {n.live ? "— practising now 🧘" : ""}</p>
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
            <span className="eyebrow reveal">The Community Hub</span>
            <h2 className="reveal">A shared digital gathering space</h2>
            <p className="lead reveal">A live digital space for shared practice, visualised as a three-dimensional globe of participating communities.</p>
            <p className="reveal" style={{ marginTop: 16 }}>Where sufficient consented data are available, aggregated feedback from the Professional tier could influence the display — an active region might become brighter, or a virtual ocean calmer. These effects represent participation and selected data, not a physical global &ldquo;energy field&rdquo;.</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Practise alongside the world</h2>
              <p>Shared attention and intention can help people feel less isolated and more connected — across cultures and without a common language.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">Begin the practice</Link>
                <Link href="/contact" className="btn btn--light btn--lg">Host a session</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

