import { addPortfolioItem } from "@/app/admin/actions";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { PortfolioCard } from "@/components/admin/PortfolioCard";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioCategory, PortfolioItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const supabase = await createClient();
  const [{ data: itemRows }, { data: categoryRows }] = await Promise.all([
    supabase.from("portfolio_items").select("*").order("sort_order"),
    supabase.from("portfolio_categories").select("*").order("sort_order"),
  ]);
  const items = (itemRows ?? []) as PortfolioItem[];
  const categories = (categoryRows ?? []) as PortfolioCategory[];

  const usage: Record<string, number> = {};
  for (const item of items) {
    usage[item.category] = (usage[item.category] ?? 0) + 1;
  }

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Portfolio</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <CategoryManager categories={categories} usage={usage} />
          <form action={addPortfolioItem}>
            <button type="submit" className="b b--solid">
              + Add item
            </button>
          </form>
        </div>
      </div>
      <p className="admin__lede">
        The filterable grid on the Portfolio page. Categories become filter
        buttons automatically — pick one from the dropdown, or add a new one
        via <em>Manage categories</em>. Mark items <em>featured</em> to show
        them in the home page teaser row.
      </p>

      {items.length === 0 ? (
        <div className="empty">No portfolio items yet.</div>
      ) : (
        items.map((item) => (
          <PortfolioCard key={item.id} item={item} categories={categories} />
        ))
      )}
    </>
  );
}
