import { addPackage } from "@/app/admin/actions";
import { PackageCard } from "@/components/admin/PackageCard";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("packages").select("*").order("sort_order");
  const packages = (data ?? []) as Package[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Packages</h1>
        <form action={addPackage}>
          <button type="submit" className="b b--solid">
            + Add package
          </button>
        </form>
      </div>
      <p className="admin__lede">
        Pricing tiers on the Packages page. The <em>featured</em> tier gets the
        lighter background and the solid button. Package names also populate the
        dropdown on the inquiry form.
      </p>

      {packages.length === 0 ? (
        <div className="empty">No packages yet.</div>
      ) : (
        packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
      )}
    </>
  );
}
