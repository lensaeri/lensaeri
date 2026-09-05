"use client";

import { useRef } from "react";
import {
  addPortfolioCategory,
  deletePortfolioCategory,
  renamePortfolioCategory,
} from "@/app/admin/actions";
import type { PortfolioCategory } from "@/lib/types";

/**
 * Popup for managing the portfolio category list (see savePortfolioItem /
 * PortfolioCard, which turns this into a closed dropdown instead of free
 * text). Renaming here updates every item that used the old name; deleting
 * is blocked — client-side via the disabled button, and again server-side —
 * while any item still uses that category.
 */
export function CategoryManager({
  categories,
  usage,
}: {
  categories: PortfolioCategory[];
  usage: Record<string, number>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="b"
        onClick={() => dialogRef.current?.showModal()}
      >
        Manage categories
      </button>

      <dialog ref={dialogRef} className="cat-dialog">
        <div className="cat-dialog__head">
          <h2 className="card__title">Portfolio categories</h2>
          <button
            type="button"
            className="b b--sm"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="empty">No categories yet — add one below.</div>
        ) : (
          categories.map((cat) => {
            const count = usage[cat.name] ?? 0;
            return (
              <div key={cat.id} className="cat-row">
                <form action={renamePortfolioCategory} className="cat-row__name">
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="text" name="name" defaultValue={cat.name} />
                  <button type="submit" className="b b--sm">
                    Save
                  </button>
                </form>
                <span className="cat-row__count">
                  {count} item{count === 1 ? "" : "s"}
                </span>
                <form action={deletePortfolioCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button
                    type="submit"
                    className="b b--sm b--danger"
                    disabled={count > 0}
                    title={count > 0 ? "Move items off this category first" : undefined}
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })
        )}

        <form action={addPortfolioCategory} className="cat-row cat-row--add">
          <input type="text" name="name" placeholder="New category name" required />
          <button type="submit" className="b b--sm">
            Add
          </button>
        </form>
      </dialog>
    </>
  );
}
