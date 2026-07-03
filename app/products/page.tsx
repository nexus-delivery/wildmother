import Link from "next/link";
import type { Metadata } from "next";
import { getVisibleProducts } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Products | Wild Mother",
  description: "Explore handcrafted artisan products from Wild Mother.",
};

export default async function ProductsPage() {
  const products = await getVisibleProducts();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      <header>
        <h1 className="font-serif text-5xl text-[var(--forest)]">Products</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">Slow-crafted provisions from bakery, pantry, and homestead workshop.</p>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="card-paper">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--olive)]">{product.featured ? "Featured" : "Collection"}</p>
            <h2 className="mt-2 font-serif text-3xl">{product.title}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{product.short_description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
