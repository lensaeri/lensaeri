/**
 * Storage path → public URL. Kept free of server-only imports so client
 * components can use it too.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/media/${path.replace(/^\/+/, "")}`;
}

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "ogv"]);

/**
 * Every "image_path" column also accepts video uploads (see ImageField /
 * ImageSlot) — there's no separate media-type column, so kind is inferred
 * from the stored file's extension.
 */
export function isVideoPath(path: string | null | undefined): boolean {
  if (!path) return false;
  const clean = path.split(/[?#]/)[0];
  const ext = clean.split(".").pop()?.toLowerCase();
  return !!ext && VIDEO_EXTENSIONS.has(ext);
}
