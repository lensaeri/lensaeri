import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login screen renders bare — middleware handles the redirect for
  // every other admin route, so no session here means we are on /admin/login.
  if (!user) return <>{children}</>;

  const { count } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div className="admin">
      <AdminNav email={user.email ?? ""} unread={count ?? 0} />
      <main className="admin__main">{children}</main>
    </div>
  );
}
