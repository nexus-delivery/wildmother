import { updateHomepageContent } from "@/app/studio/actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireStudioRole } from "@/lib/studio-auth";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import Link from "next/link";

export default async function StudioAboutPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();
  const supabase = await getSupabaseServerClient();

  const { data: page } = await supabase
    .from("pages")
    .select("title,content,seo_title,seo_description,og_image_url")
    .eq("slug", "about")
    .maybeSingle();

  const body = (page?.content as { body?: string } | null)?.body || "";
  const mediaOptions = data.mediaAssets.map((a) => ({ id: a.id, fileName: a.file_name, url: a.public_url }));

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">About Page</h1>
          <p className="mt-2 text-[var(--muted)]">Edit your About page content and SEO.</p>
        </div>
        <Link
          href="/about"
          target="_blank"
          className="shrink-0 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--forest)] hover:bg-[var(--paper)]"
        >
          ↗ Preview About
        </Link>
      </header>

      <form action={updateHomepageContent} className="rounded-2xl border border-[var(--line)] bg-white p-6 space-y-4">
        <input type="hidden" name="page_slug" value="about" />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">Page title</span>
            <input name="title" defaultValue={page?.title || "About"} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <div />
          <label className="space-y-1 text-sm block md:col-span-2">
            <span className="font-medium text-[var(--ink)]">Page content</span>
            <textarea
              name="body"
              rows={10}
              defaultValue={body}
              placeholder="Share the story behind Wild Mother…"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">SEO title</span>
            <input name="seo_title" defaultValue={page?.seo_title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">SEO description</span>
            <textarea name="seo_description" rows={3} defaultValue={page?.seo_description || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <div className="md:col-span-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">OpenGraph image</span>
              <input
                name="og_image_url"
                defaultValue={page?.og_image_url || ""}
                list="og-image-options"
                placeholder="Paste URL or pick from media library"
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
              />
            </label>
            <datalist id="og-image-options">
              {mediaOptions.map((a) => (
                <option key={a.id} value={a.url}>{a.fileName}</option>
              ))}
            </datalist>
          </div>
        </div>

        <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save About page</button>
      </form>
    </section>
  );
}
