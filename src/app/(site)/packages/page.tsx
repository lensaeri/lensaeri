import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Orbit } from "@/components/site/Orbit";
import { Reveal } from "@/components/site/Reveal";
import { getCopy, getPackages, getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Wedding film, photo and bride-assistance packages for couples in Kuching and across Borneo.",
};

export default async function PackagesPage() {
  const [copy, settings, packages] = await Promise.all([
    getCopy(),
    getSettings(),
    getPackages(),
  ]);

  return (
    <main className="page-top">
      <section className="packages-head">
        <Orbit style={{ top: -80, left: "50%", marginLeft: -150 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {copy("packages.eyebrow", "Packages & Pricing")}
          </div>
          <h1 className="packages-head__title">
            {copy("packages.title", "Choose how we walk beside your day")}
          </h1>
          <p style={{ fontSize: 14, color: "var(--cream-55)", margin: 0 }}>
            {copy("packages.note")}
          </p>
        </div>
      </section>

      <Reveal className="tiers">
        {packages.map((tier) => (
          <div
            key={tier.id}
            className={`tier ${tier.is_featured ? "tier--featured" : ""}`.trim()}
          >
            <div className="tier__badge">{tier.badge}</div>
            <h2 className="tier__name">{tier.name}</h2>
            <div className="tier__price">{tier.price}</div>
            <div className="tier__tagline">{tier.tagline}</div>
            <ul className="tier__features">
              {tier.features.map((feature) => (
                <li className="tier__feature" key={feature}>
                  <span aria-hidden="true">—</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#enquire"
              className={`btn tier__cta ${
                tier.is_featured ? "btn--solid" : "btn--outline"
              }`}
            >
              Enquire
            </a>
          </div>
        ))}
      </Reveal>

      <Reveal className="booking">
        <div id="enquire" style={{ scrollMarginTop: 120 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {copy("packages.book_eyebrow", "Book Now")}
          </div>
          <h2 className="booking__title">
            {copy("packages.book_title", "Tell us about your day")}
          </h2>
          <p className="booking__body">{copy("packages.book_body")}</p>
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ padding: "16px 28px" }}
          >
            Message on WhatsApp
          </a>
          <div className="booking__contacts">
            <div className="booking__contact">
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
            <div className="booking__contact">
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                {settings.phone}
              </a>
            </div>
            <div className="booking__contact">{copy("packages.book_contact")}</div>
          </div>
        </div>

        <InquiryForm
          packages={packages.map((p) => p.name)}
          thanksTitle={copy("packages.thanks_title", "Thank you.")}
          thanksBody={copy(
            "packages.thanks_body",
            "We've received your inquiry and will be in touch within 48 hours."
          )}
        />
      </Reveal>

      <Footer settings={settings} />
    </main>
  );
}
