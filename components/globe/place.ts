/* Naming a point on the earth: the two pieces of text the hero read-out needs,
   and the key-less reverse geocoder both hero globes share. */

/* "35.0°N, 135.8°E" — the exact reading, kept under the name of the place. */
export function formatCoords(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${ns}, ${Math.abs(lng).toFixed(1)}°${ew}`;
}

/* The most specific name the geocoder knows for a point — "Nakagyo Ku, Kyoto,
   Japan" rather than just the country. Repeats collapse, so a city that is
   also its own region is still named once. Returns "" out at sea. */
export function formatPlace(d: any) {
  const parts: string[] = [
    d.locality || d.city,
    d.principalSubdivision,
    d.countryName,
  ].filter(Boolean);
  return parts.filter((part, i) => parts.indexOf(part) === i).join(", ");
}

/* Key-less reverse geocoding; the answer comes back in the page language.
   `zh-TW` is what the service wants for traditional Chinese. */
export function geocodeLanguage(locale: string) {
  return locale === "zh-Hant" ? "zh-TW" : "en";
}

export function geocodeUrl(lat: number, lng: number, language: string) {
  return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${language}`;
}

/* One lookup. Rejects with the HTTP status so the caller can fall back. */
export async function lookupPlace(lat: number, lng: number, language: string) {
  const res = await fetch(geocodeUrl(lat, lng, language));
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
