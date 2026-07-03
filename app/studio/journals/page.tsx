import { deleteJournalPost, upsertJournalPost } from "@/app/studio/actions";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioJournalsPage() {
  const { supabase } = await requireStudioRole(["owner", "admin", "editor"]);

  const { data: posts } = await supabase
    .from("journal_posts")
    .select("id,title,slug,excerpt,body,cover_image_url,is_visible,seo_title,seo_description,og_image_url,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Journals</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Manage blog posts, stories, and recipe entries.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Add Journal Post</h2>
        <JournalForm />
      </article>

      <div className="space-y-4">
        {(posts || []).map((post) => (
          <article key={post.id} className="rounded-xl border border-[var(--line)] bg-white p-5">
            <h3 className="font-serif text-2xl">{post.title}</h3>
            <JournalForm post={post} />
            <form action={deleteJournalPost} className="mt-3">
              <input type="hidden" name="id" value={post.id} />
              <button className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}

function JournalForm({
  post,
}: {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    cover_image_url: string | null;
    is_visible: boolean;
    seo_title: string | null;
    seo_description: string | null;
    og_image_url: string | null;
  };
}) {
  return (
    <form action={upsertJournalPost} className="mt-4 grid gap-3 md:grid-cols-2">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <label className="space-y-1 text-sm">
        <span>Title</span>
        <input name="title" required defaultValue={post?.title || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>Slug</span>
        <input name="slug" defaultValue={post?.slug || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Excerpt</span>
        <input name="excerpt" defaultValue={post?.excerpt || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Body</span>
        <textarea name="body" rows={8} defaultValue={post?.body || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Cover image URL</span>
        <input name="cover_image_url" defaultValue={post?.cover_image_url || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>SEO title</span>
        <input name="seo_title" defaultValue={post?.seo_title || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>SEO description</span>
        <input name="seo_description" defaultValue={post?.seo_description || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>OpenGraph image URL</span>
        <input name="og_image_url" defaultValue={post?.og_image_url || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" name="is_visible" defaultChecked={post?.is_visible ?? true} />
        Visible on website
      </label>
      <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white md:col-span-2">
        {post ? "Update post" : "Create post"}
      </button>
    </form>
  );
}
