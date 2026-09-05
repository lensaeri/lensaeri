-- Short changelog of engineering changes to the site, visible only at
-- /admin/updates — internal bookkeeping, not public site content. RLS
-- mirrors the `inquiries` table: entries can be logged (inserted) by the
-- assistant's own tooling using only the public anon key, same as any
-- visitor's browser can, but reading, and deleting, is admin-only. There is
-- deliberately no update policy — entries are an immutable log, not
-- editable rows.
create table if not exists public.system_updates (
  id         uuid primary key default gen_random_uuid(),
  summary    text not null,
  created_at timestamptz not null default now()
);

create index if not exists system_updates_created_idx
  on public.system_updates (created_at desc);

alter table public.system_updates enable row level security;

drop policy if exists system_updates_admin_all on public.system_updates;

drop policy if exists system_updates_public_insert on public.system_updates;
create policy system_updates_public_insert on public.system_updates
  for insert to anon, authenticated with check (true);

drop policy if exists system_updates_admin_read on public.system_updates;
create policy system_updates_admin_read on public.system_updates
  for select to authenticated using (true);

drop policy if exists system_updates_admin_delete on public.system_updates;
create policy system_updates_admin_delete on public.system_updates
  for delete to authenticated using (true);
