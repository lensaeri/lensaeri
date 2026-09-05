"use client";

import { useActionState } from "react";
import { deletePortfolioItem, savePortfolioItem } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [state, action] = useActionState(savePortfolioItem, null);

  return (
    <section className="card">
      <form action={action}>
        <input type="hidden" name="id" value={item.id} />

        <div className="card__head">
          <h2 className="card__title">{item.caption || "Untitled"}</h2>
          <div>
            <label className="check">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={item.is_featured}
              />
              Featured
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={item.is_published}
              />
              Published
            </label>
          </div>
        </div>

        <Flash state={state} />

        <div className="grid-2">
          <label className="f">
            <span>Caption</span>
            <input type="text" name="caption" defaultValue={item.caption} />
          </label>
          <label className="f">
            <span>Category</span>
            <input
              type="text"
              name="category"
              defaultValue={item.category}
              list="portfolio-categories"
            />
            <span className="f__hint">e.g. Weddings, Engagements, Films, BTS</span>
          </label>
        </div>

        <div className="grid-2">
          <label className="f">
            <span>Grid height</span>
            <select name="span" defaultValue={String(item.span)}>
              <option value="1">Standard</option>
              <option value="2">Tall (spans two rows)</option>
            </select>
          </label>
          <label className="f">
            <span>Order</span>
            <input type="number" name="sort_order" defaultValue={item.sort_order} />
          </label>
        </div>

        <ImageField value={item.image_path} folder="portfolio" />

        <label className="f">
          <span>Image alt text</span>
          <input type="text" name="image_alt" defaultValue={item.image_alt} />
        </label>

        <label className="f">
          <span>TikTok video link or embed code</span>
          <textarea
            name="tiktok_url"
            rows={3}
            defaultValue={item.tiktok_url ?? ""}
            placeholder="https://www.tiktok.com/@handle/video/7211234567890123456 — or paste the whole code from TikTok's Share → Embed option"
          />
          <span className="f__hint">
            Optional — the video&rsquo;s own share link (not just your @handle or
            profile), the shortened vm.tiktok.com one, or the full snippet from
            TikTok&rsquo;s Share → Embed option all work. When set, this plays inline
            on the portfolio grid instead of the image/video above.
          </span>
        </label>

        <div className="row-actions">
          <SaveButton label="Save item" />
        </div>
      </form>

      <form action={deletePortfolioItem} style={{ marginTop: 12 }}>
        <input type="hidden" name="id" value={item.id} />
        <ActionButton
          label="Delete"
          className="b b--sm b--danger"
          confirm={`Delete "${item.caption}"?`}
        />
      </form>
    </section>
  );
}
