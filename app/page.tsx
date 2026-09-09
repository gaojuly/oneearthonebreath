import Link from "next/link";
import Globe from "@/components/Globe";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function HomePage() {
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
              <span className="hero__badge">
                <span className="pulse"></span> A global mindfulness initiative · Dr Junling Gao, HKU
              </span>
              <h1>
                One Earth.<br />One Breath.
              </h1>
              <p className="hero__sub">
                We connect breathing, meditation, and compassion with neuroscience and creative AI — so emotional resilience is within everyone&apos;s reach.
              </p>
              <div className="hero__cta">
                <Link href="/practice" className="btn btn--accent btn--lg">Begin the Practice</Link>
                <Link href="/vision" className="btn btn--ghost btn--lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>Our Vision</Link>
              </div>
            </div>

            <Globe />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {["Mindfulness", "Neuroscience", "Compassion", "Breathing", "Connection", "AI", "Mindfulness", "Neuroscience", "Compassion", "Breathing", "Connection", "AI"].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>

      {/* At a glance */}
      <section className="stats-band" aria-label="At a glance">
        <div className="container">
          <div className="stats-grid">
            <div className="stat reveal"><b><span data-count="88000">0</span></b><span>people have practised</span></div>
            <div className="stat reveal reveal--delay-1"><b><span data-count="5">0</span></b><span>core daily practices</span></div>
            <div className="stat reveal reveal--delay-2"><b><span data-count="12">0</span></b><span>regional time-zone groups</span></div>
            <div className="stat reveal reveal--delay-3"><b><span data-count="0.1" data-decimals="1">0</span><span className="suffix">Hz</span></b><span>resonant breathing rhythm</span></div>
          </div>
        </div>
      </section>

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
            <span className="eyebrow reveal">Our Vision</span>
            <h2 className="reveal">When carbon meets silicon</h2>
            <p className="lead reveal">
              The relationship between human minds and artificial intelligence is a defining question for our future. We describe it as the meeting of &ldquo;carbon-based&rdquo; life and &ldquo;silicon-based&rdquo; intelligence.
            </p>
            <ul className="checklist reveal">
              <li><span className="checklist__mark"><Check /></span>Develop inner resources as rapidly as we develop technology</li>
              <li><span className="checklist__mark"><Check /></span>Ground feedback in neuroscience — EEG, heart, and breath</li>
              <li><span className="checklist__mark"><Check /></span>Let the Middle Way guide technology toward wellbeing</li>
              <li><span className="checklist__mark"><Check /></span>Welcome people of all faiths and none</li>
            </ul>
            <Link href="/vision" className="btn btn--primary" style={{ marginTop: 28 }}>Read the full vision</Link>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">The Platform</span>
            <h2 className="reveal">Practice, science, and community</h2>
            <p className="reveal">Three strands, woven into one shared experience.</p>
          </div>
          <div className="grid grid--3">
            <article className="card reveal">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c3-5 6-5 9 0s6 5 9 0" /><path d="M2 17c3-5 6-5 9 0s6 5 9 0" /></svg></div>
              <h3>The Practice</h3>
              <p>Ocean-guided breathing, meditation, and compassion — five core practices anyone can begin, free.</p>
              <Link href="/practice">Explore the practice →</Link>
            </article>
            <article className="card card--teal reveal reveal--delay-1">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 3 10 3-7 2 2h4" /></svg></div>
              <h3>The Science</h3>
              <p>A Multimodal Mindfulness Index combining EEG, heart, and breath into understandable feedback.</p>
              <Link href="/science">Explore the science →</Link>
            </article>
            <article className="card card--amber reveal reveal--delay-2">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg></div>
              <h3>The Community</h3>
              <p>Twelve regional groups in a rolling &ldquo;Mindfulness Hour&rdquo; that follows the evening around the globe.</p>
              <Link href="/community">Explore the community →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Core practices */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Daily Core Practices</span>
            <h2 className="reveal">Five practices, one shared breath</h2>
            <p className="reveal">Accessible, non-sectarian, and guided by the sound of the ocean.</p>
          </div>
          <div className="grid grid--3">
            {[
              ["Breathing Practice", "10 min 51 sec · anchor attention in the rhythm of the breath.", ""],
              ["Body Scan", "10 min 40 sec · bring gentle awareness through the whole body.", "card--teal"],
              ["Awareness of Thoughts", "14 min 59 sec · observe the mind without being carried away.", ""],
              ["Open Awareness", "12 min 7 sec · rest in a spacious, receptive attention.", "card--amber"],
              ["Developing Empathy", "13 min 18 sec · cultivate kindness toward self and others.", ""],
              ["Ocean Breathing", "Our signature — six breaths a minute, guided by the waves.", "card--teal"],
            ].map(([name, desc, tone], i) => (
              <article key={name} className={`card ${tone} reveal${i > 0 ? ` reveal--delay-${Math.min(i, 3)}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c3-5 6-5 9 0s6 5 9 0" /></svg></div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spiritual Oasis */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Spiritual Oasis: grow your inner world</h2>
              <p>A place to develop our inner resources as rapidly as we develop our technological capabilities — because the future of AI is inseparable from human wellbeing.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/support" className="btn btn--accent btn--lg">Support the mission</Link>
                <Link href="/vision" className="btn btn--light btn--lg">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">The Roadmap</span>
            <h2 className="reveal">From Genesis to Global Pulse</h2>
          </div>
          <div className="grid grid--4">
            {[
              ["Genesis", "Year 1 · validate the MMI and launch the Universal tier."],
              ["Expansion", "Year 2 · integrate BrainCo hardware and pilot schools."],
              ["Global Pulse", "Year 3 · twelve regions, a live community globe, Terra Nova."],
              ["Integration", "Year 4+ · governed data access and wider global access."],
            ].map(([name, desc], i) => (
              <article key={name} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <div className="section-head center" style={{ marginTop: 40, marginBottom: 0 }}>
            <Link href="/roadmap" className="btn btn--primary">See the full roadmap</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Breathe together</h2>
              <p>Join a global practice that connects inner wellbeing with a shared future. Begin today — free, and open to everyone.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">Begin the Practice</Link>
                <Link href="/support" className="btn btn--light btn--lg">Support the mission</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


