-- Phone number and email address for the inquirer, collected alongside the
-- rest of the Packages page contact form. `email` is the address the
-- automatic confirmation email is sent to, so it's required going forward;
-- existing rows get an empty-string default rather than a hard not-null to
-- avoid a backfill migration.
alter table public.inquiries
  add column if not exists phone text not null default '',
  add column if not exists email text not null default '';
