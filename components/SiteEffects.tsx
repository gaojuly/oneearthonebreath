"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Runs the "progressive enhancement" effects that used to live in main.js:
// scroll-reveal, animated counters, and form success handling.
// Re-runs on every route change so client-side navigations are handled too.
export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // --- Reveal on scroll ---
    const revealEls = document.querySelectorAll(".reveal");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && revealEls.length) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in-view"));
    }

    // --- Animated counters ---
    const counters = document.querySelectorAll("[data-count]");
    const fmt = (v: number, d: number) =>
      v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    const animate = (el: Element) => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const duration = 1800;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased, decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target, decimals);
      };
      requestAnimationFrame(tick);
    };
    let cio: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && counters.length) {
      cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              cio!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio!.observe(el));
    } else {
      counters.forEach(animate);
    }

    // --- Generic form handling ---
    const forms = document.querySelectorAll<HTMLFormElement>("form[data-form]");
    const handlers: Array<[HTMLFormElement, (e: Event) => void]> = [];
    forms.forEach((form) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const msg = form.querySelector("[data-form-message]");
        if (msg) {
          msg.textContent = "Thank you! We'll be in touch soon. 🌿";
          msg.classList.add("show");
        }
        form.reset();
        setTimeout(() => msg && msg.classList.remove("show"), 5000);
      };
      form.addEventListener("submit", handler);
      handlers.push([form as HTMLFormElement, handler]);
    });

    return () => {
      io?.disconnect();
      cio?.disconnect();
      handlers.forEach(([form, h]) => form.removeEventListener("submit", h));
    };
  }, [pathname]);

  return null;
}
