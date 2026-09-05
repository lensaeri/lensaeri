-- Portfolio items can embed a TikTok video instead of an uploaded image/video
-- (see src/lib/tiktok.ts) — paste the video's own URL (not just a handle),
-- e.g. https://www.tiktok.com/@handle/video/7211234567890123456. When set,
-- the public portfolio grid embeds that clip in place of image_path.
alter table portfolio_items
  add column if not exists tiktok_url text;
