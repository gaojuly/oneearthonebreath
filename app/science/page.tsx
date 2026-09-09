import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Science — One Earth One Breath",
  description:
    "The Multimodal Mindfulness Index (MMI), wavelet entropy, alpha and theta activity, and brain–heart coordination — the scientific foundations of One Earth One Breath.",
};

const measures = [
  ["Wavelet Entropy", "Signal organisation during mindfulness, informing a proposed Clarity Score.", ""],
  ["Alpha & Theta", "8–12 Hz and 4–7 Hz activity, linked to relaxed alertness.", "card--teal"],
  ["Brain–Heart Coordination", "EEG with heart rate variability — harmony between mind and body.", ""],
  ["Mindfulness Score", "A 0–100 feedback tool — a guide to practice, not a judgement.", "card--amber"],
];

export default function SciencePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Science</span></div>
          <h1>The science of a shared breath</h1>
          <p>Turning the vision into a useful experience requires collaboration across hardware, software, and neuroscience — through the proposed Multimodal Mindfulness Index.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">The Foundation</span>
            <h2 className="reveal">The Multimodal Mindfulness Index</h2>
            <p className="lead reveal">The MMI would bring together EEG, cardiac, and breathing measurements to provide understandable feedback during practice.</p>
            <p className="reveal" style={{ marginTop: 16 }}>The approach draws on work at HKU&apos;s Centre of Buddhist Studies and the Centre on Behavioral Health. The intended research programme examines how physiological measures relate to attention, relaxation, and emotional regulation. The MMI would require validation before it could support clinical claims or meaningful comparisons between people.</p>
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
            <span className="eyebrow reveal">Key Measures</span>
            <h2 className="reveal">What we explore</h2>
          </div>
          <div className="grid grid--4">
            {measures.map(([name, desc, tone], i) => (
              <article key={name} className={`card ${tone} reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 3 10 3-7 2 2h4" /></svg></div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">Privacy &amp; Choice</span>
            <h2 className="reveal">Local processing, participant choice</h2>
            <p className="lead reveal">The proposed architecture prioritises processing on the device or phone where feasible.</p>
            <p className="reveal" style={{ marginTop: 16 }}>The shared community visualisation would use aggregated, de-identified features rather than individuals&apos; raw neural signals. Optional research data collection — and any later use for AI training — would require a separate, clearly explained consent process and appropriate governance.</p>
            <ul className="checklist reveal">
              <li><span className="checklist__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>No neural data required for basic practice</li>
              <li><span className="checklist__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>Separate, clearly explained consent for research</li>
              <li><span className="checklist__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>Feedback is supportive, never a grade of worth</li>
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
              <h2>Curious about the practice itself?</h2>
              <p>Explore the five core practices and the ocean-guided breathing that anchor the experience.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">Explore the practice</Link>
                <Link href="/roadmap" className="btn btn--light btn--lg">See the roadmap</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

