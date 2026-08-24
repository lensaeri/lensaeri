import { addService } from "@/app/admin/actions";
import { ServiceCard } from "@/components/admin/ServiceCard";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  const services = (data ?? []) as Service[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Services</h1>
        <form action={addService}>
          <button type="submit" className="b b--solid">
            + Add service section
          </button>
        </form>
      </div>
      <p className="admin__lede">
        Each service is a full section on the Services page and a card on the
        home page. Add as many as you like — the layout alternates sides
        automatically. Lower <em>order</em> numbers appear first.
      </p>

      {services.length === 0 ? (
        <div className="empty">
          No services yet. Use <strong>Add service section</strong> to create one.
        </div>
      ) : (
        services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      )}
    </>
  );
}
