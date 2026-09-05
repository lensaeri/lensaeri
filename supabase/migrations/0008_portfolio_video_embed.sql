-- Generalizes the TikTok-only embed field into "any video link" — YouTube
-- works the same way now (see src/lib/videoEmbed.ts). Renaming rather than
-- dropping preserves already-saved TikTok data; embed_provider records
-- which resolver produced the id, so the public page knows which iframe
-- src to build.
alter table portfolio_items rename column tiktok_url to embed_url;
alter table portfolio_items rename column tiktok_video_id to embed_video_id;

alter table portfolio_items add column if not exists embed_provider text
  check (embed_provider in ('tiktok', 'youtube'));

update portfolio_items
set embed_provider = 'tiktok'
where embed_url is not null and embed_provider is null;
