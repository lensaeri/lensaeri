import { addGalleryImage } from "@/app/admin/actions";
import { GalleryCard } from "@/components/admin/GalleryCard";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLLECTIONS = [
  {
    key: "teaser" as const,
    name: "Home teaser strip",
    desc: "The row of images between the services and testimonials on the home page. Five fit the desktop layout.",
  },
  {
    key: "bts" as const,
    name: "Behind the scenes",
    desc: "The square grid at the bottom of the About page. Eight fit the desktop layout.",
  },
];

export default async function GalleryAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("collection")
    .order("sort_order");
  const images = (data ?? []) as GalleryImage[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Gallery</h1>
      </div>
      <p className="admin__lede">
        Loose image strips that are not part of the portfolio grid.
      </p>

      {COLLECTIONS.map((collection) => {
        const rows = images.filter((i) => i.collection === collection.key);
        return (
          <div key={collection.key}>
            <div className="admin__head" style={{ marginTop: 36 }}>
              <div>
                <h2 className="card__title">{collection.name}</h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--cream-55)",
                    margin: "8px 0 0",
                    maxWidth: 560,
                    lineHeight: 1.7,
                  }}
                >
                  {collection.desc}
                </p>
              </div>
              <form action={addGalleryImage}>
                <input type="hidden" name="collection" value={collection.key} />
                <button type="submit" className="b">
                  + Add slot
                </button>
              </form>
            </div>

            {rows.length === 0 ? (
              <div className="empty" style={{ marginTop: 16 }}>
                No images in this collection.
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                {rows.map((image) => (
                  <GalleryCard key={image.id} image={image} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
