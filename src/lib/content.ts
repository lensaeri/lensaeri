import { mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import type {
  ContentBlock,
  GalleryImage,
  Package,
  PortfolioItem,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/**
 * Next.js signals control flow (redirect(), notFound(), a route being forced
 * dynamic by `cookies()`) by throwing a special error with a `digest` tag.
 * These must always propagate — swallowing one here breaks the framework's
 * own handling of it (e.g. a page that should render dynamically instead
 * hard-crashes during static generation).
 */
function isNextControlFlowError(err: unknown): boolean {
  const digest = (err as { digest?: unknown } | null)?.digest;
  return (
    typeof digest === "string" &&
    (digest === "DYNAMIC_SERVER_USAGE" || digest.startsWith("NEXT_"))
  );
}

/**
 * Every fetcher degrades to a sensible default when Supabase is unreachable or
 * a table is empty, so the site never renders a blank page mid-setup. `safe`
 * also catches thrown errors (e.g. an aborted fetch from the request
 * timeout), not just Postgrest's `{ error }` responses — but only real
 * failures; Next.js's own control-flow errors are rethrown untouched.
 */
async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    console.error("[content] Supabase request failed:", err);
    return fallback;
  }
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  brand_name: "LENSAERI",
  brand_location: "Kuching · Sarawak",
  footer_blurb:
    "Wedding content, videography and bride assistance based in Kuching, Sarawak.",
  email: "hello@lensaeri.com",
  phone: "+60 12-345 6789",
  location: "Kuching, Sarawak",
  instagram_handle: "@lensaeri.studio",
  instagram_url: "https://instagram.com/lensaeri.studio",
  whatsapp_number: "60123456789",
  copyright: "© 2026 LENSAERI STUDIO. ALL RIGHTS RESERVED.",
  hero_image_path: null,
  founder_image_path: null,
};

export async function getSettings(): Promise<SiteSettings> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return (data as SiteSettings | null) ?? DEFAULT_SETTINGS;
  }, DEFAULT_SETTINGS);
}

/** Copy blocks resolved into a `key -> value` lookup with a fallback helper. */
export type Copy = (key: string, fallback?: string) => string;

const EMPTY_COPY: Copy = (_key, fallback = "") => fallback;

export async function getCopy(): Promise<Copy> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("content_blocks").select("key, value");
    const map = new Map(
      ((data ?? []) as Pick<ContentBlock, "key" | "value">[]).map((b) => [
        b.key,
        b.value,
      ])
    );
    return (key: string, fallback = "") => map.get(key)?.trim() || fallback;
  }, EMPTY_COPY);
}

export async function getContentBlocks(): Promise<ContentBlock[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_blocks")
      .select("*")
      .order("page")
      .order("sort_order");
    return (data ?? []) as ContentBlock[];
  }, []);
}

export async function getServices(): Promise<Service[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    return (data ?? []) as Service[];
  }, []);
}

export async function getPortfolio(featuredOnly = false): Promise<PortfolioItem[]> {
  return safe(async () => {
    const supabase = await createClient();
    let query = supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (featuredOnly) query = query.eq("is_featured", true);
    const { data } = await query;
    return (data ?? []) as PortfolioItem[];
  }, []);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    return (data ?? []) as Testimonial[];
  }, []);
}

export async function getPackages(): Promise<Package[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    return (data ?? []) as Package[];
  }, []);
}

export async function getGallery(
  collection: "teaser" | "bts"
): Promise<GalleryImage[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("collection", collection)
      .eq("is_published", true)
      .order("sort_order");
    return (data ?? []) as GalleryImage[];
  }, []);
}

export { mediaUrl };
