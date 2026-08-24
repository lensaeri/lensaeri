import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { ImageSlot } from "@/components/site/ImageSlot";
import { Orbit } from "@/components/site/Orbit";
import { Reveal } from "@/components/site/Reveal";
import { getCopy, getServices, getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Content creation, videography and bride assistance for weddings across Sarawak.",
};

export default async function ServicesPage() {
  const [copy, settings, services] = await Promise.all([
    getCopy(),
    getSettings(),
    getServices(),
  ]);

  return (
    <main className="page-top">
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "0 var(--gutter) 70px",
        }}
      >
        <Orbit style={{ top: -70, right: 80 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {copy("services.eyebrow", "Services")}
          </div>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(34px, 4.6vw, 58px)",
              margin: 0,
              maxWidth: 760,
            }}
          >
            {copy("services.title", "Three roles, one quiet attention")}
          </h1>
        </div>
      </section>

      {services.map((service, i) => (
        <Reveal
          key={service.id}
          className={`service-row ${i % 2 === 1 ? "service-row--flip" : ""}`.trim()}
        >
          <div className="service-row__text">
            <div className="service-row__num">{service.number}</div>
            <h2 className="service-row__title">{service.title}</h2>
            <p className="service-row__desc">
              {service.full_desc || service.short_desc}
            </p>
            <div>
              {service.points.map((point) => (
                <div className="point" key={point}>
                  <span className="point__dash">—</span>
                  <span className="point__text">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <ImageSlot
            path={service.image_path}
            alt={service.image_alt || service.title}
            placeholder={`${service.title} image`}
            className="service-row__media"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
      ))}

      <Footer settings={settings} />
    </main>
  );
}
