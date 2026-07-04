import Link from "next/link";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioSeoPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();

  const items = [
    {
      label: "Homepage SEO",
      description: "Title, description and OpenGraph image for the homepage",
      href: "/studio/website/homepage",
      status: data.homepage.seo_title ? "Set" : "Not set",
      ok: !!data.homepage.seo_title,
    },
    {
      label: "Default site SEO",
      description: "Fallback title and description used when no page SEO is set",
      href: "/studio/settings",
      status: data.settings.default_seo_title ? "Set" : "Not set",
      ok: !!data.settings.default_seo_title,
    },
    {
      label: "Product SEO",
      description: `${data.products.filter((p) => p.seo_title).length} of ${data.products.length} products have SEO titles`,
      href: "/studio/products",
      status: `${data.products.filter((p) => p.seo_title).length} / ${data.products.length}`,
      ok: data.products.length === 0 || data.products.every((p) => p.seo_title),
    },
    {
      label: "Category SEO",
      description: `${data.categories.filter((c) => c.seo_title).length} of ${data.categories.length} categories have SEO titles`,
      href: "/studio/categories",
      status: `${data.categories.filter((c) => c.seo_title).length} / ${data.categories.length}`,
      ok: data.categories.length === 0 || data.categories.every((c) => c.seo_title),
    },
    {
      label: "Image alt text",
      description: `${data.mediaAssets.filter((a) => a.alt_text).length} of ${data.mediaAssets.length} images have alt text`,
      href: "/studio/media",
      status: `${data.mediaAssets.filter((a) => a.alt_text).length} / ${data.mediaAssets.length}`,
      ok: data.mediaAssets.length === 0 || data.mediaAssets.every((a) => a.alt_text),
    },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">SEO Overview</h1>
        <p className="mt-2 text-[var(--muted)]">A summary of your search engine optimisation across all content. Click any item to edit.</p>
      </header>

      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 hover:bg-[var(--paper)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className={`h-3 w-3 rounded-full shrink-0 ${item.ok ? "bg-[var(--sage)]" : "bg-[var(--honey)]"}`} />
              <div>
                <p className="font-semibold text-[var(--ink)]">{item.label}</p>
                <p className="text-sm text-[var(--muted)]">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted)]">{item.status}</span>
              <span className="text-[var(--muted)]">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="font-serif text-xl text-[var(--ink)]">Automatic SEO</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          <li>✓ XML sitemap generated automatically at <code className="text-[var(--ink)]">/sitemap.xml</code></li>
          <li>✓ Robots.txt served at <code className="text-[var(--ink)]">/robots.txt</code></li>
          <li>✓ Open Graph metadata included on all pages</li>
          <li>✓ JSON-LD structured data on product pages</li>
        </ul>
      </div>
    </section>
  );
}

