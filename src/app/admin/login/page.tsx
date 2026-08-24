import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="login">
      <div className="login__box">
        <div className="login__brand">LENSAERI</div>
        <div className="login__sub">Studio Admin</div>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
