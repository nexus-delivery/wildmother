import type { MetadataRoute } from "next";
import { getSiteEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = getSiteEnv();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/*", "/api/*"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
