import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

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
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
