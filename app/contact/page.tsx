import type { Metadata } from "next";
import Link from "next/link";
import { partners } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Partners — One Earth One Breath",
  description:
    "Partner with One Earth One Breath — practitioners, investors, charities, researchers, and artists are all welcome.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Contact</span></div>
          <h1>Join the initiative</h1>
          <p>Bring your practice, expertise, technology, or support — help shape a community in which personal wellbeing and care for others grow together.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow reveal">Who We Welcome</span>
            <h2 className="reveal">Partners across disciplines</h2>
          </div>
          <div className="grid grid--4">
            {partners.map((p, i) => (
              <article key={p.name} className={`card reveal${i > 0 ? ` reveal--delay-${i}` : ""}`}>
                <div className="card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 11-7 11Z" /></svg></div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container two-col">
          <div>
            <span className="eyebrow reveal">Say Hello</span>
            <h2 className="reveal">Send us a message</h2>
            <p className="lead reveal" style={{ marginBottom: 26 }}>We reply to every message within two working days.</p>
            <form className="form" data-form>
              <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" type="text" required placeholder="Jane Doe" /></div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="jane@example.com" /></div>
              <div className="field">
                <label htmlFor="topic">I am a…</label>
                <select id="topic" name="topic">
                  <option>Practitioner / teacher</option>
                  <option>Investor / technology partner</option>
                  <option>Charity / foundation</option>
                  <option>Researcher</option>
                  <option>Artist</option>
                  <option>Participant</option>
                </select>
              </div>
              <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" required placeholder="How would you like to take part?"></textarea></div>
              <button className="btn btn--primary" type="submit">Send message</button>
              <p className="form-message" data-form-message></p>
            </form>
          </div>
          <div>
            <span className="eyebrow reveal">Contact Details</span>
            <h2 className="reveal" style={{ marginBottom: 26 }}>Other ways to reach us</h2>
            <ul className="info-list">
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg></span>
                <div><b>Email</b><a href="mailto:hello@1e1b.org">hello@1e1b.org</a></div>
              </li>
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
                <div><b>Based at</b><p>The University of Hong Kong · Centre of Buddhist Studies</p></div>
              </li>
              <li>
                <span className="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg></span>
                <div><b>Website</b><a href="/">1e1b.org</a></div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div>
              <h2>Explore the initiative</h2>
              <p>Visit 1e1b.org to learn more about One Earth One Breath and opportunities to participate.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/vision" className="btn btn--accent btn--lg">Read the vision</Link>
                <Link href="/support" className="btn btn--light btn--lg">Support the mission</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
