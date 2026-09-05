import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { HeroParallax } from "@/components/site/HeroParallax";
import { ImageSlot } from "@/components/site/ImageSlot";
import { Reveal } from "@/components/site/Reveal";
import {
  getCopy,
  getGallery,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/content";
import { mediaUrl } from "@/lib/media";

export const revalidate = 60;

export default async function HomePage() {
  const [copy, settings, services, teasers, testimonials] = await Promise.all([
    getCopy(),
    getSettings(),
    getServices(),
    getGallery("teaser"),
    getTestimonials(),
  ]);

  const heroQuote = testimonials.find((t) => t.is_hero);
  const cards = testimonials.filter((t) => !t.is_hero).slice(0, 3);

  return (
    <main>
      <HeroParallax
        imagePath={settings.hero_image_path}
        eyebrow={copy(
          "home.hero.eyebrow",
          "Kuching, Sarawak — Wedding Films & Content"
        )}
        title={copy("home.hero.title", "Your day, held")}
        titleEm={copy("home.hero.title_em", "quietly cinematic.")}
        body={copy(
          "home.hero.body",
          "Lensaeri films, photographs and stands beside couples across Borneo — present, unobtrusive, entirely yours."
        )}
        ctaPrimary={copy("home.hero.cta_primary", "View Portfolio")}
        ctaSecondary={copy("home.hero.cta_secondary", "See Packages")}
      />

      {/* SERVICES PREVIEW */}
      <Reveal className="section">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          {copy("home.services.eyebrow", "What We Do")}
        </div>
        <h2 className="section__title">
          {copy(
            "home.services.title",
            "Three ways we walk alongside your day"
          )}
        </h2>
        <div className="services-preview">
          {services.map((service) => (
            <Link
              key={service.id}
              href="/services"
              className="service-card"
              style={{ color: "inherit" }}
            >
              <div className="service-card__num">{service.number}</div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.short_desc}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* PORTFOLIO TEASER */}
      <Reveal className="" as="section">
        <div style={{ borderTop: "1px solid var(--line)" }}>
          <div className="teaser-head">
            <h2 className="teaser-head__title">
              {copy("home.portfolio.title", "Recent Films & Frames")}
            </h2>
            <Link href="/portfolio" className="link-underline">
              {copy("home.portfolio.link", "Full Portfolio")}
            </Link>
          </div>
          <div className="teaser-grid">
            {teasers.map((img, i) => (
              <ImageSlot
                key={img.id}
                path={img.image_path}
                alt={img.image_alt}
                placeholder={`Portfolio image ${i + 1}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 20vw"
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* TESTIMONIALS */}
      <Reveal className="section">
        <div className="testimonial-hero">
          <div className="eyebrow" style={{ marginBottom: 26 }}>
            {copy("home.testimonial.eyebrow", "Kind Words")}
          </div>
          {heroQuote && (
            <>
              <p className="testimonial-hero__quote">{heroQuote.quote}</p>
              {heroQuote.photo_path && (
                <Image
                  src={mediaUrl(heroQuote.photo_path)!}
                  alt={heroQuote.author}
                  width={64}
                  height={64}
                  className="testimonial-hero__avatar"
                />
              )}
              <div className="meta" style={{ color: "var(--cream-55)" }}>
                {heroQuote.author}
                {heroQuote.meta ? ` — ${heroQuote.meta}` : ""}
              </div>
            </>
          )}
        </div>
        <div className="testimonial-grid">
          {cards.map((t) => (
            <figure key={t.id} className="testimonial" style={{ margin: 0 }}>
              <div className="testimonial__mark" aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className="testimonial__quote" style={{ margin: 0 }}>
                {t.quote}
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {t.photo_path && (
                  <Image
                    src={mediaUrl(t.photo_path)!}
                    alt={t.author}
                    width={44}
                    height={44}
                    className="testimonial__avatar"
                  />
                )}
                <div>
                  <div className="testimonial__author">{t.author}</div>
                  <div className="testimonial__meta">{t.meta}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <Footer settings={settings} />
    </main>
  );
}
