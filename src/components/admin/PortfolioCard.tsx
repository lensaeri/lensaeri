"use client";

import { useActionState } from "react";
import { deletePortfolioItem, savePortfolioItem } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ActionButton, Flash, SaveButton } from "@/components/admin/SaveBar";
import type { PortfolioCategory, PortfolioItem } from "@/lib/types";

export function PortfolioCard({
  item,
  categories,
}: {
  item: PortfolioItem;
  categories: PortfolioCategory[];
}) {
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
            <select name="category" defaultValue={item.category}>
              {!categories.some((c) => c.name === item.category) && item.category && (
                <option value={item.category}>{item.category}</option>
              )}
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="f__hint">
              Need a new one? Use "Manage categories" above.
            </span>
          </label>
        </div>

        <label className="f">
          <span>Order</span>
          <input type="number" name="sort_order" defaultValue={item.sort_order} />
        </label>

        <ImageField value={item.image_path} folder="portfolio" />

        <label className="f">
          <span>Image alt text</span>
          <input type="text" name="image_alt" defaultValue={item.image_alt} />
        </label>

        <label className="f">
          <span>Video link or embed code (TikTok or YouTube)</span>
          <textarea
            name="embed_url"
            rows={3}
            defaultValue={item.embed_url ?? ""}
            placeholder="A TikTok or YouTube video link — or paste the whole code from TikTok's Share → Embed, or YouTube's Share → Embed"
          />
          <span className="f__hint">
            Optional — the video&rsquo;s own share link (TikTok or YouTube, including
            shortened vm.tiktok.com / youtu.be links) or the full embed snippet from
            either site&rsquo;s Share → Embed option all work. When set, this plays
            inline on the portfolio grid instead of the image/video above.
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
