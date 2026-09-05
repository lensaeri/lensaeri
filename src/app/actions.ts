"use server";

import { getSettings } from "@/lib/content";
import { sendInquiryEmails } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export type InquiryResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public contact form handler. RLS allows anonymous inserts into `inquiries`
 * and nothing else, so this needs no elevated key.
 */
export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const pkg = String(formData.get("package") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "").trim();

  // Bots fill every field they find; humans never see this one.
  if (honeypot) return { ok: true };

  if (!name) return { ok: false, error: "Please tell us your name." };
  if (name.length > 120) return { ok: false, error: "That name is too long." };
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!phone) return { ok: false, error: "Please enter a phone number." };
  if (phone.length > 40) return { ok: false, error: "That phone number is too long." };
  if (message.length > 4000) {
    return { ok: false, error: "Please keep your message under 4000 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone.slice(0, 40),
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

  // Best-effort notification emails. The inquiry is already safely stored
  // above, so a Resend hiccup here is logged, not surfaced to the visitor.
  try {
    const settings = await getSettings();
    await sendInquiryEmails(settings, {
      name,
      email,
      phone,
      eventDate,
      location,
      pkg,
      message,
    });
  } catch (err) {
    console.error("[inquiry] notification emails failed:", err);
  }

  return { ok: true };
}
