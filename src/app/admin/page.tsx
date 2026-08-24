import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = await createClient();
  const tables = [
    "services",
    "portfolio_items",
    "packages",
    "testimonials",
    "gallery_images",
  ] as const;

  const results = await Promise.all(
    tables.map((t) =>
      supabase.from(t).select("*", { count: "exact", head: true })
    )
  );

  const { count: unread } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return {
    services: results[0].count ?? 0,
    portfolio: results[1].count ?? 0,
    packages: results[2].count ?? 0,
    testimonials: results[3].count ?? 0,
    gallery: results[4].count ?? 0,
    unread: unread ?? 0,
  };
}

export default async function AdminDashboard() {
  const c = await counts();

  const tiles = [
    {
      href: "/admin/content",
      name: "Page Text",
      count: null,
      desc: "Every headline and paragraph across the five public pages.",
    },
    {
      href: "/admin/services",
      name: "Services",
      count: c.services,
      desc: "Add, edit or remove service sections. New ones appear on the Services page automatically.",
    },
    {
      href: "/admin/portfolio",
      name: "Portfolio",
      count: c.portfolio,
      desc: "The filterable grid of films and frames.",
    },
    {
      href: "/admin/packages",
      name: "Packages",
      count: c.packages,
      desc: "Pricing tiers and what each one includes.",
    },
    {
      href: "/admin/testimonials",
      name: "Testimonials",
      count: c.testimonials,
      desc: "Client quotes, including the large one on the home page.",
    },
    {
      href: "/admin/gallery",
      name: "Gallery",
      count: c.gallery,
      desc: "The home teaser strip and the behind-the-scenes grid.",
    },
    {
      href: "/admin/settings",
      name: "Settings",
      count: null,
      desc: "Contact details, social links, hero and founder images.",
    },
    {
      href: "/admin/inquiries",
      name: "Inquiries",
      count: c.unread,
      desc: c.unread > 0 ? `${c.unread} unread` : "Contact form submissions.",
    },
  ];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Dashboard</h1>
      </div>
      <p className="admin__lede">
        Everything on the public site is editable here. Changes go live within a
        minute — open the site in another tab to check your work.
      </p>

      <div className="tiles">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="tile">
            {tile.count !== null && <div className="tile__count">{tile.count}</div>}
            <div className="tile__name">{tile.name}</div>
            <div className="tile__desc">{tile.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
