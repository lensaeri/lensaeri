import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="footer">
      <div>
        <div className="footer__brand">{settings.brand_name}</div>
        <p className="footer__blurb">{settings.footer_blurb}</p>
      </div>

      <div>
        <div className="footer__heading">Studio</div>
        <div className="footer__item">
          <Link href="/about">About</Link>
        </div>
        <div className="footer__item">
          <Link href="/services">Services</Link>
        </div>
        <div className="footer__item">
          <Link href="/portfolio">Portfolio</Link>
        </div>
      </div>

      <div>
        <div className="footer__heading">Contact</div>
        <div className="footer__item">
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </div>
        <div className="footer__item">
          <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
            {settings.phone}
          </a>
        </div>
        <div className="footer__item">{settings.location}</div>
      </div>

      <div>
        <div className="footer__heading">Follow</div>
        <div className="footer__item">
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
            Instagram — {settings.instagram_handle}
          </a>
        </div>
      </div>

      <div className="footer__legal">
        <span>{settings.copyright}</span>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}
