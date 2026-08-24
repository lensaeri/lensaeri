"use client";

import { useActionState } from "react";
import { deletePackage, savePackage } from "@/app/admin/actions";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import type { Package } from "@/lib/types";

export function PackageCard({ pkg }: { pkg: Package }) {
  const [state, action] = useActionState(savePackage, null);

  return (
    <section className="card">
      <form action={action}>
        <input type="hidden" name="id" value={pkg.id} />

        <div className="card__head">
          <h2 className="card__title">{pkg.name || "Untitled package"}</h2>
          <div>
            <label className="check">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={pkg.is_featured}
              />
              Featured
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={pkg.is_published}
              />
              Published
            </label>
          </div>
        </div>

        <Flash state={state} />

        <div className="grid-2">
          <label className="f">
            <span>Name</span>
            <input type="text" name="name" defaultValue={pkg.name} required />
          </label>
          <label className="f">
            <span>Badge</span>
            <input type="text" name="badge" defaultValue={pkg.badge} />
            <span className="f__hint">e.g. Most Booked</span>
          </label>
        </div>

        <div className="grid-3">
          <label className="f">
            <span>Price</span>
            <input type="text" name="price" defaultValue={pkg.price} />
            <span className="f__hint">Free text, e.g. RM 6,500</span>
          </label>
          <label className="f">
            <span>Tagline</span>
            <input type="text" name="tagline" defaultValue={pkg.tagline} />
          </label>
          <label className="f">
            <span>Order</span>
            <input type="number" name="sort_order" defaultValue={pkg.sort_order} />
          </label>
        </div>

        <label className="f">
          <span>Features — one per line</span>
          <textarea
            name="features"
            rows={5}
            defaultValue={pkg.features.join("\n")}
            placeholder={"8 hours coverage\nPhoto + video team\nSame-day edit"}
          />
        </label>

        <div className="row-actions">
          <SaveButton label="Save package" />
        </div>
      </form>

      <form action={deletePackage} style={{ marginTop: 12 }}>
        <input type="hidden" name="id" value={pkg.id} />
        <ActionButton
          label="Delete"
          className="b b--sm b--danger"
          confirm={`Delete "${pkg.name}"?`}
        />
      </form>
    </section>
  );
}
