"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/content", label: "Page Text" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/inquiries", label: "Inquiries", badge: true },
  { href: "/admin/updates", label: "System Updates" },
];

export function AdminNav({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();

  return (
    <aside className="admin__side">
      <div className="admin__brand">LENSAERI</div>
      <div className="admin__brand-sub">Studio Admin</div>

      <nav className="admin__nav">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin__link ${active ? "admin__link--active" : ""}`.trim()}
            >
              {link.label}
              {link.badge && unread > 0 && (
                <span className="admin__badge">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="admin__side-foot">
        <Link href="/" target="_blank" className="admin__link" style={{ padding: 0 }}>
          View site ↗
        </Link>
        <div style={{ fontSize: 11, color: "var(--cream-45)", wordBreak: "break-all" }}>
          {email}
        </div>
        <form action={signOut}>
          <button type="submit" className="b b--sm">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
