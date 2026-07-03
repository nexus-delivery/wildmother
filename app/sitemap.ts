import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSiteEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";
import { getPublicSupabaseEnv } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = getSiteEnv();
  const { url, anonKey } = getPublicSupabaseEnv();
  const supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug,updated_at").eq("is_visible", true),
    supabase.from("categories").select("slug,updated_at").eq("is_visible", true),
  ]);

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(siteUrl, "/"),
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl(siteUrl, "/products"),
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: absoluteUrl(siteUrl, "/journal"),
      changeFrequency: "weekly",
      priority: 0.6,
      lastModified: new Date(),
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: absoluteUrl(siteUrl, `/products/${product.slug}`),
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: absoluteUrl(siteUrl, `/categories/${category.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
  }));

  return [...coreRoutes, ...categoryRoutes, ...productRoutes];
}
