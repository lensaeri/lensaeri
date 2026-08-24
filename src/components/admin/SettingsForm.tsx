"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { Flash, SaveButton } from "@/components/admin/SaveBar";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, null);

  return (
    <form action={action}>
      <Flash state={state} />

      <section className="card">
        <div className="card__head">
          <h2 className="card__title">Brand</h2>
        </div>

        <div className="grid-2">
          <label className="f">
            <span>Brand name</span>
            <input type="text" name="brand_name" defaultValue={settings.brand_name} />
            <span className="f__hint">Shown in the nav, footer and intro card.</span>
          </label>
          <label className="f">
            <span>Intro card subtitle</span>
            <input
              type="text"
              name="brand_location"
              defaultValue={settings.brand_location}
            />
          </label>
        </div>

        <label className="f">
          <span>Footer blurb</span>
          <textarea name="footer_blurb" rows={2} defaultValue={settings.footer_blurb} />
        </label>

        <label className="f">
          <span>Copyright line</span>
          <input type="text" name="copyright" defaultValue={settings.copyright} />
        </label>
      </section>

      <section className="card">
        <div className="card__head">
          <h2 className="card__title">Contact</h2>
        </div>

        <div className="grid-3">
          <label className="f">
            <span>Email</span>
            <input type="email" name="email" defaultValue={settings.email} />
          </label>
          <label className="f">
            <span>Phone</span>
            <input type="text" name="phone" defaultValue={settings.phone} />
          </label>
          <label className="f">
            <span>Location</span>
            <input type="text" name="location" defaultValue={settings.location} />
          </label>
        </div>

        <div className="grid-3">
          <label className="f">
            <span>Instagram handle</span>
            <input
              type="text"
              name="instagram_handle"
              defaultValue={settings.instagram_handle}
            />
          </label>
          <label className="f">
            <span>Instagram URL</span>
            <input
              type="text"
              name="instagram_url"
              defaultValue={settings.instagram_url}
            />
          </label>
          <label className="f">
            <span>WhatsApp number</span>
            <input
              type="text"
              name="whatsapp_number"
              defaultValue={settings.whatsapp_number}
            />
            <span className="f__hint">
              Digits only, with country code — e.g. 60123456789
            </span>
          </label>
        </div>
      </section>

      <section className="card">
        <div className="card__head">
          <h2 className="card__title">Images</h2>
        </div>

        <ImageField
          name="hero_image_path"
          label="Home hero — full-bleed background"
          value={settings.hero_image_path}
          folder="hero"
        />

        <ImageField
          name="founder_image_path"
          label="About page — founder portrait"
          value={settings.founder_image_path}
          folder="about"
        />
      </section>

      <div style={{ position: "sticky", bottom: 0, padding: "16px 0", background: "var(--ink)" }}>
        <SaveButton label="Save settings" />
      </div>
    </form>
  );
}
