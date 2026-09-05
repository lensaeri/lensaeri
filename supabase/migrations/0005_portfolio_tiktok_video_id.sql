-- Numeric TikTok video id, resolved once (via TikTok's oEmbed API) from
-- whatever link the admin pasted into tiktok_url — see
-- resolveTiktokVideoId in src/lib/tiktok.ts. Cached here so the public
-- portfolio page never has to call out to TikTok itself.
alter table portfolio_items
  add column if not exists tiktok_video_id text;
