"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type GridItem = {
  id: string;
  caption: string;
  category: string;
  span: number;
  alt: string;
  src: string | null;
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
          {visible.map((item) => (
            <div
              key={item.id}
              className={`slot ${item.span > 1 ? "slot--tall" : ""}`.trim()}
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt || item.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 25vw"
                  className="slot__img"
                  style={{ position: "absolute", inset: 0 }}
                />
              ) : (
                <div className="slot__empty">{item.caption || "Portfolio image"}</div>
              )}
              <div className="slot__caption">
                <div className="slot__caption-title">{item.caption}</div>
                <div className="slot__caption-cat">{item.category}</div>
              </div>
            </div>
          ))}
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
