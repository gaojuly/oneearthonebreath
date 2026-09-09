import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Vision — One Earth One Breath",
  description:
    "Our vision for human wellbeing and AI: the meeting of carbon-based life and silicon-based intelligence, guided by the Middle Way.",
};

export default function VisionPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Vision</span></div>
          <h1>Our vision for human wellbeing and AI</h1>
          <p>Human experience in an age of machine intelligence — and how mindfulness, compassion, and the Middle Way can help shape it.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow reveal">The Defining Question</span>
            <h2 className="reveal">When carbon meets silicon</h2>
            <p className="lead reveal">The relationship between human minds and artificial intelligence is a defining question for our future.</p>
            <p className="reveal" style={{ marginTop: 16 }}>AI systems process information at extraordinary speed. Human experience encompasses embodied awareness, vulnerability, empathy, and moral responsibility. As these systems become more influential, we must consider both the goals they pursue and the human behaviours reflected in their training data.</p>
            <p className="reveal" style={{ marginTop: 16 }}>The concern is not limited to deliberately harmful machines. Human-generated data can also contain conflict, polarisation, and reactive behaviour. Our proposal asks how a greater emphasis on calm attention and compassion might contribute to technology designed around human wellbeing.</p>
          </div>
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <circle cx="70" cy="75" r="44" fill="rgba(255,255,255,.9)" />
                <path d="M70 48 C58 57 53 64 53 72 C53 80 60 86 70 86 C80 86 87 80 87 72 C87 64 82 57 70 48 Z" fill="#6366f1" />
                <circle cx="135" cy="70" r="26" fill="rgba(255,255,255,.85)" />
                <path d="M135 56 C129 62 126 66 126 71 C126 76 130 79 135 79 C140 79 144 76 144 71 C144 66 141 62 135 56 Z" fill="#0e7490" />
                <path d="M87 75 C100 82 116 84 128 82" stroke="#f59e0b" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow reveal">A Guiding Principle</span>
            <h2 className="reveal">The Middle Way</h2>
            <p className="reveal">The initiative draws on the Buddhist principle of the Middle Way. Applied to technology, it encourages progress guided by human wellbeing and ethical reflection — avoiding both technological development that disregards its human consequences, and a wholesale rejection of scientific progress.</p>
          </div>
          <div className="grid grid--3">
            <article className="card reveal">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /></svg></div>
              <h3>Technology helps us look inward</h3>
              <p>Brain-computer interfaces and generative AI could offer new ways to reflect on our experience.</p>
            </article>
            <article className="card card--teal reveal reveal--delay-1">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></div>
              <h3>Wisdom guides technology</h3>
              <p>Contemplative traditions provide practices for developing attention and compassion.</p>
            </article>
            <article className="card card--amber reveal reveal--delay-2">
              <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z" /></svg></div>
              <h3>Open to all faiths and none</h3>
              <p>Participation does not require adopting a particular religious belief.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split__media reveal">
            <div className="frame">
              <svg viewBox="0 0 200 150" fill="none" aria-hidden="true">
                <path d="M40 130 L40 90 Q40 60 100 55 Q160 60 160 90 L160 130 Z" fill="rgba(255,255,255,.9)" />
                <path d="M50 130 L50 92 Q50 68 100 64 Q150 68 150 92 L150 130 Z" fill="#6366f1" opacity="0.85" />
                <circle cx="100" cy="50" r="9" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <div>
            <span className="eyebrow reveal">Ethical Data</span>
            <h2 className="reveal">The Spiritual Stupa Dataset</h2>
            <p className="lead reveal">A carefully governed dataset associated with mindfulness, compassion, and flow states.</p>
            <p className="reveal" style={{ marginTop: 16 }}>Named for the stupa — a Buddhist monument that embodies a repository of contemplative experience — its purpose is to support research on the relationship between experience, physiology, and the design of supportive AI. EEG and other physiological measures would complement participants&apos; own accounts, as research observations rather than a &ldquo;gold standard&rdquo; of consciousness.</p>
            <p className="reveal" style={{ marginTop: 16 }}>Whether this work can contribute to safer, more beneficial AI is a question to investigate — not an established outcome.</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Our Aspiration</span>
            <h2 className="reveal">A mutually supportive relationship</h2>
            <p className="reveal">Technology helps people understand and develop their inner lives; human wisdom helps guide technology.</p>
          </div>
          <div className="cta-banner reveal" style={{ marginTop: 40 }}>
            <div>
              <h2>Join the conversation</h2>
              <p>Explore how attention, compassion, and resilience can inform a future shaped by AI.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/practice" className="btn btn--accent btn--lg">Begin the practice</Link>
                <Link href="/contact" className="btn btn--light btn--lg">Partner with us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

