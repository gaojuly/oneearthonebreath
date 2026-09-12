import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Add a new language by adding its locale code here + a messages/<locale>.json file
  // + an optional country mapping in proxy.ts.
  locales: ["en", "zh-Hant"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
