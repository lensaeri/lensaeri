/**
 * YouTube counterpart to lib/tiktok.ts — see lib/videoEmbed.ts for the
 * dispatcher that picks between the two. Unlike TikTok, a YouTube video id
 * is embedded directly in nearly every link format (watch, youtu.be,
 * Shorts, or a pasted <iframe> embed code), so it's pulled out locally with
 * a regex; a lightweight oEmbed call then just confirms the video is real
 * and public before it's saved.
 */

const OEMBED_TIMEOUT_MS = 8000;

export type YoutubeResolution =
  | { ok: true; videoId: string; url: string }
  | { ok: false; error: string };

function extractYoutubeId(input: string): string | null {
  const patterns = [
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/, // pasted <iframe> embed code
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // youtu.be/<id>
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/, // youtube.com/shorts/<id>
    /[?&]v=([A-Za-z0-9_-]{11})/, // youtube.com/watch?v=<id>
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function resolveYoutubeVideoId(input: string): Promise<YoutubeResolution> {
  const trimmed = input.trim();
  const videoId = extractYoutubeId(trimmed);
  if (!videoId) {
    return { ok: false, error: "Couldn't find a YouTube video id in that link." };
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  let res: Response;
  try {
    res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
      { signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS) }
    );
  } catch {
    return { ok: false, error: "Couldn't reach YouTube to verify that link — try again." };
  }

  if (!res.ok) {
    return { ok: false, error: "That doesn't look like a public YouTube video." };
  }

  return { ok: true, videoId, url: canonicalUrl };
}

/** iframe src for YouTube's privacy-enhanced embed player. */
export function youtubeEmbedSrc(videoId: string | null | undefined): string | null {
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}
