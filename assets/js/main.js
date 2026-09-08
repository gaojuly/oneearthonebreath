/* =========================================================
   ONE EARTH ONE BREATH — Global scripts
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  // Respect saved preference, then system preference.
  const saved = localStorage.getItem("1e1b-theme");
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("1e1b-theme", next);
    });
  }

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close when a link is clicked.
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = (el.getAttribute("data-decimals") || "0") | 0;
    const duration = 1800;
    const start = performance.now();

    function format(v) {
      return v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic for a satisfying finish.
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = format(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = format(target);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Forms (newsletter, contact, donate) ---------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = form.querySelector("[data-form-message]");
      if (message) {
        message.textContent = "Thank you! We'll be in touch soon. 🌱";
        message.classList.add("show");
      }
      form.reset();
      setTimeout(() => message && message.classList.remove("show"), 5000);
    });
  });

  /* ---------- Donation amount selector ---------- */
  document.querySelectorAll("[data-donate-option]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".donate-options");
      if (group) {
        group.querySelectorAll("[data-donate-option]").forEach((b) =>
          b.classList.remove("selected")
        );
        btn.classList.add("selected");
        const amount = btn.getAttribute("data-donate-option");
        const input = group.parentElement.querySelector("[data-donate-amount]");
        if (input) input.value = amount;
      }
    });
  });

  /* ---------- Highlight current page in nav ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
})();
