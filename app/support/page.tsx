import type { Metadata } from "next";
import Link from "next/link";
import PayPalButton from "@/components/PayPalButton";

export const metadata: Metadata = {
  title: "Support the Mission — One Earth One Breath",
  description:
    "Support the Spiritual Oasis programme and help bring mindfulness and contemplative practice to underserved communities.",
};

export default function SupportPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Support</span></div>
          <h1>Support the mission</h1>
          <p>Help widen access to contemplative practice — and grow the Spiritual Oasis programme for communities facing barriers to participation.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">The Social Mission</span>
            <h2 className="reveal">Spiritual Oasis</h2>
            <p className="lead reveal">A community&apos;s wellbeing includes those with the fewest resources.</p>
            <p className="reveal" style={{ marginTop: 16 }}>We propose working with local charities and community organisations in underserved regions — including parts of Africa and the wider Global South — and with communities affected by displacement, incarceration, or social exclusion. Practical support should respond to people&apos;s circumstances and be developed with organisations that understand their languages, cultures, and local needs.</p>
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
            <span className="eyebrow reveal">How It Works</span>
            <h2 className="reveal">A sustainable model</h2>
          </div>
          <div className="grid grid--3">
            <article className="card reveal">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z" /></svg></div>
              <h3>Free core access</h3>
              <p>Ocean-guided breathing, meditation, and shared practice — free for everyone.</p>
            </article>
            <article className="card card--teal reveal reveal--delay-1">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg></div>
              <h3>Professional funds access</h3>
              <p>Paid devices and services help subsidise delivery where it&apos;s needed most.</p>
            </article>
            <article className="card card--amber reveal reveal--delay-2">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /></svg></div>
              <h3>Buy-one-give-one</h3>
              <p>Or another transparent contribution mechanism, explored with delivery partners.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="give">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Donate</span>
            <h2 className="reveal">Give a single gift</h2>
            <p className="reveal">Every contribution plants seeds of resilience. Choose an amount below.</p>
          </div>
          <PayPalButton />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Partner with us</h2>
              <p>Foundations, charities, and community organisations can help design accessible programmes and identify pilot settings.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/contact" className="btn btn--accent btn--lg">Get in touch</Link>
                <Link href="/vision" className="btn btn--light btn--lg">Read the vision</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
