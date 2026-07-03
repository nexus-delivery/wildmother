import { defaultHomepageContent, defaultSiteSettings } from "@/lib/cms/defaults";
import type { CmsHomepageContent } from "@/lib/cms/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type PageRecord = {
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  content: unknown;
};

type CategoryRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_visible: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

type ProductRecord = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  ingredients: string | null;
  allergens: string | null;
  featured: boolean;
  is_visible: boolean;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  category_id: string | null;
};

type ProductImageRecord = {
  id: string;
  product_id: string;
  media_asset_id: string;
  position: number;
  is_featured: boolean;
  media_assets: {
    id: string;
    file_path: string;
    public_url: string;
    alt_text: string | null;
    width: number | null;
    height: number | null;
  } | null;
};

export async function getHomepage() {
  const supabase = await getSupabaseServerClient();

  const [{ data: page }, { data: settings }, { data: categories }, { data: products }, { data: media }] =
    await Promise.all([
      supabase
        .from("pages")
        .select("slug,title,seo_title,seo_description,og_image_url,content")
        .eq("slug", "home")
        .maybeSingle<PageRecord>(),
      supabase
        .from("site_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle<Record<string, string | boolean | null>>(),
      supabase
        .from("categories")
        .select("id,title,slug,description,is_visible")
        .eq("is_visible", true)
        .order("title", { ascending: true })
        .limit(8),
      supabase
        .from("products")
        .select("id,title,slug,short_description,featured,is_visible")
        .eq("is_visible", true)
        .order("featured", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(8),
      supabase
        .from("media_assets")
        .select("id,public_url,alt_text")
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

  return {
    page: page
      ? {
          ...page,
          content: (page.content as CmsHomepageContent) || defaultHomepageContent,
        }
      : {
          slug: "home",
          title: "Homepage",
          seo_title: defaultSiteSettings.default_seo_title,
          seo_description: defaultSiteSettings.default_seo_description,
          og_image_url: null,
          content: defaultHomepageContent,
        },
    settings: {
      ...defaultSiteSettings,
      ...(settings || {}),
    },
    categories: categories || [],
    products: products || [],
    media: media || [],
  };
}

export async function getVisibleProducts() {
  const supabase = await getSupabaseServerClient();

  const [{ data: products }, { data: images }] = await Promise.all([
    supabase
      .from("products")
      .select("id,title,slug,short_description,featured,is_visible,category_id")
      .eq("is_visible", true)
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false }),
    supabase
      .from("product_images")
      .select(
        "id,product_id,position,is_featured,media_assets(id,public_url,alt_text)",
      )
      .order("position", { ascending: true }),
  ]);

  const imageMap = new Map<string, { public_url: string; alt_text: string | null }>();

  for (const image of images || []) {
    const typed = image as unknown as ProductImageRecord;
    if (!imageMap.has(typed.product_id) && typed.media_assets?.public_url) {
      imageMap.set(typed.product_id, {
        public_url: typed.media_assets.public_url,
        alt_text: typed.media_assets.alt_text,
      });
    }
  }

  return (products || []).map((product) => ({
    ...product,
    image: imageMap.get(product.id) || null,
  }));
}

export async function getProductBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id,title,slug,short_description,long_description,ingredients,allergens,tags,featured,is_visible,seo_title,seo_description,og_image_url,category_id",
    )
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle<ProductRecord>();

  if (!product) {
    return null;
  }

  const [{ data: category }, { data: images }] = await Promise.all([
    product.category_id
      ? supabase
          .from("categories")
          .select("id,title,slug")
          .eq("id", product.category_id)
          .maybeSingle<{ id: string; title: string; slug: string }>()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("product_images")
      .select("id,position,is_featured,media_assets(id,public_url,alt_text,width,height)")
      .eq("product_id", product.id)
      .order("position", { ascending: true }),
  ]);

  return {
    ...product,
    category,
    images: (images || []) as unknown as Array<{
      id: string;
      position: number;
      is_featured: boolean;
      media_assets: {
        id: string;
        public_url: string;
        alt_text: string | null;
        width: number | null;
        height: number | null;
      } | null;
    }>,
  };
}

export async function getVisibleCategories() {
  const supabase = await getSupabaseServerClient();

  const { data } = await supabase
    .from("categories")
    .select("id,title,slug,description,is_visible")
    .eq("is_visible", true)
    .order("title", { ascending: true });

  return data || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id,title,slug,description,is_visible,seo_title,seo_description,og_image_url")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle<CategoryRecord>();

  if (!category) {
    return null;
  }

  const { data: products } = await supabase
    .from("products")
    .select("id,title,slug,short_description,featured,is_visible")
    .eq("category_id", category.id)
    .eq("is_visible", true)
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  return {
    category,
    products: products || [],
  };
}

export async function getStudioBootstrapData() {
  const supabase = await getSupabaseServerClient();

  const [{ data: categories }, { data: mediaAssets }, { data: products }, { data: homepage }, { data: settings }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id,title,slug,description,is_visible,seo_title,seo_description,og_image_url")
        .order("title", { ascending: true }),
      supabase
        .from("media_assets")
        .select("id,file_name,file_path,public_url,alt_text,width,height,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select(
          "id,title,slug,short_description,long_description,ingredients,allergens,category_id,tags,featured,is_visible,seo_title,seo_description,og_image_url,updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabase
        .from("pages")
        .select("id,slug,title,content,seo_title,seo_description,og_image_url")
        .eq("slug", "home")
        .maybeSingle<PageRecord>(),
      supabase
        .from("site_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle<Record<string, string | boolean | null>>(),
    ]);

  return {
    categories: categories || [],
    mediaAssets: mediaAssets || [],
    products: products || [],
    homepage: homepage
      ? {
          ...homepage,
          content: (homepage.content as CmsHomepageContent) || defaultHomepageContent,
        }
      : {
          slug: "home",
          title: "Homepage",
          seo_title: defaultSiteSettings.default_seo_title,
          seo_description: defaultSiteSettings.default_seo_description,
          og_image_url: null,
          content: defaultHomepageContent,
        },
    settings: {
      ...defaultSiteSettings,
      ...(settings || {}),
    },
  };
}

export async function getPageBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("pages")
    .select("id,slug,title,content,seo_title,seo_description,og_image_url")
    .eq("slug", slug)
    .maybeSingle<PageRecord>();

  return data;
}

export async function getVisibleJournalPosts() {
  const supabase = await getSupabaseServerClient();

  const { data } = await supabase
    .from("journal_posts")
    .select("id,title,slug,excerpt,cover_image_url,published_at")
    .eq("is_visible", true)
    .order("published_at", { ascending: false });

  return data || [];
}
