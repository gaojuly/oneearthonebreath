import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEffects from "@/components/SiteEffects";
import { routing } from "@/i18n/routing";
import "../globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://1e1b.org"),
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "One Earth One Breath",
    type: "website",
  },
};

const themeInit = `(function(){var d=document.documentElement;d.classList.add('js');})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          <SiteEffects />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
