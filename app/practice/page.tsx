import type { Metadata } from "next";
import Link from "next/link";
import { practices } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Practice — One Earth One Breath",
  description:
    "Ocean-guided breathing, five core mindfulness practices, and adaptive audio — the practice at the heart of One Earth One Breath.",
};

export default function PracticePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Practice</span></div>
          <h1>The practice</h1>
          <p>Ocean-guided breathing, meditation, and compassion — accessible to everyone, free at the core.</p>
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
            <span className="eyebrow reveal">Guided by the Ocean</span>
            <h2 className="reveal">The rhythm of the waves</h2>
            <p className="lead reveal">Ocean sounds provide a central sensory language for the platform — a simple cue that needs no charts or lengthy instructions.</p>
            <p className="reveal" style={{ marginTop: 16 }}>The sound design explores gentle cycles of approximately 10–12 seconds — about six breaths a minute (0.1 Hz), a rhythm linked to resonance in paced breathing. A generative audio engine can adapt to your own rhythm and gently invite a slower, more comfortable pace.</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Daily Core Practices</span>
            <h2 className="reveal">Five sessions to begin with</h2>
            <p className="reveal">Presented in accessible, non-sectarian language — sometimes described as &ldquo;fitness for the mind&rdquo;.</p>
          </div>
          <div className="grid grid--3">
            {practices.map((p, i) => (
              <article key={p.name} className={`card ${p.tone} reveal${i > 0 ? ` reveal--delay-${Math.min(i, 3)}` : ""}`}>
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
            <span className="eyebrow reveal">Two Routes</span>
            <h2 className="reveal">Universal and Professional tiers</h2>
          </div>
          <div className="grid grid--2">
            <div className="tier reveal">
              <h3>Universal tier</h3>
              <div className="tier__amount">Free</div>
              <p className="tier__desc">Accessible practice for individuals and communities.</p>
              <ul>
                <li>Smartphone app and online audio</li>
                <li>Guided breathing and meditation</li>
                <li>Shared live sessions</li>
                <li>Supported voice-call channels</li>
              </ul>
              <Link href="/community" className="btn btn--ghost">Join a session</Link>
            </div>
            <div className="tier tier--featured reveal reveal--delay-1">
              <span className="tier__flag">With sensors</span>
              <h3>Professional tier</h3>
              <div className="tier__amount">Paid</div>
              <p className="tier__desc">Physiological feedback for dedicated practice.</p>
              <ul>
                <li>Compatible EEG headband (BrainCo)</li>
                <li>Cardiac and breathing measurements</li>
                <li>Personal practice dashboard</li>
                <li>Validated feedback and trends</li>
              </ul>
              <Link href="/contact" className="btn btn--primary">Express interest</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Beyond Breathing</span>
            <h2 className="reveal">Play, create, and learn</h2>
          </div>
          <div className="grid grid--3">
            <article className="card reveal">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M12 7c-2-2-5-2-5 1 0 3 5 4 5 9 0 3 3 3 5 1 0-3-5-4-5-9 0-3-3-3-5-1Z" /></svg></div>
              <h3>Terra Nova</h3>
              <p>A restorative game where focus and calm bring a barren landscape back to life.</p>
            </article>
            <article className="card card--teal reveal reveal--delay-1">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /></svg></div>
              <h3>Contemplative Art</h3>
              <p>Generative thangka-inspired art and the &ldquo;EEG brush&rdquo; — practice as visual experience.</p>
            </article>
            <article className="card card--amber reveal reveal--delay-2">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5ZM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg></div>
              <h3>STEM+ Education</h3>
              <p>Neuroscience, psychology, and AI for schools — wellbeing as &ldquo;fitness for the mind&rdquo;.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Ready to breathe together?</h2>
              <p>Join a rolling global &ldquo;Mindfulness Hour&rdquo; that follows the evening around the world.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/community" className="btn btn--accent btn--lg">Join the community</Link>
                <Link href="/support" className="btn btn--light btn--lg">Support the mission</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

