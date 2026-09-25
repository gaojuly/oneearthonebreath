/* The visitor network drawn on the hero earth.
 *
 * "Visitors across the world, connected in one breath" is shown, not counted:
 * a ring of major cities, great-circle links between neighbouring ones, and a
 * pulse travelling each link. Both hero earths draw the same network from this
 * one list, so the stylised globe and MapTiler's globe tell the same story.
 *
 * Nothing here is telemetry: the cities are a fixed world-spanning set, and the
 * only position that comes from the visitor is the one the browser shares (which
 * the hero already marks with its own red dot).
 */

export type City = { name: string; lat: number; lng: number };

/* Spread deliberately across every continent, so the network reads as global
   from any camera angle. */
export const VISITOR_CITIES: City[] = [
  { name: "London", lat: 51.51, lng: -0.13 },
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "Los Angeles", lat: 34.05, lng: -118.24 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Lagos", lat: 6.52, lng: 3.38 },
  { name: "Nairobi", lat: -1.29, lng: 36.82 },
  { name: "Cairo", lat: 30.04, lng: 31.24 },
  { name: "Moscow", lat: 55.76, lng: 37.62 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Mumbai", lat: 19.08, lng: 72.88 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Hong Kong", lat: 22.32, lng: 114.17 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
  { name: "Auckland", lat: -36.85, lng: 174.76 },
];

export type Vec3 = [number, number, number];

function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/* A place on the unit sphere, in the same frame the stylised earth uses:
   y is the pole, and lng grows towards +z. */
export function toVector(lat: number, lng: number): Vec3 {
  const phi = radians(90 - lat);
  const theta = radians(lng + 180);
  return [
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
}

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

/* Great-circle point `t` of the way from `a` to `b`, on the unit sphere. */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const omega = Math.acos(Math.min(1, Math.max(-1, dot(a, b))));
  if (omega < 1e-6) return a;
  const sin = Math.sin(omega);
  const wa = Math.sin((1 - t) * omega) / sin;
  const wb = Math.sin(t * omega) / sin;
  return [
    a[0] * wa + b[0] * wb,
    a[1] * wa + b[1] * wb,
    a[2] * wa + b[2] * wb,
  ];
}

/* How far apart two cities are, along the surface (in radians of arc). */
export function arcLength(a: City, b: City) {
  return Math.acos(
    Math.min(1, Math.max(-1, dot(toVector(a.lat, a.lng), toVector(b.lat, b.lng))))
  );
}

/* The nearest city to a point the browser reported. */
export function nearestCity(lat: number, lng: number): City {
  const v = toVector(lat, lng);
  let best = VISITOR_CITIES[0];
  let bestArc = Infinity;
  for (const city of VISITOR_CITIES) {
    const d = Math.acos(
      Math.min(1, Math.max(-1, dot(v, toVector(city.lat, city.lng))))
    );
    if (d < bestArc) {
      bestArc = d;
      best = city;
    }
  }
  return best;
}

export type Link = { from: City; to: City; reversed: boolean };

/* Each city joined to its two nearest neighbours. Built once and cached: the
   list is fixed, and both earths walk it every frame. */
let linkCache: Link[] | null = null;

export function networkLinks(): Link[] {
  if (linkCache) return linkCache;
  const seen = new Set<string>();
  const links: Link[] = [];
  for (const city of VISITOR_CITIES) {
    const near = VISITOR_CITIES.filter((other) => other !== city)
      .map((other) => ({ other, d: arcLength(city, other) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { other } of near) {
      const key = [city.name, other.name].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      /* Keep the link pointing the way it was first found, so a pulse always
         travels the same direction along it. */
      links.push({ from: city, to: other, reversed: city.name > other.name });
    }
  }
  linkCache = links;
  return links;
}

/* A link as plain coordinates, for the tiles map: `steps` points along the
   great circle, which is what MapLibre draws as a line. */
export function linkCoordinates(link: Link, steps = 48): [number, number][] {
  const a = toVector(link.from.lat, link.from.lng);
  const b = toVector(link.to.lat, link.to.lng);
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const v = slerp(a, b, i / steps);
    const lat = 90 - (Math.acos(Math.min(1, Math.max(-1, v[1]))) * 180) / Math.PI;
    const lng = ((Math.atan2(v[2], -v[0]) * 180) / Math.PI) - 180;
    out.push([(((lng + 540) % 360) - 180), lat]);
  }
  return out;
}

/* A position along a link at `t` (0–1) of the way, for a travelling pulse. */
export function pointAlong(link: Link, t: number): [number, number] {
  const from = link.reversed ? link.to : link.from;
  const to = link.reversed ? link.from : link.to;
  const v = slerp(toVector(from.lat, from.lng), toVector(to.lat, to.lng), t);
  const lat = 90 - (Math.acos(Math.min(1, Math.max(-1, v[1]))) * 180) / Math.PI;
  const lng = ((Math.atan2(v[2], -v[0]) * 180) / Math.PI) - 180;
  return [(((lng + 540) % 360) - 180), lat];
}
