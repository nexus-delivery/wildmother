import Link from "next/link";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioCollectionsPage() {
  await requireStudioRole(["owner", "admin", "editor"]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Collections</h1>
        <p className="mt-2 text-[var(--muted)]">Group products into curated collections for seasonal or themed ranges.</p>
      </header>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
        <p className="text-4xl">❖</p>
        <h2 className="mt-4 font-serif text-2xl text-[var(--ink)]">Collections coming soon</h2>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-sm mx-auto">
          In the meantime, use Categories to organise your products into ranges like Bakery, Pantry, and Candles.
        </p>
        <Link
          href="/studio/categories"
          className="mt-6 inline-block rounded-full bg-[var(--forest)] px-6 py-2 text-sm font-semibold text-white"
        >
          Manage Categories →
        </Link>
      </div>
    </section>
  );
}
