-- ============================================================================
-- Lensaeri — initial schema
-- Content tables are public-readable; every write requires an authenticated
-- (admin) session. Inquiries are the mirror image: public insert, admin read.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- helper: keep updated_at honest
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- site_settings — single row (id = 1) of studio-wide details
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                integer primary key default 1,
  brand_name        text not null default 'LENSAERI',
  brand_location    text not null default 'Kuching · Sarawak',
  footer_blurb      text not null default 'Wedding content, videography and bride assistance based in Kuching, Sarawak.',
  email             text not null default 'hello@lensaeri.com',
  phone             text not null default '+60 12-345 6789',
  location          text not null default 'Kuching, Sarawak',
  instagram_handle  text not null default '@lensaeri.studio',
  instagram_url     text not null default 'https://instagram.com/lensaeri.studio',
  whatsapp_number   text not null default '60123456789',
  copyright         text not null default '© 2026 LENSAERI STUDIO. ALL RIGHTS RESERVED.',
  -- Singleton images that do not belong to any repeatable collection.
  hero_image_path     text,
  founder_image_path  text,
  updated_at        timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- content_blocks — every editable headline / paragraph on the marketing pages.
-- Keyed by a stable slug so the front end can ask for copy by name and fall
-- back to a hardcoded default if the row is missing.
-- ---------------------------------------------------------------------------
create table if not exists public.content_blocks (
  key         text primary key,
  page        text not null,
  label       text not null,
  value       text not null default '',
  field_type  text not null default 'text' check (field_type in ('text', 'textarea')),
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists content_blocks_page_idx on public.content_blocks (page, sort_order);

create trigger content_blocks_touch
  before update on public.content_blocks
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- services — the "what we do" sections. Admin can add unlimited rows; the
-- Services page renders one alternating full-width section per row and the
-- home page previews the first few.
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  number        text not null default '01',
  title         text not null,
  short_desc    text not null default '',
  full_desc     text not null default '',
  points        text[] not null default '{}',
  image_path    text,
  image_alt     text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists services_order_idx on public.services (sort_order);

create trigger services_touch
  before update on public.services
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- portfolio_items — the filterable grid. `span` controls grid-row-end so the
-- masonry rhythm of the design survives content edits.
-- ---------------------------------------------------------------------------
create table if not exists public.portfolio_items (
  id            uuid primary key default gen_random_uuid(),
  caption       text not null default '',
  category      text not null default 'Weddings',
  image_path    text,
  image_alt     text not null default '',
  span          integer not null default 1 check (span between 1 and 2),
  sort_order    integer not null default 0,
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists portfolio_order_idx on public.portfolio_items (sort_order);
create index if not exists portfolio_category_idx on public.portfolio_items (category);

create trigger portfolio_touch
  before update on public.portfolio_items
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  quote         text not null,
  author        text not null default '',
  meta          text not null default '',
  is_hero       boolean not null default false,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists testimonials_order_idx on public.testimonials (sort_order);

create trigger testimonials_touch
  before update on public.testimonials
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- packages — pricing tiers
-- ---------------------------------------------------------------------------
create table if not exists public.packages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  badge         text not null default '',
  price         text not null default '',
  tagline       text not null default '',
  features      text[] not null default '{}',
  is_featured   boolean not null default false,
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists packages_order_idx on public.packages (sort_order);

create trigger packages_touch
  before update on public.packages
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_images — the loose image strips: home teaser row + about BTS grid
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  collection    text not null check (collection in ('teaser', 'bts')),
  image_path    text,
  image_alt     text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists gallery_collection_idx on public.gallery_images (collection, sort_order);

create trigger gallery_touch
  before update on public.gallery_images
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- inquiries — contact form submissions
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  event_date   date,
  location     text not null default '',
  package      text not null default '',
  message      text not null default '',
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.site_settings   enable row level security;
alter table public.content_blocks  enable row level security;
alter table public.services        enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials    enable row level security;
alter table public.packages        enable row level security;
alter table public.gallery_images  enable row level security;
alter table public.inquiries       enable row level security;

-- Public read + admin write, applied uniformly to the content tables.
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'content_blocks', 'services',
    'portfolio_items', 'testimonials', 'packages', 'gallery_images'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_public_read', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      t || '_admin_write', t
    );
  end loop;
end $$;

-- Inquiries: anyone may submit, only admins may read or manage.
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists inquiries_admin_read on public.inquiries;
create policy inquiries_admin_read on public.inquiries
  for select to authenticated using (true);

drop policy if exists inquiries_admin_update on public.inquiries;
create policy inquiries_admin_update on public.inquiries
  for update to authenticated using (true) with check (true);

drop policy if exists inquiries_admin_delete on public.inquiries;
create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated using (true);

-- ============================================================================
-- Storage — public read bucket for site media, admin-only writes
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
