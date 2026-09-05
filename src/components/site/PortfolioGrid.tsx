"use client";

import { useMemo, useState } from "react";
import { ImageSlot } from "@/components/site/ImageSlot";

export type GridItem = {
  id: string;
  caption: string;
  category: string;
  span: number;
  alt: string;
  src: string | null;
  /** TikTok/YouTube embed player src, built from the video id resolved at save time — see lib/videoEmbed.ts. */
  embedSrc: string | null;
  /** Raw video URL, kept for the link-out fallback when resolution hasn't produced an id. */
  embedUrl: string | null;
};

export function PortfolioGrid({
  items,
  categories,
}: {
  items: GridItem[];
  categories: string[];
}) {
  const [filter, setFilter] = useState("All");

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  return (
    <>
      <div
        className="portfolio-head"
        style={{ paddingBottom: 40, justifyContent: "flex-end" }}
      >
        <div className="filters" role="tablist" aria-label="Filter portfolio">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              className={`filter ${filter === cat ? "filter--active" : ""}`.trim()}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section style={{ padding: "0 var(--gutter) 120px" }}>
        <div className="portfolio-grid">
          {visible.map((item) => {
            const spanClass = item.span > 1 ? "slot--tall" : "";
            const caption = (
              <div className="slot__caption">
                <div className="slot__caption-title">{item.caption}</div>
                <div className="slot__caption-cat">{item.category}</div>
              </div>
            );

            if (item.embedSrc) {
              return (
                <div key={item.id} className={`slot ${spanClass}`.trim()}>
                  <iframe
                    src={item.embedSrc}
                    title={item.caption || "Portfolio video"}
                    className="slot__embed"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    loading="lazy"
                  />
                  {caption}
                </div>
              );
            }

            if (item.embedUrl) {
              // A video link was pasted but no video id could be pulled out of it
              // (e.g. a TikTok short link — can't be resolved client-side). Fall
              // back to a link-out over whatever image is set, rather than
              // silently dropping the link.
              return (
                <div key={item.id} className={`slot ${spanClass}`.trim()}>
                  <ImageSlot
                    path={item.src}
                    alt={item.alt || item.caption}
                    placeholder={item.caption || "Portfolio image"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 25vw"
                  />
                  <a
                    href={item.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="slot__embed-badge"
                    aria-label="View video"
                  >
                    View video
                  </a>
                  {caption}
                </div>
              );
            }

            return (
              <ImageSlot
                key={item.id}
                path={item.src}
                alt={item.alt || item.caption}
                placeholder={item.caption || "Portfolio image"}
                className={spanClass}
                sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 25vw"
              >
                {caption}
              </ImageSlot>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p style={{ color: "var(--cream-55)", fontSize: 14 }}>
            Nothing in this category yet.
          </p>
        )}
      </section>
    </>
  );
}
