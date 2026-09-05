import { addSystemUpdate, deleteSystemUpdate } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import type { SystemUpdate } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SystemUpdatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("system_updates")
    .select("*")
    .order("created_at", { ascending: false });
  const updates = (data ?? []) as SystemUpdate[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">System Updates</h1>
      </div>
      <p className="admin__lede">
        A short, plain-language log of changes made to the site — not shown to
        visitors, just for your own reference.
      </p>

      <section className="card">
        <form action={addSystemUpdate} style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            name="summary"
            placeholder="e.g. Added video support to portfolio images"
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="b b--solid">
            Add
          </button>
        </form>
      </section>

      {updates.length === 0 ? (
        <div className="empty">No updates logged yet.</div>
      ) : (
        <section className="card">
          {updates.map((u) => (
            <div key={u.id} className="log__entry">
              <div className="log__summary">{u.summary}</div>
              <div className="row-actions" style={{ margin: 0, padding: 0, border: 0 }}>
                <div className="log__date">{formatDate(u.created_at)}</div>
                <form action={deleteSystemUpdate}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" className="b b--sm b--danger">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
