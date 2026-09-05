"use client";

import { useActionState } from "react";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import { ImageField } from "@/components/admin/ImageField";
import type { Testimonial } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [state, action] = useActionState(saveTestimonial, null);

  return (
    <section className="card">
      <form action={action}>
        <input type="hidden" name="id" value={testimonial.id} />

        <div className="card__head">
          <h2 className="card__title">{testimonial.author || "Anonymous"}</h2>
          <div>
            <label className="check">
              <input
                type="checkbox"
                name="is_hero"
                defaultChecked={testimonial.is_hero}
              />
              Headline quote
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={testimonial.is_published}
              />
              Published
            </label>
          </div>
        </div>

        <Flash state={state} />

        <label className="f">
          <span>Quote</span>
          <textarea name="quote" rows={3} defaultValue={testimonial.quote} required />
        </label>

        <div className="grid-3">
          <label className="f">
            <span>Author</span>
            <input type="text" name="author" defaultValue={testimonial.author} />
          </label>
          <label className="f">
            <span>Detail</span>
            <input type="text" name="meta" defaultValue={testimonial.meta} />
            <span className="f__hint">e.g. Pullman Kuching</span>
          </label>
          <label className="f">
            <span>Order</span>
            <input
              type="number"
              name="sort_order"
              defaultValue={testimonial.sort_order}
            />
          </label>
        </div>

        <ImageField
          name="photo_path"
          label="Photo (e.g. you with the couple)"
          value={testimonial.photo_path}
          folder="testimonials"
        />

        <div className="row-actions">
          <SaveButton label="Save testimonial" />
        </div>
      </form>

      <form action={deleteTestimonial} style={{ marginTop: 12 }}>
        <input type="hidden" name="id" value={testimonial.id} />
        <ActionButton
          label="Delete"
          className="b b--sm b--danger"
          confirm="Delete this testimonial?"
        />
      </form>
    </section>
  );
}
