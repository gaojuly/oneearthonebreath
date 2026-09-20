import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/* The browser-side MapTiler API key for the hero's globe.
 *
 * It is served from here rather than inlined at build time so the value can
 * live in the Worker (a secret or a variable) instead of in the repo, and so
 * the same build works with or without one. A missing key is not an error:
 * the hero simply keeps its stylised earth.
 *
 * Restrict the key in MapTiler Cloud to this site's origins — it is necessarily
 * public once the browser loads the SDK.
 */
export async function GET() {
  /* Inside the Worker the value can be a secret or a variable, and the context
     is already in place. Outside one — `next dev`, `next start`, a plain node
     build — the async form asks wrangler for the platform proxy instead of
     throwing. */
  let fromWorker = "";
  try {
    const { env } = await getCloudflareContext({ async: true });
    fromWorker = (env as Record<string, string>).MAPTILER_API_KEY || "";
  } catch {
    fromWorker = "";
  }
  const key =
    fromWorker ||
    process.env.MAPTILER_API_KEY ||
    process.env.NEXT_PUBLIC_MAPTILER_API_KEY ||
    "";

  return NextResponse.json(
    { key: key || null },
    {
      // Long enough to keep this off the hot path, short enough to pick up a
      // newly configured key without a redeploy.
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    }
  );
}
