import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: post } = await supabase
    .from("journal_posts")
    .select("title,excerpt,seo_title,seo_description,og_image_url,is_visible")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle<{
      title: string;
      excerpt: string | null;
      seo_title: string | null;
      seo_description: string | null;
      og_image_url: string | null;
      is_visible: boolean;
    }>();

  if (!post) {
    return { title: "Journal post not found" };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      images: post.og_image_url ? [post.og_image_url] : undefined,
    },
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: post } = await supabase
    .from("journal_posts")
    .select("title,body,excerpt,cover_image_url,is_visible,published_at")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle<{
      title: string;
      body: string | null;
      excerpt: string | null;
      cover_image_url: string | null;
      is_visible: boolean;
      published_at: string | null;
    }>();

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      {post.cover_image_url ? (
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--line)]">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="80vw" />
        </div>
      ) : null}
      <h1 className="font-serif text-5xl text-[var(--forest)]">{post.title}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
      <p className="mt-4 whitespace-pre-wrap text-[var(--ink)]/90">{post.body || post.excerpt || ""}</p>
    </main>
  );
}
