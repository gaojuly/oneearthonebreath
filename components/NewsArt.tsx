// Decorative artwork for the three latest-activities cards on the home page.
//
// Same contract as components/PillarArt.tsx: each scene is a self-contained
// SVG painted in the site palette and cropped like a photograph
// (`preserveAspectRatio="xMidYMid slice"`), so the card visuals stay
// full-bleed at any card size. The motifs are deliberately different from
// the pillar scenes directly above so the two rows do not read as repeats.

export function MMIScene() {
  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="newsIndex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1033" />
          <stop offset="54%" stopColor="#2f3fc0" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <radialGradient id="newsIndexGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <pattern id="newsIndexGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" fill="none" stroke="#e3e4ff" strokeOpacity="0.12" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="400" fill="url(#newsIndex)" />
      <rect width="400" height="400" fill="url(#newsIndexGrid)" />
      <circle cx="200" cy="200" r="184" fill="url(#newsIndexGlow)" />

      {/* Brain, heart and breath — three traces merged into one index */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M-8 136c38 0 42-46 80-46s44 54 82 54 40-30 78-30 44 40 84 40 40-26 40-26"
          stroke="#bae6fd"
          strokeOpacity="0.5"
          strokeWidth="2.6"
        />
        <path
          d="M-8 196c34 0 38 30 74 30s40-62 78-62 44 78 84 78 40-48 80-48 46 34 88 34"
          stroke="#eafff3"
          strokeOpacity="0.82"
          strokeWidth="3.4"
        />
        <path
          d="M-8 256c32 0 36-28 72-28s42 50 80 50 44-38 84-38 44 44 84 44 42-24 82-24"
          stroke="var(--accent)"
          strokeOpacity="0.75"
          strokeWidth="2.6"
        />
      </g>

      {/* Sample points on the composite trace */}
      <g fill="#fde9c8">
        <circle cx="72" cy="150" r="4" />
        <circle cx="152" cy="250" r="4" />
        <circle cx="232" cy="174" r="4" />
        <circle cx="312" cy="230" r="4" />
      </g>
    </svg>
  );
}

export function HourScene() {
  // Twelve regional groups; the amber one is holding the current hour.
  const groups = Array.from({ length: 12 }, (_, i) => ({
    x: 34 + i * 30.2,
    y: 264 - Math.sin((i / 11) * Math.PI) * 30,
    live: i === 5,
  }));

  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="newsHour" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#04121f" />
          <stop offset="58%" stopColor="#0a3a52" />
          <stop offset="100%" stopColor="#12809c" />
        </linearGradient>
        <radialGradient id="newsHourGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="url(#newsHour)" />
      <circle cx="316" cy="150" r="150" fill="url(#newsHourGlow)" />

      {/* Horizon, and the arc the evening travels along */}
      <path d="M0 330h400" stroke="#eafff3" strokeOpacity="0.18" />
      <path
        d="M-6 334C54 238 138 184 208 200s122 78 202 44"
        fill="none"
        stroke="#bae6fd"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeDasharray="6 10"
      />

      {/* Time-zone ticks, each carrying a regional group */}
      <g stroke="#bae6fd" strokeOpacity="0.16">
        {groups.map((g, i) => (
          <line key={i} x1={g.x} y1={g.y} x2={g.x} y2="330" />
        ))}
      </g>
      <g>
        {groups.map((g, i) => (
          <circle
            key={i}
            cx={g.x}
            cy={g.y}
            r={g.live ? 7 : 4.5}
            fill={g.live ? "var(--accent)" : "#eafff3"}
            opacity={g.live ? 0.92 : 0.74}
          />
        ))}
        {groups
          .filter((g) => g.live)
          .map((g, i) => (
            <circle
              key={i}
              cx={g.x}
              cy={g.y}
              r="15"
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.45"
            />
          ))}
      </g>
    </svg>
  );
}
export function OasisScene() {
  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="newsOasis" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#052430" />
          <stop offset="46%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="newsOasisSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.9" />
          <stop offset="46%" stopColor="#fbbf24" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="640" height="520" fill="url(#newsOasis)" />
      <circle cx="430" cy="248" r="196" fill="url(#newsOasisSun)" />
      <circle cx="430" cy="248" r="58" fill="#ffe6b0" opacity="0.9" />

      {/* Layered ground — each band settles nearer the viewer */}
      <path
        d="M0 330c82-42 150 8 240-14s150-46 240-18 116 46 160 32V520H0Z"
        fill="#04222f"
        opacity="0.46"
      />
      <path
        d="M0 396c92-36 160 12 250-8s150-30 230-6 118 28 160 20V520H0Z"
        fill="#04222f"
        opacity="0.74"
      />
      <path d="M0 452h640" stroke="#ffe6b0" strokeOpacity="0.26" />
      <g stroke="#ffe6b0" strokeOpacity="0.34" strokeLinecap="round" strokeWidth="3">
        <path d="M336 470h164" />
        <path d="M366 488h120" />
        <path d="M398 506h64" />
      </g>
    </svg>
  );
}

