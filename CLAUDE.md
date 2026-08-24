# Lensaeri

A wedding studio marketing site (Kuching, Sarawak) with a fully editable
admin panel. Next.js 15 (App Router) + Supabase (Postgres, Auth, Storage) +
Vercel.

The visual design — dark cinematic theme, intro animation, scroll reveals,
image slots, filterable portfolio grid — was ported from a Claude Design
canvas export (`design/lensaeri-canvas.html`, kept for reference only, not
part of the build). Every piece of copy and every image on the public site
is stored in Supabase and editable at `/admin` — nothing is hardcoded except
fallback defaults used before the database has content.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions) + React 19
- **Supabase**: Postgres (content tables + RLS), Auth (email/password for
  admin), Storage (`media` bucket for all uploaded images)
- **Vercel**: hosting, deployed from the `main` branch on GitHub
- Fonts: Cormorant Garamond (serif) + Jost (sans), via `next/font/google`
- No CSS framework — a hand-written design system in `src/app/globals.css`
  (public site) and `src/app/admin/admin.css` (admin), both token-driven off
  the same `:root` custom properties

## Repo map

```
src/app/(site)/          Public pages — home, about, services, portfolio, packages
src/app/(site)/layout.tsx  Site chrome: grain overlay, intro animation, nav
src/app/admin/            Admin panel — one route per content type, all
                           gated by middleware.ts (redirects to /admin/login)
src/app/admin/actions.ts  Every admin mutation (Server Actions). Auth check
                           lives here (requireUser()), not just in middleware.
src/app/actions.ts        Public server action: the inquiry form submit handler.
src/components/site/      Public-facing UI (Nav, Footer, Hero, ImageSlot, Reveal…)
src/components/admin/     Admin UI (ImageField uploader, SaveBar, per-entity cards)
src/lib/supabase/         client.ts (browser), server.ts (RSC/Server Actions,
                           cookie-based session), middleware.ts (session refresh + guard)
src/lib/content.ts        All read queries, each with a hardcoded fallback so
                           pages never blank out if Supabase is unreachable
src/lib/media.ts          Storage path → public URL resolver (used by both
                           client and server code, so it has no server-only imports)
src/lib/types.ts          Row types matching the Postgres schema
supabase/migrations/      SQL schema + RLS policies (0001_init.sql)
supabase/seed.sql         Idempotent seed — transcribes the original design's copy
design/lensaeri-canvas.html   Original design export. Reference only.
```

## Content model

Every editable thing lives in one of these tables (see
`supabase/migrations/0001_init.sql` for full definitions):

| Table              | Powers                                                   |
|---------------------|-----------------------------------------------------------|
| `site_settings`     | Brand name, contact info, social links, hero + founder images (singleton, `id = 1`) |
| `content_blocks`    | Every headline/paragraph on the 5 public pages, keyed by a stable `key` (e.g. `home.hero.title`) |
| `services`          | "What We Do" sections — home preview cards + full Services page rows. **Unlimited rows** — admin can add/remove sections freely |
| `portfolio_items`   | The filterable Portfolio grid |
| `testimonials`      | Client quotes; one may be flagged `is_hero` for the home page pull-quote |
| `packages`          | Pricing tiers |
| `gallery_images`    | Two loose collections: `teaser` (home strip) and `bts` (About page grid) |
| `inquiries`         | Contact form submissions (public insert, admin-only read) |

**RLS pattern**, applied uniformly: every content table allows `select` to
`anon, authenticated` and `insert/update/delete` to `authenticated` only.
`inquiries` is the mirror image — public `insert`, admin-only everything
else. There is no service-role key anywhere in the app: admin writes run
under the signed-in admin's own Supabase session, and Postgres RLS is the
actual gate. See the `do $$ ... $$` block in the migration for how the
policies are generated per table.

Storage: one public bucket named `media`. Anyone can read; only
authenticated users can write. The admin's `ImageField` component
(`src/components/admin/ImageField.tsx`) uploads directly from the browser
using the admin's session — no server-side upload path exists.

## Adding a new editable field

1. Add the column to a migration (new file in `supabase/migrations/`, don't
   edit `0001_init.sql` after it's been applied anywhere).
2. Add it to the matching type in `src/lib/types.ts`.
3. Add it to the default fallback object in `src/lib/content.ts` if it's on
   a singleton/list that already has one.
4. Read it in the public page component.
5. Add a form field for it in the matching admin card/form component, and
   include it in the matching action in `src/app/admin/actions.ts`.

## Adding a new "add more sections" pattern

`services` is the reference implementation for "admin can add unlimited
items of this type": `addService()` inserts a blank draft row (unpublished,
appended to the end of `sort_order`), `ServiceCard` renders one editable
card per row with its own save/delete forms, and the public Services page
just maps over whatever rows come back — no code change needed when a
section is added or removed. `portfolio_items`, `packages`, `testimonials`,
and `gallery_images` all follow the same shape.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's values
npm run dev
```

Pages render even with no `.env.local` / an unreachable Supabase project —
every read in `src/lib/content.ts` catches errors and falls back to a
hardcoded default (see the `safe()` wrapper). This is deliberate: it lets
the site be previewed before the database is provisioned, and keeps a
Supabase outage from ever producing a blank page in production. A 6-second
fetch timeout on the server Supabase client (`src/lib/supabase/server.ts`)
bounds the worst case.

## Database setup (first time)

Run once against a fresh Supabase project, in order:

```bash
# Paste the contents of these two files into the Supabase SQL Editor
# (Dashboard → SQL Editor → New query), or run via `supabase db push`
# if the CLI is linked:
supabase/migrations/0001_init.sql   # schema, RLS, storage bucket + policies
supabase/seed.sql                   # starter content (idempotent, safe to re-run)
```

Then create the admin login: Dashboard → Authentication → Users → Add user
(email + password, "Auto Confirm User" checked). That's the only account
that can sign in at `/admin` — there is no self-service signup.

## Deployment

Hosted on Vercel, connected to this GitHub repo's `main` branch. Required
environment variables (Vercel → Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL          # the production URL, e.g. https://lensaeri.vercel.app
```

No service-role key is needed in any environment — see the RLS note above.

## Conventions

- Public pages are Server Components; anything interactive (nav toggle,
  scroll reveal, the portfolio filter, the inquiry form, image upload) is a
  small `"use client"` leaf component, not a whole-page client boundary.
- Admin mutations are Server Actions using `useActionState`, returning
  `{ ok } | { error }` and rendered via the shared `<Flash>` /
  `<SaveButton>` components in `src/components/admin/SaveBar.tsx` — new
  admin forms should follow that same shape rather than rolling their own
  pending/error state.
- `revalidateSite()` in `src/app/admin/actions.ts` revalidates `/` with
  `"layout"` scope after every content mutation, so public pages (ISR,
  `revalidate = 60`) update within a minute, or immediately after any admin
  save.
- Design tokens (`--ink`, `--cream`, `--serif`, `--sans`, spacing, easing)
  live once in `globals.css` `:root` and are reused as-is in `admin.css` —
  keep new UI on those tokens rather than introducing new colors.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
