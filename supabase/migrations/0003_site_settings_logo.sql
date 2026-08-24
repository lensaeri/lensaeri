-- Site logo (used in the nav and the intro title card), same "Storage path or
-- null" shape as hero_image_path / founder_image_path — editable at
-- /admin/settings, falls back to the plain text brand name when unset.
alter table site_settings
  add column if not exists logo_path text;
