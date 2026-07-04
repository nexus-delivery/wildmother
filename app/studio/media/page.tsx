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
    if (!query) return true;
    return (
      asset.file_name.toLowerCase().includes(query) ||
      asset.public_url.toLowerCase().includes(query) ||
      (asset.alt_text || "").toLowerCase().includes(query)
    );
  });

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">Media Library</h1>
          <p className="mt-2 text-[var(--muted)]">{data.mediaAssets.length} image{data.mediaAssets.length !== 1 ? "s" : ""} · Upload, search and reuse photos across your site.</p>
        </div>
      </header>

      <MediaUploadRefresh />

      <form className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <label className="space-y-1 text-sm block">
          <span className="font-medium text-[var(--ink)]">Search images</span>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by filename or alt text"
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
      </form>

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="text-4xl">◫</p>
          <p className="mt-3 font-serif text-xl text-[var(--ink)]">{query ? "No images match your search" : "No images yet"}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{query ? "Try a different search term" : "Drag and drop images above to upload your first photo."}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <article key={asset.id} className="rounded-2xl border border-[var(--line)] bg-white p-3">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[var(--paper)]">
                <Image
                  src={asset.public_url}
                  alt={asset.alt_text || asset.file_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <p className="mt-2 truncate text-sm font-medium text-[var(--ink)]">{asset.file_name}</p>
              <form action={updateMediaAltText} className="mt-2 flex items-center gap-2">
                <input type="hidden" name="id" value={asset.id} />
                <input
                  name="alt_text"
                  defaultValue={asset.alt_text || ""}
                  placeholder="Add alt text"
                  className="w-full rounded-lg border border-[var(--line)] px-2 py-1.5 text-xs"
                />
                <button className="shrink-0 rounded-lg border border-[var(--line)] px-2 py-1.5 text-xs hover:bg-[var(--paper)]">Save</button>
              </form>
              <div className="mt-3 flex items-center gap-2">
                <CopyButton value={asset.public_url} />
                <form action={deleteMediaAsset}>
                  <input type="hidden" name="id" value={asset.id} />
                  <input type="hidden" name="file_path" value={asset.file_path} />
                  <button className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

