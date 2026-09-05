/**
 * Portfolio items can embed a TikTok video in place of an uploaded
 * image/video (see PortfolioCard / PortfolioGrid). The admin pastes
 * whatever TikTok gives them — a full video URL, a shortened
 * vm.tiktok.com/vt.tiktok.com link, or the whole "Embed" blockquote
 * snippet — and `resolveTiktokVideoId` turns that into the numeric video id
 * TikTok's embed player needs. The blockquote snippet already carries the
 * id in its `data-video-id` attribute, so that case is resolved locally
 * with no network call; a plain link is resolved via TikTok's own oEmbed
 * API, server-side (in the savePortfolioItem Server Action, not on every
 * public page render) so a short link's redirect resolves the same way a
 * full URL does, with no browser CORS involved. Either way the result is
 * cached in `tiktok_video_id`.
 */

const OEMBED_TIMEOUT_MS = 8000;

export type TiktokResolution =
  | { ok: true; videoId: string; url: string }
  | { ok: false; error: string };

export async function resolveTiktokVideoId(input: string): Promise<TiktokResolution> {
  const trimmed = input.trim();

  // The "Embed" share option gives a <blockquote> with the id already on it.
  const embeddedId = trimmed.match(/data-video-id="(\d+)"/)?.[1];
  if (embeddedId) {
    const cite = trimmed.match(/cite="([^"]+)"/)?.[1];
    return { ok: true, videoId: embeddedId, url: cite ?? trimmed };
  }

  let res: Response;
  try {
    res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(trimmed)}`, {
      signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, error: "Couldn't reach TikTok to verify that link — try again." };
  }

  if (!res.ok) {
    return { ok: false, error: "That doesn't look like a public TikTok video link." };
  }

  const data = (await res.json().catch(() => null)) as {
    embed_product_id?: string;
    html?: string;
  } | null;

  const videoId = data?.embed_product_id || data?.html?.match(/data-video-id="(\d+)"/)?.[1];
  if (!videoId) {
    return { ok: false, error: "Couldn't find a video id in that TikTok link." };
  }

  return { ok: true, videoId, url: trimmed };
}

/** iframe src for TikTok's embed player, given an already-resolved video id. */
export function tiktokEmbedSrc(videoId: string | null | undefined): string | null {
  return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
}
