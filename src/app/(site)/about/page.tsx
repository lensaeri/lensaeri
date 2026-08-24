import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { ImageSlot } from "@/components/site/ImageSlot";
import { Orbit } from "@/components/site/Orbit";
import { Reveal } from "@/components/site/Reveal";
import { getCopy, getGallery, getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Lensaeri — a wedding studio in Kuching, Sarawak.",
};

export default async function AboutPage() {
  const [copy, settings, bts] = await Promise.all([
    getCopy(),
    getSettings(),
    getGallery("bts"),
  ]);

  return (
    <main className="page-top">
      <section className="about-intro">
        <Orbit style={{ top: -90, right: -40 }} />
        <ImageSlot
          path={settings.founder_image_path}
          alt={copy("about.founder_name", "Founder")}
          placeholder="Founder portrait"
          className="about-intro__media"
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority
        />
        <div className="about-intro__body">
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            {copy("about.eyebrow", "Our Story")}
          </div>
          <h1 className="about-intro__title">
            {copy(
              "about.title",
              "Founded on the belief a wedding day is too fast to be captured loudly."
            )}
          </h1>
          <p className="prose">{copy("about.body_1")}</p>
          <p className="prose" style={{ marginBottom: 34 }}>
            {copy("about.body_2")}
          </p>
          <div className="byline">{copy("about.founder_name", "Ain Sofea")}</div>
          <div className="byline__role">
            {copy("about.founder_role", "Founder & Lead Creator")}
          </div>
        </div>
      </section>

      <Reveal className="section" >
        <p className="pull-quote" style={{ textAlign: "center" }}>
          {copy(
            "about.mission",
            "“We exist to hold your wedding day gently — present, unobtrusive, and entirely yours.”"
          )}
        </p>
      </Reveal>

      <Reveal
        className=""
        as="section"
      >
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "90px var(--gutter) 110px",
          }}
        >
          <div className="bts-head">
            <h2 className="bts-head__title">
              {copy("about.bts_title", "Behind the Scenes")}
            </h2>
            <div className="meta">{copy("about.bts_meta", "On set, off duty")}</div>
          </div>
          <div className="bts-grid">
            {bts.map((img, i) => (
              <ImageSlot
                key={img.id}
                path={img.image_path}
                alt={img.image_alt}
                placeholder={`BTS ${i + 1}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ))}
          </div>
        </div>
      </Reveal>

      <Footer settings={settings} />
    </main>
  );
}
