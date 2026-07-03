import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getHomepage } from "@/lib/cms/queries";
import { getSiteEnv } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { page, settings } = await getHomepage();
  const { siteName } = getSiteEnv();

  return {
    title: page.seo_title || settings.default_seo_title || siteName,
    description: page.seo_description || settings.default_seo_description || undefined,
    openGraph: {
      title: page.seo_title || settings.default_seo_title || siteName,
      description: page.seo_description || settings.default_seo_description || undefined,
      images: page.og_image_url ? [page.og_image_url] : undefined,
    },
  };
}

export default async function HomePage() {
  const { page, settings, products, categories, media } = await getHomepage();
  const content = page.content;

  return (
    <main>
      <section className="hero-shell">
        <div className="texture-overlay" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--olive)]">{settings.business_name}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">{content.hero.title}</h1>
            <p className="mt-4 text-lg text-[var(--muted)]">{content.hero.subtitle}</p>
            <p className="mt-5 max-w-xl text-[var(--ink)]/90">{content.hero.body}</p>
            <Link className="btn-primary mt-8 inline-block" href={content.hero.button_url || "/products"}>
              {content.hero.button_label || "Explore"}
            </Link>
          </div>
          {content.hero.image_url ? (
            <div className="relative aspect-[4/5] self-end overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]">
              <Image
                src={content.hero.image_url}
                alt={settings.business_name || "Wild Mother"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 self-end">
              {media.slice(0, 4).map((asset) => (
                <div key={asset.id} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]">
                  <Image
                    src={asset.public_url}
                    alt={asset.alt_text || settings.business_name || "Wild Mother"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionHeader title={content.featured_products.title} body={content.featured_products.body} />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="card-paper group">
            <div className="botanical-corner" />
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--olive)]">
              {product.featured ? "Featured" : "Product"}
            </p>
            <h3 className="mt-2 font-serif text-3xl text-[var(--ink)] group-hover:text-[var(--forest)]">{product.title}</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">{product.short_description}</p>
          </Link>
        ))}
      </section>

      <SectionHeader title={content.categories.title} body={content.categories.body} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-6 pb-20 sm:grid-cols-2 md:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="chip-card">
            <h3 className="font-serif text-2xl">{category.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{category.description}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 md:grid-cols-[1.2fr_1fr]">
        <div className="card-paper">
          {content.story.image_url ? (
            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-[var(--line)]">
              <Image src={content.story.image_url} alt={content.story.title} fill className="object-cover" sizes="50vw" />
            </div>
          ) : null}
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--olive)]">{content.story.subtitle}</p>
          <h2 className="mt-2 font-serif text-5xl leading-tight">{content.story.title}</h2>
          <p className="mt-4 text-[var(--ink)]">{content.story.body}</p>
          <Link className="btn-secondary mt-7 inline-block" href={content.story.button_url || "/journal"}>
            {content.story.button_label || "Read more"}
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          {content.seasonal.image_url ? (
            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-[var(--line)]">
              <Image src={content.seasonal.image_url} alt={content.seasonal.title} fill className="object-cover" sizes="40vw" />
            </div>
          ) : null}
          <h3 className="font-serif text-3xl">{content.seasonal.title}</h3>
          <p className="mt-3 text-[var(--muted)]">{content.seasonal.body}</p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {media.slice(4, 7).map((asset) => (
              <div key={asset.id} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={asset.public_url} alt={asset.alt_text || "Seasonal"} fill className="object-cover" sizes="20vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionHeader title={content.gallery.title} body={content.gallery.body} />
      <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-6 pb-20 md:grid-cols-4">
        {media.slice(0, 8).map((asset) => (
          <div key={asset.id} className="relative aspect-square overflow-hidden rounded-xl border border-[var(--line)]">
            <Image src={asset.public_url} alt={asset.alt_text || "Wild Mother gallery"} fill className="object-cover" sizes="25vw" />
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <div className="grid gap-6 rounded-2xl border border-[var(--line)] bg-white p-8 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl">{content.journal.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{content.journal.body}</p>
            <Link href="/journal" className="btn-secondary mt-6 inline-block">
              Visit Journal
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-4xl">{content.instagram.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{content.instagram.body}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {media.slice(8, 11).map((asset) => (
                <div key={asset.id} className="relative aspect-square overflow-hidden rounded-lg border border-[var(--line)]">
                  <Image src={asset.public_url} alt={asset.alt_text || "Instagram style"} fill className="object-cover" sizes="20vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20" id="contact">
        <div className="grid gap-6 rounded-2xl border border-[var(--line)] bg-white p-8 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl">{content.contact.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{content.contact.body}</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="uppercase tracking-[0.15em] text-[var(--olive)]">Email</dt>
              <dd>{settings.contact_email}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.15em] text-[var(--olive)]">Phone</dt>
              <dd>{settings.contact_phone}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.15em] text-[var(--olive)]">Opening Hours</dt>
              <dd>{settings.opening_hours}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ title, body }: { title: string; body?: string }) {
  return (
    <header className="mx-auto w-full max-w-7xl px-6 pb-8 pt-2">
      <h2 className="font-serif text-4xl text-[var(--forest)] md:text-5xl">{title}</h2>
      {body ? <p className="mt-3 max-w-2xl text-[var(--muted)]">{body}</p> : null}
    </header>
  );
}
