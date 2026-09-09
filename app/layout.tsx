import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEffects from "@/components/SiteEffects";
import "./globals.css";

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
  title: "One Earth One Breath — A Global Mindfulness Initiative",
  description:
    "One Earth One Breath is a global mindfulness initiative by Dr Junling Gao (The University of Hong Kong), connecting people through breathing, meditation, neuroscience, and AI.",
  metadataBase: new URL("https://1e1b.org"),
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "One Earth One Breath — A Global Mindfulness Initiative",
    description:
      "One planet. One breath. One shared practice — mindfulness, compassion and connection, grounded in neuroscience and AI.",
    url: "https://1e1b.org",
    siteName: "One Earth One Breath",
    images: ["/favicon.svg"],
    type: "website",
  },
};

const themeInit = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('1e1b-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){d.setAttribute('data-theme','dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
