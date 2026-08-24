"use client";

import { useEffect, useState } from "react";

const BLADES = [0, 1, 2, 3, 4, 5, 6, 7];

/**
 * The cinematic title card. Plays once per browser session so repeat
 * navigation within a visit is not gated behind four seconds of animation.
 */
export function Intro({
  brand,
  location,
}: {
  brand: string;
  location: string;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("lensaeri:intro") === "1";
    } catch {
      /* private mode — just play it */
    }
    if (reduced || seen) return;

    setPlaying(true);
    try {
      sessionStorage.setItem("lensaeri:intro", "1");
    } catch {
      /* no-op */
    }
    const timer = setTimeout(() => setPlaying(false), 4100);
    return () => clearTimeout(timer);
  }, []);

  if (!playing) return null;

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
        <div className="intro__wordmark">{brand}</div>
        <div className="intro__place">{location}</div>
      </div>
    </div>
  );
}
