import Link from "next/link";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioSeoPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">SEO</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Control SEO title, description, URL slug, OpenGraph image, and alt text across content.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Editing Locations</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            Homepage SEO: <Link className="underline" href="/studio/pages">Pages</Link>
          </li>
          <li>
            Product and category SEO: <Link className="underline" href="/studio/products">Products</Link> and <Link className="underline" href="/studio/categories">Categories</Link>
          </li>
          <li>
            Image alt text and OG references: <Link className="underline" href="/studio/media">Media Library</Link>
          </li>
          <li>Automatic sitemap and schema are generated on the public site.</li>
        </ul>
      </article>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Current Content Counts</h2>
        <p className="mt-2 text-sm">Products: {data.products.length}</p>
        <p className="text-sm">Categories: {data.categories.length}</p>
        <p className="text-sm">Media assets: {data.mediaAssets.length}</p>
      </article>
    </section>
  );
}
