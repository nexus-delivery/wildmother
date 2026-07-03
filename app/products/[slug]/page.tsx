import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/cms/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.seo_title || product.title,
    description: product.seo_description || product.short_description || undefined,
    openGraph: {
      title: product.seo_title || product.title,
      description: product.seo_description || product.short_description || undefined,
      images: product.og_image_url ? [product.og_image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const featured = product.images.find((image) => image.is_featured) || product.images[0] || null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.short_description,
    image: product.images
      .map((item) => item.media_assets?.public_url)
      .filter(Boolean) as string[],
    category: product.category?.title || undefined,
    brand: {
      "@type": "Brand",
      name: "Wild Mother",
    },
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {featured?.media_assets?.public_url ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)]">
              <Image
                src={featured.media_assets.public_url}
                alt={featured.media_assets.alt_text || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-2xl border border-[var(--line)] bg-[var(--paper)]" />
          )}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.slice(0, 8).map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-md border border-[var(--line)]">
                {image.media_assets?.public_url ? (
                  <Image
                    src={image.media_assets.public_url}
                    alt={image.media_assets.alt_text || product.title}
                    fill
                    className="object-cover"
                    sizes="15vw"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <article>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--olive)]">{product.category?.title || "Product"}</p>
          <h1 className="mt-2 font-serif text-5xl text-[var(--forest)]">{product.title}</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{product.short_description}</p>
          <p className="mt-6 whitespace-pre-wrap text-[var(--ink)]/90">{product.long_description}</p>

          <dl className="mt-8 grid gap-3 text-sm">
            <div>
              <dt className="font-semibold">Ingredients</dt>
              <dd>{product.ingredients || "Not set"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Allergens</dt>
              <dd>{product.allergens || "Not set"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Tags</dt>
              <dd>{product.tags?.length ? product.tags.join(", ") : "Not set"}</dd>
            </div>
          </dl>
        </article>
      </div>
    </main>
  );
}
