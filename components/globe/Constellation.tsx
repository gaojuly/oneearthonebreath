/* The visitor constellation around the hero earth.
 *
 * The reference artwork shows the earth held in her open palm, wrapped in a
 * spreading web of warm-gold threads, with visitor badges (people meditating,
 * families) hanging on the ends — the network reaching past the frame. This
 * draws that web around the earth; the earth itself is the live globe, painted
 * above it, so its disc hides the middle of every thread exactly as it does in
 * the reference.
 *
 * Purely decorative: `aria-hidden`, no state, and every pulse is a CSS
 * animation so `prefers-reduced-motion` can simply stop it.
 */

/* Where the badges sit: two loose rings, deliberately uneven so the web reads
   as a constellation rather than a diagram. Angles in degrees, 0 = right, and
   radius in the 1000-unit viewBox (the earth's disc is ~336 units across). */
const NODES: { angle: number; radius: number; scale: number; pair?: boolean }[] = [
  { angle: -158, radius: 352, scale: 1 },
  { angle: -118, radius: 300, scale: 0.86 },
  { angle: -78, radius: 392, scale: 1.06, pair: true },
  { angle: -44, radius: 318, scale: 0.95 },
  { angle: -12, radius: 430, scale: 1.12, pair: true },
  { angle: 22, radius: 336, scale: 0.9 },
  { angle: 54, radius: 404, scale: 1.02 },
  { angle: 88, radius: 300, scale: 0.84 },
  { angle: 124, radius: 372, scale: 1.04, pair: true },
  { angle: 154, radius: 328, scale: 0.92 },
  { angle: 178, radius: 442, scale: 1.08 },
  { angle: 200, radius: 366, scale: 0.88 },
];

/* The earth's disc in these units, and where a thread leaves it. */
const LIMB = 172;

function polar(angle: number, radius: number): [number, number] {
  const rad = (angle * Math.PI) / 180;
  return [Math.cos(rad) * radius, Math.sin(rad) * radius];
}

/* A thread from the earth's limb out to a badge, bowed slightly off the direct
   line so the web curves the way the reference's does. */
function thread(angle: number, radius: number) {
  const [x1, y1] = polar(angle, LIMB);
  const [x2, y2] = polar(angle, radius - 30);
  const [cx, cy] = polar(angle + 11, (LIMB + radius) / 2);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/* A figure for the badge: seated, arms resting — the meditation silhouette the
   reference repeats. `pair` adds a second, smaller figure beside it. */
function Figure({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-13" r="5.4" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M -10 0 C -10 -7 -5 -9 0 -9 C 5 -9 10 -7 10 0 C 10 6 6 9 0 9 C -6 9 -10 6 -10 0 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M -13 9 L 13 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

export default function Constellation() {
  return (
    <svg
      className="hero__constellation"
      viewBox="-500 -500 1000 1000"
      aria-hidden="true"
      focusable="false"
    >
      {/* The long sweeps: two wide ellipses passing behind the earth, which is
          what carries the eye past the globe and out to the frame. */}
      <g className="hero__net-sweep">
        <ellipse rx="452" ry="286" transform="rotate(-11)" pathLength={1000} />
        <ellipse rx="392" ry="366" transform="rotate(8)" pathLength={1000} />
        <ellipse rx="292" ry="412" transform="rotate(-24)" pathLength={1000} />
      </g>

      {/* Threads out to the badges, each with a light travelling it. */}
      {NODES.map((node, i) => {
        const d = thread(node.angle, node.radius);
        const [nx, ny] = polar(node.angle, node.radius);
        return (
          <g key={i}>
            <path className="hero__net-thread" d={d} pathLength={1000} />
            <path
              className="hero__net-pulse"
              d={d}
              pathLength={1000}
              style={{ animationDelay: `${(i * 0.42).toFixed(2)}s` }}
            />
            <g
              className="hero__net-badge"
              transform={`translate(${nx.toFixed(1)} ${ny.toFixed(1)}) scale(${node.scale})`}
              style={{ animationDelay: `${(i * 0.7).toFixed(2)}s` }}
            >
              <circle r="34" className="hero__net-badge-ring" />
              <Figure x={node.pair ? -11 : 0} y={2} s={node.pair ? 0.85 : 1} />
              {node.pair && <Figure x={17} y={4} s={0.6} />}
            </g>
          </g>
        );
      })}

      {/* The glow the threads sit in, just outside the earth's limb. */}
      <circle r={LIMB + 34} className="hero__net-halo" />
    </svg>
  );
}
