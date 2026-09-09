import type { Metadata } from "next";
import Link from "next/link";
import { roadmapPhases } from "@/lib/data";

export const metadata: Metadata = {
  title: "Roadmap — One Earth One Breath",
  description:
    "The One Earth One Breath implementation roadmap: Genesis, Expansion, Global Pulse, and Integration.",
};

export default function RoadmapPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Roadmap</span></div>
          <h1>The roadmap</h1>
          <p>A phased journey from research validation to global community — organised by years from project commencement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="timeline">
            {roadmapPhases.map((p) => (
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
            <span className="eyebrow reveal">What Phase One Establishes</span>
            <h2 className="reveal">From ideas to experiences partners can assess</h2>
          </div>
          <div className="grid grid--4">
            {[
              ["Practice app", "An accessible Universal-tier experience."],
              ["MMI protocol", "An initial research protocol for the index."],
              ["Adaptive audio", "A generative ocean-sound prototype."],
              ["Community plan", "A practical plan for shared participation."],
            ].map(([name, desc], i) => (
              <article key={name} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <p className="lead reveal" style={{ textAlign: "center", marginTop: 32 }}>
            Later expansion follows evidence from pilots. The proposed school count, geographic coverage, and product launches are targets, not reported achievements.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Help us build it</h2>
              <p>Early support enables the research and product pilots that establish usability, technical feasibility, demand, and operating costs.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/support" className="btn btn--accent btn--lg">Support the mission</Link>
                <Link href="/contact" className="btn btn--light btn--lg">Partner with us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
