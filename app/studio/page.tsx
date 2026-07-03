import Link from "next/link";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioDashboardPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();

  const cards = [
    {
      label: "Products",
      value: data.products.length,
      href: "/studio/products",
    },
    {
      label: "Categories",
      value: data.categories.length,
      href: "/studio/categories",
    },
    {
      label: "Media Assets",
      value: data.mediaAssets.length,
      href: "/studio/media",
    },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Manage your artisan storefront content from one place.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 font-serif text-4xl text-[var(--ink)]">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Quick Start</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--ink)]">
          <li>Upload product photos in Media Library.</li>
          <li>Create categories for your product ranges.</li>
          <li>Add products and order gallery images.</li>
          <li>Edit homepage content and SEO details.</li>
        </ol>
      </div>
    </section>
  );
}
