import { deleteCategory, upsertCategory } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioCategoriesPage() {
  await requireStudioRole(["owner", "admin"]);
  const data = await getStudioBootstrapData();
  const mediaOptions = data.mediaAssets.map((a) => ({ id: a.id, fileName: a.file_name, url: a.public_url }));

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">Categories</h1>
          <p className="mt-2 text-[var(--muted)]">Organise your products into artisan ranges. {data.categories.length} categor{data.categories.length === 1 ? "y" : "ies"} so far.</p>
        </div>
      </header>

      {/* New Category form */}
      <details open={data.categories.length === 0} className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-white">
        <summary className="flex cursor-pointer items-center gap-3 px-6 py-4 font-semibold text-[var(--forest)] hover:bg-[var(--paper)] rounded-2xl select-none">
          <span className="text-xl">＋</span> New Category
        </summary>
        <div className="px-6 pb-6">
          <form action={upsertCategory} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Title</span>
              <input name="title" required placeholder="e.g. Bakery, Pantry, Candles" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Slug</span>
              <input name="slug" placeholder="auto-generated if empty" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block md:col-span-2">
              <span className="font-medium text-[var(--ink)]">Description</span>
              <textarea name="description" rows={3} placeholder="A short description for this category" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <div className="md:col-span-2">
              <label className="space-y-1 text-sm block">
                <span className="font-medium text-[var(--ink)]">Category image URL</span>
                <input
                  name="og_image_url"
                  list="new-cat-image-options"
                  placeholder="Paste URL or pick from library"
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
                />
              </label>
              <datalist id="new-cat-image-options">
                {mediaOptions.map((a) => (
                  <option key={a.id} value={a.url}>{a.fileName}</option>
                ))}
              </datalist>
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="is_visible" defaultChecked className="rounded" />
              <span>Visible on website</span>
            </label>
            <button className="rounded-full bg-[var(--forest)] px-6 py-2 text-sm font-semibold text-white md:col-span-2 w-fit">
              Create category
            </button>
          </form>
        </div>
      </details>

      {/* Existing categories */}
      {data.categories.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="text-4xl">⊞</p>
          <p className="mt-3 font-serif text-xl text-[var(--ink)]">No categories yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Create your first category above to start organising your products.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.categories.map((category) => (
            <details key={category.id} className="rounded-2xl border border-[var(--line)] bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 select-none hover:bg-[var(--paper)] rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-50">⊞</span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{category.title}</p>
                    <p className="text-xs text-[var(--muted)]">/{category.slug} · {category.is_visible ? "Visible" : "Hidden"}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--muted)]">Edit ▾</span>
              </summary>
              <div className="px-6 pb-6 border-t border-[var(--line)]">
                <form action={upsertCategory} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />
                  <label className="space-y-1 text-sm block">
                    <span className="font-medium text-[var(--ink)]">Title</span>
                    <input name="title" defaultValue={category.title} required className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
                  </label>
                  <label className="space-y-1 text-sm block">
                    <span className="font-medium text-[var(--ink)]">Slug</span>
                    <input name="slug" defaultValue={category.slug} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
                  </label>
                  <label className="space-y-1 text-sm block md:col-span-2">
                    <span className="font-medium text-[var(--ink)]">Description</span>
                    <textarea name="description" defaultValue={category.description || ""} rows={2} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
                  </label>
                  <div className="md:col-span-2">
                    <label className="space-y-1 text-sm block">
                      <span className="font-medium text-[var(--ink)]">Category image URL</span>
                      <input
                        name="og_image_url"
                        defaultValue={category.og_image_url || ""}
                        list={`cat-image-${category.id}`}
                        placeholder="Paste URL or pick from library"
                        className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
                      />
                    </label>
                    <datalist id={`cat-image-${category.id}`}>
                      {mediaOptions.map((a) => (
                        <option key={a.id} value={a.url}>{a.fileName}</option>
                      ))}
                    </datalist>
                  </div>
                  <label className="space-y-1 text-sm block">
                    <span className="font-medium text-[var(--ink)]">SEO title</span>
                    <input name="seo_title" defaultValue={category.seo_title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
                  </label>
                  <label className="space-y-1 text-sm block">
                    <span className="font-medium text-[var(--ink)]">SEO description</span>
                    <input name="seo_description" defaultValue={category.seo_description || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
                  </label>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" name="is_visible" defaultChecked={category.is_visible} className="rounded" />
                    <span>Visible on website</span>
                  </label>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save changes</button>
                  </div>
                </form>
                <form action={deleteCategory} className="mt-4 border-t border-[var(--line)] pt-4">
                  <input type="hidden" name="id" value={category.id} />
                  <button className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Delete category
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

