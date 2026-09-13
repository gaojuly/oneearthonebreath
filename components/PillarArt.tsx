// Decorative artwork for the three home-page platform cards.
//
// Each scene is a self-contained SVG painted in the site palette and
// cropped like a photograph (`preserveAspectRatio="xMidYMid slice"`), so
// the card visuals stay full-bleed at any card size — mirroring the
// reference layout where every card leads with a full-width image.

export function PracticeScene() {
  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pillarSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#031b27" />
          <stop offset="45%" stopColor="#0a5a72" />
          <stop offset="100%" stopColor="#1b90b8" />
        </linearGradient>
        <radialGradient id="pillarSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pillarCrest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eafff3" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#eafff3" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="url(#pillarSea)" />
      <circle cx="288" cy="84" r="164" fill="url(#pillarSun)" />

      {/* Rolling swell — three overlapping bands give the panel depth */}
      <path d="M0 212c56-30 104 18 170 4s124-40 230-12V400H0Z" fill="url(#pillarCrest)" />
      <path d="M0 262c60-30 110 18 174 6s120-34 226-10V400H0Z" fill="#38bdf8" opacity="0.32" />
      <path d="M0 318c64-26 116 16 180 8s114-26 220-6V400H0Z" fill="#04222f" opacity="0.76" />

      {/* Spray */}
      <g fill="#eafff3" opacity="0.5">
        <circle cx="78" cy="228" r="2.4" />
        <circle cx="126" cy="250" r="1.6" />
        <circle cx="196" cy="216" r="2" />
        <circle cx="262" cy="236" r="1.4" />
        <circle cx="318" cy="200" r="2.2" />
        <circle cx="244" cy="292" r="1.8" />
        <circle cx="152" cy="304" r="1.4" />
      </g>
    </svg>
  );
}

export function ScienceScene() {
  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pillarLab" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#171a4d" />
          <stop offset="52%" stopColor="#3d40c9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <radialGradient id="pillarLabGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
        <pattern id="pillarGrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0v26" fill="none" stroke="#e3e4ff" strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="400" fill="url(#pillarLab)" />
      <rect width="400" height="400" fill="url(#pillarGrid)" />
      <circle cx="204" cy="196" r="176" fill="url(#pillarLabGlow)" />

      {/* Measurement rings — EEG, heart and breath converging on one index */}
      <g fill="none" stroke="#eafff3">
        <circle cx="204" cy="196" r="140" strokeOpacity="0.16" />
        <circle cx="204" cy="196" r="104" strokeOpacity="0.22" strokeDasharray="4 10" />
        <circle cx="204" cy="196" r="62" strokeOpacity="0.18" />
      </g>

      {/* The Multimodal Mindfulness Index trace */}
      <path
        d="M8 206h56l22-64 38 124 32-86 24 26h192"
        fill="none"
        stroke="#eafff3"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#fde9c8">
        <circle cx="86" cy="142" r="4" />
        <circle cx="124" cy="266" r="4" />
        <circle cx="156" cy="180" r="4" />
      </g>
    </svg>
  );
}

export function CommunityScene() {
  return (
    <svg
      className="platform-card__scene"
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pillarNight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#04121f" />
          <stop offset="52%" stopColor="#0a3a52" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <radialGradient id="pillarHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.34" />
          <stop offset="65%" stopColor="#0e7490" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
        </radialGradient>
        <pattern id="pillarNodes" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.5" fill="#eafff3" fillOpacity="0.42" />
        </pattern>
        <clipPath id="pillarSphere">
          <circle cx="330" cy="250" r="158" />
        </clipPath>
      </defs>

      <rect width="640" height="520" fill="url(#pillarNight)" />
      <circle cx="330" cy="250" r="300" fill="url(#pillarHalo)" />

      {/* The globe: node mesh, wireframe graticule, amber terminator */}
      <g clipPath="url(#pillarSphere)">
        <circle cx="330" cy="250" r="158" fill="#04222f" fillOpacity="0.6" />
        <rect x="140" y="70" width="400" height="380" fill="url(#pillarNodes)" />
        <g fill="none" stroke="#bae6fd" strokeOpacity="0.3">
          <ellipse cx="330" cy="250" rx="158" ry="52" />
          <ellipse cx="330" cy="186" rx="128" ry="42" />
          <ellipse cx="330" cy="314" rx="128" ry="42" />
          <ellipse cx="330" cy="250" rx="52" ry="158" />
          <ellipse cx="330" cy="250" rx="104" ry="158" />
        </g>
        <path
          d="M182 214h296"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="6 10"
        />
      </g>
      <circle cx="330" cy="250" r="158" fill="none" stroke="#bae6fd" strokeOpacity="0.5" />

      {/* Regional groups, connected as the evening travels the globe */}
      <g fill="none" stroke="#eafff3" strokeOpacity="0.34" strokeWidth="1.4">
        <path d="M204 210 330 132 466 226 392 344 250 332Z" />
        <path d="M204 210 250 332M330 132l62 212M466 226 392 344" />
      </g>
      <g fill="#eafff3">
        <circle cx="204" cy="210" r="5" />
        <circle cx="330" cy="132" r="5" />
        <circle cx="466" cy="226" r="5" />
        <circle cx="392" cy="344" r="5" />
        <circle cx="250" cy="332" r="5" />
      </g>
      <circle cx="330" cy="132" r="9" fill="var(--accent)" opacity="0.85" />
    </svg>
  );
}
