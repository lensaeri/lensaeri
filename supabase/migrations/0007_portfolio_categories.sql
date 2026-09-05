-- A managed list of portfolio categories, so the admin's category field can
-- be a closed dropdown instead of free text — edited via a popup on the
-- Portfolio admin page (see CategoryManager.tsx). Not read by the public
-- site: the portfolio filter still derives its options from whatever
-- category values are actually on published items (see
-- (site)/portfolio/page.tsx), unchanged. Admin-only end to end, same
-- reasoning as system_updates — this is admin tooling, not public content.
create table if not exists public.portfolio_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_categories_order_idx
  on public.portfolio_categories (sort_order);

alter table public.portfolio_categories enable row level security;

drop policy if exists portfolio_categories_admin_all on public.portfolio_categories;
create policy portfolio_categories_admin_all on public.portfolio_categories
  for all to authenticated using (true) with check (true);

-- Seed with whatever categories are already in use, so existing items keep
-- a valid option in the new dropdown.
insert into public.portfolio_categories (name, sort_order)
select category, (row_number() over (order by category)) * 10
from (
  select distinct category from public.portfolio_items
  where coalesce(category, '') <> ''
) c
on conflict (name) do nothing;

-- "Grid height" (tall) option removed from the admin — every item is
-- standard height now.
update public.portfolio_items set span = 1 where span <> 1;
