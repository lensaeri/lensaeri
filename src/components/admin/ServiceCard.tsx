"use client";

import { useActionState } from "react";
import { deleteService, saveService } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const [state, action] = useActionState(saveService, null);

  return (
    <section className="card">
      <form action={action}>
        <input type="hidden" name="id" value={service.id} />

        <div className="card__head">
          <h2 className="card__title">{service.title || "Untitled service"}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label className="check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={service.is_published}
              />
              Published
            </label>
          </div>
        </div>

        <Flash state={state} />

        <div className="grid-3">
          <label className="f">
            <span>Number</span>
            <input type="text" name="number" defaultValue={service.number} />
          </label>
          <label className="f">
            <span>Title</span>
            <input type="text" name="title" defaultValue={service.title} required />
          </label>
          <label className="f">
            <span>Order</span>
            <input type="number" name="sort_order" defaultValue={service.sort_order} />
          </label>
        </div>

        <label className="f">
          <span>Short description — home page card</span>
          <textarea name="short_desc" rows={2} defaultValue={service.short_desc} />
        </label>

        <label className="f">
          <span>Full description — services page</span>
          <textarea name="full_desc" rows={3} defaultValue={service.full_desc} />
        </label>

        <label className="f">
          <span>Bullet points — one per line</span>
          <textarea
            name="points"
            rows={4}
            defaultValue={service.points.join("\n")}
            placeholder={"Full-day photo coverage\nSame-week teaser gallery"}
          />
        </label>

        <ImageField value={service.image_path} folder="services" />

        <label className="f">
          <span>Image alt text</span>
          <input type="text" name="image_alt" defaultValue={service.image_alt} />
          <span className="f__hint">
            Describes the image for screen readers and search engines.
          </span>
        </label>

        <div className="row-actions">
          <SaveButton label="Save service" />
        </div>
      </form>

      <form action={deleteService} style={{ marginTop: 12 }}>
        <input type="hidden" name="id" value={service.id} />
        <ActionButton
          label="Delete"
          className="b b--sm b--danger"
          confirm={`Delete "${service.title}"? This cannot be undone.`}
        />
      </form>
    </section>
  );
}
