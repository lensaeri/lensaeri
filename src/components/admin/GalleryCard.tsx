"use client";

import { useActionState } from "react";
import { deleteGalleryImage, saveGalleryImage } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import type { GalleryImage } from "@/lib/types";

export function GalleryCard({ image }: { image: GalleryImage }) {
  const [state, action] = useActionState(saveGalleryImage, null);

  return (
    <section className="card">
      <form action={action}>
        <input type="hidden" name="id" value={image.id} />
        <input type="hidden" name="collection" value={image.collection} />

        <Flash state={state} />

        <ImageField value={image.image_path} folder={image.collection} />

        <div className="grid-3">
          <label className="f">
            <span>Alt text</span>
            <input type="text" name="image_alt" defaultValue={image.image_alt} />
          </label>
          <label className="f">
            <span>Order</span>
            <input type="number" name="sort_order" defaultValue={image.sort_order} />
          </label>
          <label className="f" style={{ alignSelf: "end" }}>
            <span>Visibility</span>
            <label className="check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={image.is_published}
              />
              Published
            </label>
          </label>
        </div>

        <div className="row-actions">
          <SaveButton label="Save" />
        </div>
      </form>

      <form action={deleteGalleryImage} style={{ marginTop: 12 }}>
        <input type="hidden" name="id" value={image.id} />
        <ActionButton
          label="Delete slot"
          className="b b--sm b--danger"
          confirm="Delete this image slot?"
        />
      </form>
    </section>
  );
}
