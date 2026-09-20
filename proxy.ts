import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/* A response that has to be rebuilt for every visitor, so the Worker's own cache
   (the `cache` block in wrangler.jsonc, which serves a stored answer without
   running this Worker) never pins one variant for everyone. A URL without a
   locale prefix answers in the visitor's own language — the default page, or a
   redirect to the prefixed one — and the cache key is the path, so English and
   zh-Hant visitors would otherwise share one answer. Prefixed URLs are fixed
   content by comparison, and stay cacheable. */
const PER_VISITOR = "private, no-store, max-age=0, must-revalidate";

// Region/country → locale. Extend this map when adding more languages.
const countryToLocale: Record<string, string> = {
  TW: "zh-Hant", // Taiwan
  HK: "zh-Hant", // Hong Kong
  MO: "zh-Hant", // Macau
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // No locale in URL and no prior choice — try geolocation first.
  if (!hasLocale && !request.cookies.has("NEXT_LOCALE")) {
    const cf = (request as unknown as { cf?: { country?: string } }).cf;
    const country = cf?.country;
    const locale = country ? countryToLocale[country] : undefined;

    if (locale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      response.headers.set("Cache-Control", PER_VISITOR);
      return response;
    }
  }

  const response = intlMiddleware(request);
  if (!hasLocale) response.headers.set("Cache-Control", PER_VISITOR);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

