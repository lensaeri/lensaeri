"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ImageSlot } from "@/components/site/ImageSlot";

/**
 * Full-bleed hero. The media layer drifts and the copy fades as the page
 * scrolls — both skipped when the visitor prefers reduced motion.
 */
export function HeroParallax({
  imagePath,
  eyebrow,
  title,
  titleEm,
  body,
  ctaPrimary,
  ctaSecondary,
}: {
  imagePath?: string | null;
  eyebrow: string;
  title: string;
  titleEm: string;
  body: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        if (mediaRef.current) {
          mediaRef.current.style.transform = `translateY(${Math.min(y * 0.35, 140)}px)`;
        }
        if (textRef.current) {
          textRef.current.style.opacity = String(1 - Math.min(1, y / 480));
          textRef.current.style.transform = `translateY(${Math.min(y * 0.25, 120)}px)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero__media" ref={mediaRef}>
        <ImageSlot
          path={imagePath}
          alt={title}
          placeholder="Hero image"
          sizes="100vw"
          priority
        />
      </div>
      <div className="hero__scrim" />
      <div className="hero__body" ref={textRef}>
        <div className="eyebrow hero__eyebrow">{eyebrow}</div>
        <h1 className="hero__title">
          {title}
          <br />
          <em style={{ fontStyle: "italic" }}>{titleEm}</em>
        </h1>
        <p className="hero__lede">{body}</p>
        <div className="hero__actions">
          <Link href="/portfolio" className="btn btn--solid">
            {ctaPrimary}
          </Link>
          <Link href="/packages" className="btn btn--outline">
            {ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
