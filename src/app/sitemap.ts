import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

const ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/services", changeFrequency: "yearly", priority: 0.7 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/packages", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = resolveSiteUrl().toString().replace(/\/$/, "");
  const lastModified = new Date();

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${site}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
