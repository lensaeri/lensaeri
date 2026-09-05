import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getSettings } from "@/lib/content";
import { resolveSiteUrl } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: resolveSiteUrl(),
    title: {
      default: `${settings.brand_name} — Wedding Films & Content, Kuching`,
      template: `%s — ${settings.brand_name}`,
    },
    description: settings.footer_blurb,
    openGraph: {
      title: `${settings.brand_name} — Wedding Films & Content`,
      description: settings.footer_blurb,
      type: "website",
      locale: "en_MY",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
