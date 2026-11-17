import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: "VeltrixVault — Football analytics, explained",
    template: "%s · VeltrixVault",
  },
  description:
    "Explore public football data, run a transparent Poisson model, and save your analysis. No tips, no guarantees, no noise.",
  applicationName: "VeltrixVault",
  keywords: [
    "football analytics",
    "football statistics",
    "Poisson model",
    "league tables",
    "match analysis",
    "public data",
  ],
  authors: [{ name: "VeltrixVault" }],
  creator: "VeltrixVault",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "VeltrixVault",
    title: "VeltrixVault — Football analytics, explained",
    description:
      "Public-data football analytics with an inspectable model. Explore leagues, run the Match Lab, and keep your work in the Vault.",
    url: env.appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "VeltrixVault — Football analytics, explained",
    description:
      "Public-data football analytics with an inspectable model. No tips. No guarantees.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e4" },
    { media: "(prefers-color-scheme: dark)", color: "#07130f" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem('vv-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only rounded-full bg-brand px-5 py-3 text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
