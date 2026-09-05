/**
 * Portfolio items can embed a TikTok or YouTube video in place of an
 * uploaded image/video (see PortfolioCard / PortfolioGrid) from a single
 * "video link or embed code" field. This detects which platform the admin
 * pasted and hands off to the matching resolver (lib/tiktok.ts /
 * lib/youtube.ts), each of which turns it into the numeric/alphanumeric
 * video id its own embed player needs.
 */

import { resolveTiktokVideoId, tiktokEmbedSrc } from "@/lib/tiktok";
import { resolveYoutubeVideoId, youtubeEmbedSrc } from "@/lib/youtube";

export type EmbedProvider = "tiktok" | "youtube";

export type EmbedResolution =
  | { ok: true; provider: EmbedProvider; videoId: string; url: string }
  | { ok: false; error: string };

function detectProvider(input: string): EmbedProvider | null {
  if (/tiktok\.com|data-video-id=/i.test(input)) return "tiktok";
  if (/youtube(?:-nocookie)?\.com|youtu\.be/i.test(input)) return "youtube";
  return null;
}

export async function resolveVideoEmbed(input: string): Promise<EmbedResolution> {
  const trimmed = input.trim();
  const provider = detectProvider(trimmed);
  if (!provider) {
    return {
      ok: false,
      error: "That doesn't look like a TikTok or YouTube link or embed code.",
    };
  }

  const resolved =
    provider === "tiktok"
      ? await resolveTiktokVideoId(trimmed)
      : await resolveYoutubeVideoId(trimmed);

  if (!resolved.ok) return resolved;
  return { ok: true, provider, videoId: resolved.videoId, url: resolved.url };
}

/** iframe src for whichever platform's embed player, given an already-resolved video id. */
export function videoEmbedSrc(
  provider: EmbedProvider | null | undefined,
  videoId: string | null | undefined
): string | null {
  if (!provider || !videoId) return null;
  return provider === "tiktok" ? tiktokEmbedSrc(videoId) : youtubeEmbedSrc(videoId);
}
