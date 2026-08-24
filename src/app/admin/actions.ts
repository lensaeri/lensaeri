"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * All admin mutations. Every one of these runs against the caller's own
 * session (never the service-role key), so Postgres RLS is the real gate:
 * an unauthenticated request simply writes nothing.
 */

type ActionState = { ok?: string; error?: string } | null;

/** Refresh the public pages plus the admin screen that triggered the change. */
function revalidateSite(adminPath?: string) {
  revalidatePath("/", "layout");
  if (adminPath) revalidatePath(adminPath);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

/** Turn a newline-separated textarea into a clean string[]. */
function toLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function num(value: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/admin", "layout");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function saveSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    brand_name: String(formData.get("brand_name") ?? "").trim(),
    brand_location: String(formData.get("brand_location") ?? "").trim(),
    footer_blurb: String(formData.get("footer_blurb") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    instagram_handle: String(formData.get("instagram_handle") ?? "").trim(),
    instagram_url: String(formData.get("instagram_url") ?? "").trim(),
    whatsapp_number: String(formData.get("whatsapp_number") ?? "").replace(/\D/g, ""),
    copyright: String(formData.get("copyright") ?? "").trim(),
    hero_image_path: String(formData.get("hero_image_path") ?? "") || null,
    founder_image_path: String(formData.get("founder_image_path") ?? "") || null,
    logo_path: String(formData.get("logo_path") ?? "") || null,
  });

  if (error) return { error: error.message };
  revalidateSite("/admin/settings");
  return { ok: "Settings saved." };
}

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

export async function saveContentBlocks(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();

  // Fields arrive as `block:<key>`; anything else is ignored.
  const updates: { key: string; value: string }[] = [];
  for (const [field, value] of formData.entries()) {
    if (field.startsWith("block:")) {
      updates.push({ key: field.slice(6), value: String(value) });
    }
  }

  if (updates.length === 0) return { error: "Nothing to save." };

  for (const update of updates) {
    const { error } = await supabase
      .from("content_blocks")
      .update({ value: update.value })
      .eq("key", update.key);
    if (error) return { error: error.message };
  }

  revalidateSite("/admin/content");
  return { ok: `Saved ${updates.length} text ${updates.length === 1 ? "field" : "fields"}.` };
}

// ---------------------------------------------------------------------------
// Services  (add / edit / delete — unlimited sections)
// ---------------------------------------------------------------------------

export async function saveService(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");

  const row = {
    number: String(formData.get("number") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    short_desc: String(formData.get("short_desc") ?? "").trim(),
    full_desc: String(formData.get("full_desc") ?? "").trim(),
    points: toLines(formData.get("points")),
    image_path: String(formData.get("image_path") ?? "") || null,
    image_alt: String(formData.get("image_alt") ?? "").trim(),
    sort_order: num(formData.get("sort_order")),
    is_published: formData.get("is_published") === "on",
  };

  if (!row.title) return { error: "A service needs a title." };

  const { error } = id
    ? await supabase.from("services").update(row).eq("id", id)
    : await supabase.from("services").insert(row);

  if (error) return { error: error.message };
  revalidateSite("/admin/services");
  return { ok: id ? "Service updated." : "Service added." };
}

export async function addService() {
  const supabase = await requireUser();

  // Land new sections at the end of the list.
  const { data } = await supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const last = data?.[0]?.sort_order ?? 0;
  const { count } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  await supabase.from("services").insert({
    number: String((count ?? 0) + 1).padStart(2, "0"),
    title: "New service",
    short_desc: "",
    full_desc: "",
    points: [],
    sort_order: last + 10,
    is_published: false,
  });

  revalidateSite("/admin/services");
}

export async function deleteService(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("services").delete().eq("id", String(formData.get("id")));
  revalidateSite("/admin/services");
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export async function savePortfolioItem(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");

  const row = {
    caption: String(formData.get("caption") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || "Weddings",
    image_path: String(formData.get("image_path") ?? "") || null,
    image_alt: String(formData.get("image_alt") ?? "").trim(),
    span: Math.min(2, Math.max(1, num(formData.get("span"), 1))),
    sort_order: num(formData.get("sort_order")),
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
  };

  const { error } = id
    ? await supabase.from("portfolio_items").update(row).eq("id", id)
    : await supabase.from("portfolio_items").insert(row);

  if (error) return { error: error.message };
  revalidateSite("/admin/portfolio");
  return { ok: id ? "Item updated." : "Item added." };
}

export async function addPortfolioItem() {
  const supabase = await requireUser();
  const { data } = await supabase
    .from("portfolio_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  await supabase.from("portfolio_items").insert({
    caption: "Untitled",
    category: "Weddings",
    sort_order: (data?.[0]?.sort_order ?? 0) + 10,
    is_published: false,
  });

  revalidateSite("/admin/portfolio");
}

export async function deletePortfolioItem(formData: FormData) {
  const supabase = await requireUser();
  await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", String(formData.get("id")));
  revalidateSite("/admin/portfolio");
}

// ---------------------------------------------------------------------------
// Packages
// ---------------------------------------------------------------------------

export async function savePackage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");

  const row = {
    name: String(formData.get("name") ?? "").trim(),
    badge: String(formData.get("badge") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    features: toLines(formData.get("features")),
    is_featured: formData.get("is_featured") === "on",
    sort_order: num(formData.get("sort_order")),
    is_published: formData.get("is_published") === "on",
  };

  if (!row.name) return { error: "A package needs a name." };

  const { error } = id
    ? await supabase.from("packages").update(row).eq("id", id)
    : await supabase.from("packages").insert(row);

  if (error) return { error: error.message };
  revalidateSite("/admin/packages");
  return { ok: id ? "Package updated." : "Package added." };
}

export async function addPackage() {
  const supabase = await requireUser();
  const { data } = await supabase
    .from("packages")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  await supabase.from("packages").insert({
    name: "New package",
    sort_order: (data?.[0]?.sort_order ?? 0) + 10,
    is_published: false,
  });

  revalidateSite("/admin/packages");
}

export async function deletePackage(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("packages").delete().eq("id", String(formData.get("id")));
  revalidateSite("/admin/packages");
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function saveTestimonial(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");

  const row = {
    quote: String(formData.get("quote") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    is_hero: formData.get("is_hero") === "on",
    sort_order: num(formData.get("sort_order")),
    is_published: formData.get("is_published") === "on",
  };

  if (!row.quote) return { error: "A testimonial needs a quote." };

  // Only one quote may headline the home page.
  if (row.is_hero) {
    await supabase
      .from("testimonials")
      .update({ is_hero: false })
      .neq("id", id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);

  if (error) return { error: error.message };
  revalidateSite("/admin/testimonials");
  return { ok: id ? "Testimonial updated." : "Testimonial added." };
}

export async function addTestimonial() {
  const supabase = await requireUser();
  const { data } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  await supabase.from("testimonials").insert({
    quote: "New testimonial",
    sort_order: (data?.[0]?.sort_order ?? 0) + 10,
    is_published: false,
  });

  revalidateSite("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("testimonials").delete().eq("id", String(formData.get("id")));
  revalidateSite("/admin/testimonials");
}

// ---------------------------------------------------------------------------
// Gallery (home teaser strip + about BTS grid)
// ---------------------------------------------------------------------------

export async function saveGalleryImage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");

  const row = {
    collection: String(formData.get("collection") ?? "teaser"),
    image_path: String(formData.get("image_path") ?? "") || null,
    image_alt: String(formData.get("image_alt") ?? "").trim(),
    sort_order: num(formData.get("sort_order")),
    is_published: formData.get("is_published") === "on",
  };

  const { error } = id
    ? await supabase.from("gallery_images").update(row).eq("id", id)
    : await supabase.from("gallery_images").insert(row);

  if (error) return { error: error.message };
  revalidateSite("/admin/gallery");
  return { ok: "Image saved." };
}

export async function addGalleryImage(formData: FormData) {
  const supabase = await requireUser();
  const collection = String(formData.get("collection") ?? "teaser");

  const { data } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .eq("collection", collection)
    .order("sort_order", { ascending: false })
    .limit(1);

  await supabase.from("gallery_images").insert({
    collection,
    sort_order: (data?.[0]?.sort_order ?? 0) + 10,
  });

  revalidateSite("/admin/gallery");
}

export async function deleteGalleryImage(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("gallery_images").delete().eq("id", String(formData.get("id")));
  revalidateSite("/admin/gallery");
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------

export async function toggleInquiryRead(formData: FormData) {
  const supabase = await requireUser();
  await supabase
    .from("inquiries")
    .update({ is_read: formData.get("is_read") === "true" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("inquiries").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
