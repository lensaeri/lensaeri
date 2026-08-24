import { addPortfolioItem } from "@/app/admin/actions";
import { PortfolioCard } from "@/components/admin/PortfolioCard";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order");
  const items = (data ?? []) as PortfolioItem[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Portfolio</h1>
        <form action={addPortfolioItem}>
          <button type="submit" className="b b--solid">
            + Add item
          </button>
        </form>
      </div>
      <p className="admin__lede">
        The filterable grid on the Portfolio page. Categories become filter
        buttons automatically — reuse an existing name to group items together.
        Mark items <em>featured</em> to show them in the home page teaser row.
      </p>

      {items.length === 0 ? (
        <div className="empty">No portfolio items yet.</div>
      ) : (
        items.map((item) => <PortfolioCard key={item.id} item={item} />)
      )}
    </>
  );
}
