import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/cms/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);

  if (!data) {
    return { title: "Category not found" };
  }

  return {
    title: data.category.seo_title || data.category.title,
    description: data.category.seo_description || data.category.description || undefined,
    openGraph: {
      title: data.category.seo_title || data.category.title,
      description: data.category.seo_description || data.category.description || undefined,
      images: data.category.og_image_url ? [data.category.og_image_url] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      <header>
        <h1 className="font-serif text-5xl text-[var(--forest)]">{data.category.title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{data.category.description}</p>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {data.products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="card-paper">
            <h2 className="font-serif text-3xl">{product.title}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{product.short_description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
