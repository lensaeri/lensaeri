"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mediaUrl } from "@/lib/media";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
];

export function Nav({ brand, logoPath }: { brand: string; logoPath?: string | null }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setSolid(window.scrollY > 40);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const logoSrc = mediaUrl(logoPath);

  return (
    <nav className={`nav ${solid ? "nav--solid" : ""}`.trim()}>
      <Link href="/" className="nav__brand" aria-label={brand}>
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={brand}
            width={220}
            height={52}
            priority
            className="nav__logo"
          />
        ) : (
          brand
        )}
      </Link>

      <div className="nav__links" data-open={open}>
        {LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav__link ${active ? "nav__link--active" : ""}`.trim()}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link href="/packages" className="btn btn--outline btn--nav">
        Enquire
      </Link>

      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
