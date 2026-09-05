-- Optional headshot for a testimonial, shown as a small circular avatar next
-- to the quote on the home page. Nullable — most testimonials won't have
-- one, and the public page simply omits the avatar when it's unset.
alter table public.testimonials
  add column if not exists photo_path text;
