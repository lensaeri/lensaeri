-- Optional photo for a testimonial (e.g. the studio's team with the couple),
-- shown as a rectangular photo alongside the quote on the home page.
-- Nullable — the public page simply omits it when unset.
alter table public.testimonials
  add column if not exists photo_path text;
