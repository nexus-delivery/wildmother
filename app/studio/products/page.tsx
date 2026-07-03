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
          "id,title,slug,short_description,long_description,ingredients,allergens,tags,featured,is_visible,category_id,seo_title,seo_description,og_image_url,updated_at",
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
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Products</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Add, edit, hide, and feature products without pricing or checkout.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Add Product</h2>
        <ProductForm categories={data.categories} mediaAssets={data.mediaAssets} />
      </article>

      <div className="space-y-4">
        {data.products.map((product) => {
          const imageOrder = data.productImages
            .filter((image) => image.product_id === product.id)
            .map((image) => ({
              media_asset_id: image.media_asset_id,
              is_featured: image.is_featured,
            }));

          return (
            <article key={product.id} className="rounded-xl border border-[var(--line)] bg-white p-5">
              <h3 className="font-serif text-2xl text-[var(--ink)]">{product.title}</h3>
              <ProductForm
                id={product.id}
                product={product}
                categories={data.categories}
                mediaAssets={data.mediaAssets}
                initialImages={imageOrder}
              />
              <form action={deleteProduct} className="mt-4">
                <input type="hidden" name="id" value={product.id} />
                <button className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700">Delete Product</button>
              </form>
            </article>
          );
        })}
      </div>
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
    <form action={upsertProduct} className="mt-4 grid gap-3 md:grid-cols-2">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <label className="space-y-1 text-sm">
        <span>Title</span>
        <input name="title" required defaultValue={product?.title || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>Slug</span>
        <input name="slug" defaultValue={product?.slug || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>Category</span>
        <select name="category_id" defaultValue={product?.category_id || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2">
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1 text-sm">
        <span>Tags</span>
        <input
          name="tags"
          defaultValue={product?.tags?.join(", ") || ""}
          placeholder="bread, sourdough, seasonal"
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Short description</span>
        <input
          name="short_description"
          defaultValue={product?.short_description || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Long description</span>
        <textarea
          name="long_description"
          rows={5}
          defaultValue={product?.long_description || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Ingredients</span>
        <textarea
          name="ingredients"
          rows={3}
          defaultValue={product?.ingredients || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>Allergens</span>
        <input
          name="allergens"
          defaultValue={product?.allergens || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>

      <div className="md:col-span-2">
        <p className="mb-2 text-sm">Gallery images</p>
        <ProductImageManager name="image_order" mediaAssets={mediaAssets} initialImages={initialImages} />
      </div>

      <label className="space-y-1 text-sm">
        <span>SEO title</span>
        <input name="seo_title" defaultValue={product?.seo_title || ""} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm">
        <span>SEO description</span>
        <input
          name="seo_description"
          defaultValue={product?.seo_description || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="space-y-1 text-sm md:col-span-2">
        <span>OpenGraph image URL</span>
        <input
          name="og_image_url"
          defaultValue={product?.og_image_url || ""}
          className="w-full rounded-md border border-[var(--line)] px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured || false} />
        Featured product
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_visible" defaultChecked={product?.is_visible ?? true} />
        Available on website
      </label>

      <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white md:col-span-2">
        {id ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
