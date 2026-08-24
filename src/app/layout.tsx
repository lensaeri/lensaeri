import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getSettings } from "@/lib/content";
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

/** Falls back to localhost if the env var is unset or not a valid URL — a
 * bad value here must never fail the whole build. */
function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      console.error(`[metadata] NEXT_PUBLIC_SITE_URL is not a valid URL: ${raw}`);
    }
  }
  return new URL("http://localhost:3000");
}

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
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
