import { addTestimonial } from "@/app/admin/actions";
import { TestimonialCard } from "@/components/admin/TestimonialCard";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");
  const testimonials = (data ?? []) as Testimonial[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Testimonials</h1>
        <form action={addTestimonial}>
          <button type="submit" className="b b--solid">
            + Add testimonial
          </button>
        </form>
      </div>
      <p className="admin__lede">
        Client quotes on the home page. Exactly one can be the{" "}
        <em>headline quote</em> — the large italic pull quote; the rest fill the
        three columns beneath it.
      </p>

      {testimonials.length === 0 ? (
        <div className="empty">No testimonials yet.</div>
      ) : (
        testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)
      )}
    </>
  );
}
