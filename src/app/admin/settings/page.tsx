import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Settings</h1>
      </div>
      <p className="admin__lede">
        Studio details used across every page — the footer, the contact block on
        the Packages page, and the two standalone images.
      </p>

      <SettingsForm settings={settings} />
    </>
  );
}
