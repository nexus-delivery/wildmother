import { deleteMediaAsset, updateMediaAltText } from "@/app/studio/actions";
import { CopyButton } from "@/components/studio/copy-button";
import { MediaUploadRefresh } from "@/components/studio/media-upload-refresh";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";
import Image from "next/image";

export default async function StudioMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() || "";

  await requireStudioRole(["owner", "admin", "editor"]);

  const data = await getStudioBootstrapData();

  const assets = data.mediaAssets.filter((asset) => {
    if (!query) {
      return true;
    }

    return (
      asset.file_name.toLowerCase().includes(query) ||
      asset.public_url.toLowerCase().includes(query) ||
      (asset.alt_text || "").toLowerCase().includes(query)
    );
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Media Library</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Upload, search, reuse, and copy image URLs for products and pages.</p>
      </header>

      <MediaUploadRefresh />

      <form className="rounded-xl border border-[var(--line)] bg-white p-4">
        <label className="space-y-1 text-sm">
          <span>Search media</span>
          <input
            name="q"
            defaultValue={query}
            placeholder="filename, alt text, or URL"
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.id} className="rounded-xl border border-[var(--line)] bg-white p-3">
            <div className="relative h-44 w-full overflow-hidden rounded-md">
              <Image
                src={asset.public_url}
                alt={asset.alt_text || asset.file_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="mt-2 truncate text-sm font-medium">{asset.file_name}</p>
            <form action={updateMediaAltText} className="mt-2 flex items-center gap-2">
              <input type="hidden" name="id" value={asset.id} />
              <input
                name="alt_text"
                defaultValue={asset.alt_text || ""}
                placeholder="Alt text"
                className="w-full rounded-md border border-[var(--line)] px-2 py-1 text-xs"
              />
              <button className="rounded-md border border-[var(--line)] px-2 py-1 text-xs">Save</button>
            </form>
            <div className="mt-3 flex items-center gap-2">
              <CopyButton value={asset.public_url} />
              <form action={deleteMediaAsset}>
                <input type="hidden" name="id" value={asset.id} />
                <input type="hidden" name="file_path" value={asset.file_path} />
                <button className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
