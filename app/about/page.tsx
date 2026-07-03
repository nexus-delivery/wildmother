import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  return {
    title: page?.seo_title || page?.title || "About",
    description: page?.seo_description || undefined,
    openGraph: {
      title: page?.seo_title || page?.title || "About",
      description: page?.seo_description || undefined,
      images: page?.og_image_url ? [page.og_image_url] : undefined,
    },
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const content = (page?.content as { body?: string }) || {};

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-serif text-5xl text-[var(--forest)]">{page?.title || "About"}</h1>
      <p className="mt-4 whitespace-pre-wrap text-[var(--muted)]">{content.body || "Add your About content in Studio > Pages."}</p>
    </main>
  );
}
