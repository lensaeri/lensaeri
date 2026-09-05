/**
 * Resolves NEXT_PUBLIC_SITE_URL into a URL, falling back to localhost if the
 * env var is unset or malformed — a bad value here must never fail the
 * build. Shared by root layout metadata, robots.ts and sitemap.ts so they
 * all agree on the same base URL.
 */
export function resolveSiteUrl(): URL {
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
