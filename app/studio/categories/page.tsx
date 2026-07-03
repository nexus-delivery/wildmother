import { deleteCategory, upsertCategory } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioCategoriesPage() {
  await requireStudioRole(["owner", "admin"]);
  const data = await getStudioBootstrapData();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Categories</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Create unlimited categories for bakery, pantry, candles, and more.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Add Category</h2>
        <form action={upsertCategory} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Title</span>
            <input name="title" required className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Slug</span>
            <input name="slug" placeholder="auto-generated if empty" className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Description</span>
            <textarea name="description" rows={3} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="is_visible" defaultChecked />
            Visible on website
          </label>
          <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white md:col-span-2">Save category</button>
        </form>
      </article>

      <div className="space-y-4">
        {data.categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-[var(--line)] bg-white p-5">
            <form action={upsertCategory} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={category.id} />
              <label className="space-y-1 text-sm">
                <span>Title</span>
                <input name="title" defaultValue={category.title} required className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">
                <span>Slug</span>
                <input name="slug" defaultValue={category.slug} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span>Description</span>
                <textarea
                  name="description"
                  defaultValue={category.description || ""}
                  rows={2}
                  className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>SEO title</span>
                <input
                  name="seo_title"
                  defaultValue={category.seo_title || ""}
                  className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>SEO description</span>
                <input
                  name="seo_description"
                  defaultValue={category.seo_description || ""}
                  className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span>OpenGraph image URL</span>
                <input
                  name="og_image_url"
                  defaultValue={category.og_image_url || ""}
                  className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" name="is_visible" defaultChecked={category.is_visible} />
                Visible on website
              </label>
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button className="rounded-md bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white">Update</button>
              </div>
            </form>
            <form action={deleteCategory} className="mt-3">
              <input type="hidden" name="id" value={category.id} />
              <button className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
