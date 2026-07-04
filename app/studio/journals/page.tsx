import { deleteJournalPost, upsertJournalPost } from "@/app/studio/actions";
import { requireStudioRole } from "@/lib/studio-auth";
import { getStudioBootstrapData } from "@/lib/cms/queries";

export default async function StudioJournalsPage() {
  const { supabase } = await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();
  const mediaOptions = data.mediaAssets.map((a) => ({ id: a.id, fileName: a.file_name, url: a.public_url }));

  const { data: posts } = await supabase
    .from("journal_posts")
    .select("id,title,slug,excerpt,body,cover_image_url,is_visible,seo_title,seo_description,og_image_url,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">Journal</h1>
          <p className="mt-2 text-[var(--muted)]">{(posts || []).length} article{(posts || []).length !== 1 ? "s" : ""} · Write stories, recipes and homestead updates.</p>
        </div>
      </header>

      {/* New post */}
      <details open={(posts || []).length === 0} className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-white">
        <summary className="flex cursor-pointer items-center gap-3 px-6 py-4 font-semibold text-[var(--forest)] hover:bg-[var(--paper)] rounded-2xl select-none">
          <span className="text-xl">＋</span> Write New Article
        </summary>
        <div className="px-6 pb-6">
          <JournalForm mediaOptions={mediaOptions} />
        </div>
      </details>

      {(posts || []).length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="text-4xl">✑</p>
          <p className="mt-3 font-serif text-xl text-[var(--ink)]">No articles yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Use the form above to write your first journal post.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(posts || []).map((post) => (
            <details key={post.id} className="rounded-2xl border border-[var(--line)] bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 select-none hover:bg-[var(--paper)] rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-50">✑</span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{post.title}</p>
                    <p className="text-xs text-[var(--muted)]">{post.is_visible ? "Published" : "Draft"} · /{post.slug}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--muted)]">Edit ▾</span>
              </summary>
              <div className="border-t border-[var(--line)] px-6 pb-6">
                <JournalForm post={post} mediaOptions={mediaOptions} />
                <form action={deleteJournalPost} className="mt-4 border-t border-[var(--line)] pt-4">
                  <input type="hidden" name="id" value={post.id} />
                  <button className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Delete article
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function JournalForm({
  post,
  mediaOptions,
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
  mediaOptions: Array<{ id: string; fileName: string; url: string }>;
}) {
  return (
    <form action={upsertJournalPost} className="mt-4 grid gap-4 md:grid-cols-2">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Title</span>
        <input name="title" required defaultValue={post?.title || ""} placeholder="Article title" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Slug</span>
        <input name="slug" defaultValue={post?.slug || ""} placeholder="auto-generated if empty" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Excerpt</span>
        <input name="excerpt" defaultValue={post?.excerpt || ""} placeholder="Short summary for listings and SEO" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Article body</span>
        <textarea name="body" rows={10} defaultValue={post?.body || ""} placeholder="Write your article here…" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>

      {/* Cover image */}
      <div className="md:col-span-2">
        <label className="space-y-1 text-sm block">
          <span className="font-medium text-[var(--ink)]">Cover image</span>
          <input
            name="cover_image_url"
            defaultValue={post?.cover_image_url || ""}
            list={`cover-img-${post?.id || "new"}`}
            placeholder="Paste URL or pick from media library"
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
        <datalist id={`cover-img-${post?.id || "new"}`}>
          {mediaOptions.map((a) => (
            <option key={a.id} value={a.url}>{a.fileName}</option>
          ))}
        </datalist>
        {post?.cover_image_url ? (
          <p className="mt-1 rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs text-[var(--muted)] truncate">
            Current: {post.cover_image_url}
          </p>
        ) : null}
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">SEO title</span>
        <input name="seo_title" defaultValue={post?.seo_title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">SEO description</span>
        <input name="seo_description" defaultValue={post?.seo_description || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_visible" defaultChecked={post?.is_visible ?? false} className="rounded" />
          <span className="font-medium text-[var(--ink)]">Published</span>
        </label>
      </div>

      <button className="rounded-full bg-[var(--forest)] px-6 py-2 text-sm font-semibold text-white md:col-span-2 w-fit">
        {post ? "Save changes" : "Create article"}
      </button>
    </form>
  );
}

