"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { mediaUrl } from "@/lib/media";

const BLADES = [0, 1, 2, 3, 4, 5, 6, 7];

/**
 * The cinematic title card. Plays on every full page load/refresh (unless
 * the visitor prefers reduced motion).
 */
export function Intro({
  brand,
  location,
  logoPath,
}: {
  brand: string;
  location: string;
  logoPath?: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    setPlaying(true);
    const timer = setTimeout(() => setPlaying(false), 4100);
    return () => clearTimeout(timer);
  }, []);

  if (!playing) return null;

  const logoSrc = mediaUrl(logoPath);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__base" />
      <div className="intro__iris" />
      <div className="intro__ring intro__ring--lg" />
      <div className="intro__ring intro__ring--sm" />
      {BLADES.map((i) => (
        <div
          key={i}
          className="intro__blade"
          style={{ ["--rot" as string]: `${i * 45}deg` }}
        />
      ))}
      <div className="intro__mark">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={brand}
            width={440}
            height={104}
            priority
            className="intro__logo"
          />
        ) : (
          <div className="intro__wordmark">{brand}</div>
        )}
        <div className="intro__place">{location}</div>
      </div>
    </div>
  );
}
