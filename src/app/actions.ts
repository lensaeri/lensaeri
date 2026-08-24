"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryResult = { ok: true } | { ok: false; error: string };

/**
 * Public contact form handler. RLS allows anonymous inserts into `inquiries`
 * and nothing else, so this needs no elevated key.
 */
export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const pkg = String(formData.get("package") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "").trim();

  // Bots fill every field they find; humans never see this one.
  if (honeypot) return { ok: true };

  if (!name) return { ok: false, error: "Please tell us your name." };
  if (name.length > 120) return { ok: false, error: "That name is too long." };
  if (message.length > 4000) {
    return { ok: false, error: "Please keep your message under 4000 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    event_date: eventDate || null,
    location: location.slice(0, 300),
    package: pkg.slice(0, 120),
    message,
  });

  if (error) {
    console.error("[inquiry] insert failed:", error.message);
    return {
      ok: false,
      error: "Something went wrong sending that. Please email us instead.",
    };
  }

  return { ok: true };
}
