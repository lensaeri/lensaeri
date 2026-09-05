import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Orbit } from "@/components/site/Orbit";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { getCopy, getPortfolio, getSettings, mediaUrl } from "@/lib/content";
import { tiktokEmbedSrc } from "@/lib/tiktok";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Wedding films and frames from across Borneo.",
};

export default async function PortfolioPage() {
  const [copy, settings, items] = await Promise.all([
    getCopy(),
    getSettings(),
    getPortfolio(),
  ]);

  // Resolve storage paths on the server so the filter client stays presentational.
  const resolved = items.map((item) => ({
    id: item.id,
    caption: item.caption,
    category: item.category,
    span: item.span,
    alt: item.image_alt,
    src: mediaUrl(item.image_path),
    tiktokEmbedSrc: tiktokEmbedSrc(item.tiktok_video_id),
    tiktokUrl: item.tiktok_url,
  }));

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
  ];

  return (
    <main className="page-top">
      <section className="portfolio-head">
        <Orbit style={{ top: -96, right: 180 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {copy("portfolio.eyebrow", "Portfolio")}
          </div>
          <h1
            className="serif"
            style={{ fontSize: "clamp(32px, 4.2vw, 52px)", margin: 0 }}
          >
            {copy("portfolio.title", "Films & frames, kept honest")}
          </h1>
        </div>
      </section>

      <PortfolioGrid items={resolved} categories={categories} />

      <Footer settings={settings} />
    </main>
  );
}
