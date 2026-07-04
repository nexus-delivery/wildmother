import { deleteProduct, upsertProduct } from "@/app/studio/actions";
import { ProductImageManager } from "@/components/studio/product-image-manager";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireStudioRole } from "@/lib/studio-auth";

async function getProductPageData() {
  const supabase = await getSupabaseServerClient();

  const [{ data: products }, { data: categories }, { data: mediaAssets }, { data: productImages }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id,title,slug,price,short_description,long_description,ingredients,allergens,tags,featured,is_visible,category_id,seo_title,seo_description,og_image_url,updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabase.from("categories").select("id,title").order("title", { ascending: true }),
      supabase
        .from("media_assets")
        .select("id,file_name,public_url,alt_text")
        .order("created_at", { ascending: false }),
      supabase
        .from("product_images")
        .select("product_id,media_asset_id,is_featured,position")
        .order("position", { ascending: true }),
    ]);

  return {
    products: products || [],
    categories: categories || [],
    mediaAssets: mediaAssets || [],
    productImages: productImages || [],
  };
}

export default async function StudioProductsPage() {
  await requireStudioRole(["owner", "admin"]);
  const data = await getProductPageData();

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">Products</h1>
          <p className="mt-2 text-[var(--muted)]">{data.products.length} product{data.products.length !== 1 ? "s" : ""} · Add, edit, hide and feature artisan products.</p>
        </div>
      </header>

      {/* Add product */}
      <details open={data.products.length === 0} className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-white">
        <summary className="flex cursor-pointer items-center gap-3 px-6 py-4 font-semibold text-[var(--forest)] hover:bg-[var(--paper)] rounded-2xl select-none">
          <span className="text-xl">＋</span> New Product
        </summary>
        <div className="px-6 pb-6">
          <ProductForm categories={data.categories} mediaAssets={data.mediaAssets} />
        </div>
      </details>

      {data.products.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
          <p className="text-4xl">⬡</p>
          <p className="mt-3 font-serif text-xl text-[var(--ink)]">No products yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Use the form above to add your first artisan product.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.products.map((product) => {
            const imageOrder = data.productImages
              .filter((image) => image.product_id === product.id)
              .map((image) => ({
                media_asset_id: image.media_asset_id,
                is_featured: image.is_featured,
              }));

            return (
              <details key={product.id} className="rounded-2xl border border-[var(--line)] bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 select-none hover:bg-[var(--paper)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-50">⬡</span>
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{product.title}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {product.is_visible ? "Published" : "Draft"} · {product.featured ? "Featured · " : ""}{product.category_id ? "Has category" : "No category"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--muted)]">Edit ▾</span>
                </summary>
                <div className="border-t border-[var(--line)] px-6 pb-6">
                  <ProductForm
                    id={product.id}
                    product={product}
                    categories={data.categories}
                    mediaAssets={data.mediaAssets}
                    initialImages={imageOrder}
                  />
                  <form action={deleteProduct} className="mt-4 border-t border-[var(--line)] pt-4">
                    <input type="hidden" name="id" value={product.id} />
                    <button className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Delete product
                    </button>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProductForm({
  id,
  product,
  categories,
  mediaAssets,
  initialImages = [],
}: {
  id?: string;
  product?: {
    title: string;
    slug: string;
    price: string | null;
    short_description: string | null;
    long_description: string | null;
    ingredients: string | null;
    allergens: string | null;
    tags: string[];
    featured: boolean;
    is_visible: boolean;
    category_id: string | null;
    seo_title: string | null;
    seo_description: string | null;
    og_image_url: string | null;
  };
  categories: Array<{ id: string; title: string }>;
  mediaAssets: Array<{ id: string; file_name: string; public_url: string; alt_text: string | null }>;
  initialImages?: Array<{ media_asset_id: string; is_featured: boolean }>;
}) {
  return (
    <form action={upsertProduct} className="mt-4 grid gap-4 md:grid-cols-2">
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Product name</span>
        <input name="title" required defaultValue={product?.title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Category</span>
        <select name="category_id" defaultValue={product?.category_id || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2">
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Price</span>
        <input
          name="price"
          defaultValue={product?.price || ""}
          placeholder="e.g. £6.50, From £12"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Tags</span>
        <input
          name="tags"
          defaultValue={product?.tags?.join(", ") || ""}
          placeholder="bread, sourdough, seasonal"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>

      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Short description</span>
        <input
          name="short_description"
          defaultValue={product?.short_description || ""}
          placeholder="One-line summary shown in product listings"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Full description</span>
        <textarea
          name="long_description"
          rows={5}
          defaultValue={product?.long_description || ""}
          placeholder="Full product description for the product page"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Ingredients</span>
        <textarea
          name="ingredients"
          rows={3}
          defaultValue={product?.ingredients || ""}
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm block md:col-span-2">
        <span className="font-medium text-[var(--ink)]">Allergens</span>
        <input
          name="allergens"
          defaultValue={product?.allergens || ""}
          placeholder="e.g. Contains gluten, dairy"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>

      <div className="md:col-span-2">
        <p className="mb-2 text-sm font-medium text-[var(--ink)]">Gallery images</p>
        <ProductImageManager name="image_order" mediaAssets={mediaAssets} initialImages={initialImages} />
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">SEO title</span>
        <input name="seo_title" defaultValue={product?.seo_title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">SEO description</span>
        <input
          name="seo_description"
          defaultValue={product?.seo_description || ""}
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">Slug</span>
        <input name="slug" defaultValue={product?.slug || ""} placeholder="auto-generated from name" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
      </label>
      <div />

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_visible" defaultChecked={product?.is_visible ?? true} className="rounded" />
          <span className="font-medium text-[var(--ink)]">Published</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured || false} className="rounded" />
          <span className="font-medium text-[var(--ink)]">Featured on homepage</span>
        </label>
      </div>

      <button className="rounded-full bg-[var(--forest)] px-6 py-2 text-sm font-semibold text-white md:col-span-2 w-fit">
        {id ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

