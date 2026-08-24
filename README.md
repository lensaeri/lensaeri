# Lensaeri

Wedding films, photography and bride assistance — Kuching, Sarawak.

A Next.js + Supabase site with a full admin panel: every headline,
paragraph, image, service, portfolio item, package, and testimonial on the
public site is editable at `/admin`, and new service/portfolio/package
sections can be added without touching code.

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture, content model, and
setup instructions.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Supabase project's URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin
panel (requires a Supabase Auth user — see `CLAUDE.md` → *Database setup*).

## Stack

Next.js 15 (App Router) · React 19 · Supabase (Postgres + Auth + Storage) ·
Vercel
