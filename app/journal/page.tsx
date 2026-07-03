import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getVisibleJournalPosts } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Journal | Wild Mother",
  description: "Seasonal stories, recipes, and homestead notes from Wild Mother.",
};

export default function JournalPage() {
  const postsPromise = getVisibleJournalPosts();

  return <JournalContent postsPromise={postsPromise} />;
}

async function JournalContent({
  postsPromise,
}: {
  postsPromise: ReturnType<typeof getVisibleJournalPosts>;
}) {
  const posts = await postsPromise;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16">
      <h1 className="font-serif text-5xl text-[var(--forest)]">Journal & Recipes</h1>
      <p className="mt-4 text-[var(--muted)]">Seasonal stories, field notes, and simple recipes from the homestead.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="card-paper">
            {post.cover_image_url ? (
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="30vw" />
              </div>
            ) : null}
            <h2 className="font-serif text-3xl">{post.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt || ""}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
