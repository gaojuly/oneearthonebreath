"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = form.querySelector("[data-form-message]");
    if (msg) {
      msg.textContent = "Thank you! You're on the list. 🌿";
      msg.classList.add("show");
    }
    form.reset();
    setTimeout(() => msg && msg.classList.remove("show"), 5000);
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="brand" style={{ color: "#fff" }}>
              <Logo />
              <span className="brand__name">One Earth One Breath</span>
            </Link>
            <p>A global mindfulness initiative connecting people through neuroscience and AI — because we all share one breath.</p>
            <div className="socials" style={{ marginTop: 22 }}>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="X (formerly Twitter)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16M20 4L4 20" /></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></svg></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><Link href="/vision">Our vision</Link></li>
              <li><Link href="/science">The science</Link></li>
              <li><Link href="/practice">The practice</Link></li>
              <li><Link href="/community">Community</Link></li>
              <li><Link href="/roadmap">Roadmap</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/support">Donate</Link></li>
              <li><Link href="/support">Spiritual Oasis</Link></li>
              <li><Link href="/contact">Partners</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Breathe with us</h4>
            <p style={{ fontSize: "0.95rem", marginBottom: 16 }}>Monthly practice, science, and community updates — no noise.</p>
            <form className="newsletter" onSubmit={onSubmit}>
              <input type="email" required placeholder="Your email address" aria-label="Email address" />
              <button className="btn btn--primary btn--sm" type="submit">Join</button>
              <p className="form-message" data-form-message></p>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} One Earth One Breath · Dr Junling Gao, The University of Hong Kong.</span>
          <span>One planet. One atmosphere. One shared breath.</span>
        </div>
      </div>
    </footer>
  );
}
