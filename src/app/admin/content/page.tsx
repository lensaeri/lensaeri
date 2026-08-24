import { ContentEditor } from "@/components/admin/ContentEditor";
import { getContentBlocks } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const blocks = await getContentBlocks();

  // Group by page, preserving the sort order the query returned.
  const grouped = blocks.reduce<Record<string, typeof blocks>>((acc, block) => {
    (acc[block.page] ??= []).push(block);
    return acc;
  }, {});

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Page Text</h1>
      </div>
      <p className="admin__lede">
        Every headline, eyebrow and paragraph on the public site. Edit anything
        here and press Save at the bottom — all fields save together.
      </p>

      {blocks.length === 0 ? (
        <div className="empty">
          No text blocks yet. Run <code>supabase/seed.sql</code> to populate them.
        </div>
      ) : (
        <ContentEditor grouped={grouped} />
      )}
    </>
  );
}
