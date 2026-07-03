"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireStudioRole, requireStudioUser } from "@/lib/studio-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { defaultHomepageContent } from "@/lib/cms/defaults";
import type { CmsHomepageContent } from "@/lib/cms/types";
import type { StudioRole } from "@/lib/studio/roles";
import { parseTags, safeJsonParse, slugify, toBoolean, toTextOrNull } from "@/lib/utils";

export async function signOutStudio() {
  const { supabase } = await requireStudioUser();
  await supabase.auth.signOut();
  revalidatePath("/studio");
}

export async function upsertCategory(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  const title = toTextOrNull(formData.get("title"));

  if (!title) {
    throw new Error("Category title is required.");
  }

  const payload = {
    title,
    slug: toTextOrNull(formData.get("slug")) || slugify(title),
    description: toTextOrNull(formData.get("description")),
    is_visible: toBoolean(formData.get("is_visible")),
    seo_title: toTextOrNull(formData.get("seo_title")),
    seo_description: toTextOrNull(formData.get("seo_description")),
    og_image_url: toTextOrNull(formData.get("og_image_url")),
  };

  if (id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) {
      throw error;
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/studio/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  if (!id) {
    throw new Error("Category id is required.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/studio/categories");
}

export async function upsertProduct(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  const title = toTextOrNull(formData.get("title"));

  if (!title) {
    throw new Error("Product title is required.");
  }

  const payload = {
    title,
    slug: toTextOrNull(formData.get("slug")) || slugify(title),
    category_id: toTextOrNull(formData.get("category_id")),
    short_description: toTextOrNull(formData.get("short_description")),
    long_description: toTextOrNull(formData.get("long_description")),
    ingredients: toTextOrNull(formData.get("ingredients")),
    allergens: toTextOrNull(formData.get("allergens")),
    tags: parseTags(toTextOrNull(formData.get("tags"))),
    featured: toBoolean(formData.get("featured")),
    is_visible: toBoolean(formData.get("is_visible")),
    seo_title: toTextOrNull(formData.get("seo_title")),
    seo_description: toTextOrNull(formData.get("seo_description")),
    og_image_url: toTextOrNull(formData.get("og_image_url")),
  };

  let productId = id;

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) {
      throw error;
    }
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) {
      throw error;
    }
    productId = data.id;
  }

  const imageOrder = safeJsonParse<Array<{ media_asset_id: string; is_featured: boolean }>>(
    toTextOrNull(formData.get("image_order")),
    [],
  );

  if (productId) {
    await supabase.from("product_images").delete().eq("product_id", productId);

    if (imageOrder.length > 0) {
      const rows = imageOrder.map((item, index) => ({
        product_id: productId,
        media_asset_id: item.media_asset_id,
        position: index,
        is_featured: item.is_featured,
      }));
      const { error } = await supabase.from("product_images").insert(rows);
      if (error) {
        throw error;
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/studio/products");
}

export async function deleteProduct(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));

  if (!id) {
    throw new Error("Product id is required.");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/studio/products");
}

export async function updateHomepageContent(formData: FormData) {
  await requireStudioRole(["owner", "admin", "editor"]);
  const supabase = await getSupabaseServerClient();

  const pageSlug = toTextOrNull(formData.get("page_slug")) || "home";
  const title = toTextOrNull(formData.get("title")) || "Homepage";
  const contentInput = toTextOrNull(formData.get("content_json"));

  let content: CmsHomepageContent | Record<string, unknown>;

  if (pageSlug === "home") {
    const homeContent = safeJsonParse<CmsHomepageContent>(contentInput, defaultHomepageContent);

    const heroImageUrl = toTextOrNull(formData.get("hero_image_url"));
    const storyImageUrl = toTextOrNull(formData.get("story_image_url"));
    const seasonalImageUrl = toTextOrNull(formData.get("seasonal_image_url"));

    homeContent.hero.image_url = heroImageUrl || undefined;
    homeContent.story.image_url = storyImageUrl || undefined;
    homeContent.seasonal.image_url = seasonalImageUrl || undefined;

    content = homeContent;
  } else {
    content = safeJsonParse<Record<string, unknown>>(contentInput, { body: "" });
  }

  const payload = {
    slug: pageSlug,
    title,
    content,
    seo_title: toTextOrNull(formData.get("seo_title")),
    seo_description: toTextOrNull(formData.get("seo_description")),
    og_image_url: toTextOrNull(formData.get("og_image_url")),
  };

  const { error } = await supabase
    .from("pages")
    .upsert(payload, { onConflict: "slug", ignoreDuplicates: false });

  if (error) {
    throw error;
  }

  if (pageSlug === "home") {
    revalidatePath("/");
  }

  if (pageSlug === "about") {
    revalidatePath("/about");
  }

  if (pageSlug === "contact") {
    revalidatePath("/contact");
  }

  revalidatePath("/studio/pages");
}

export async function updateSiteSettings(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const payload = {
    singleton: true,
    business_name: toTextOrNull(formData.get("business_name")) || "Wild Mother",
    business_tagline: toTextOrNull(formData.get("business_tagline")),
    contact_email: toTextOrNull(formData.get("contact_email")),
    contact_phone: toTextOrNull(formData.get("contact_phone")),
    address_line_1: toTextOrNull(formData.get("address_line_1")),
    address_line_2: toTextOrNull(formData.get("address_line_2")),
    opening_hours: toTextOrNull(formData.get("opening_hours")),
    instagram_url: toTextOrNull(formData.get("instagram_url")),
    facebook_url: toTextOrNull(formData.get("facebook_url")),
    pinterest_url: toTextOrNull(formData.get("pinterest_url")),
    footer_text: toTextOrNull(formData.get("footer_text")),
    default_seo_title: toTextOrNull(formData.get("default_seo_title")),
    default_seo_description: toTextOrNull(formData.get("default_seo_description")),
    logo_image_url: toTextOrNull(formData.get("logo_image_url")),
    wordmark_image_url: toTextOrNull(formData.get("wordmark_image_url")),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "singleton", ignoreDuplicates: false });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/studio/settings");
}

export async function deleteMediaAsset(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  const filePath = toTextOrNull(formData.get("file_path"));

  if (!id || !filePath) {
    throw new Error("Media id and path are required.");
  }

  const { error: storageError } = await supabase.storage.from("media").remove([filePath]);
  if (storageError) {
    throw storageError;
  }

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/studio/media");
}

export async function updateMediaAltText(formData: FormData) {
  await requireStudioRole(["owner", "admin", "editor"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  if (!id) {
    throw new Error("Media id is required.");
  }

  const { error } = await supabase
    .from("media_assets")
    .update({ alt_text: toTextOrNull(formData.get("alt_text")) })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/studio/media");
}

export async function upsertJournalPost(formData: FormData) {
  await requireStudioRole(["owner", "admin", "editor"]);
  const supabase = await getSupabaseServerClient();

  const id = toTextOrNull(formData.get("id"));
  const title = toTextOrNull(formData.get("title"));
  if (!title) {
    throw new Error("Journal title is required.");
  }

  const payload = {
    title,
    slug: toTextOrNull(formData.get("slug")) || slugify(title),
    excerpt: toTextOrNull(formData.get("excerpt")),
    body: toTextOrNull(formData.get("body")),
    cover_image_url: toTextOrNull(formData.get("cover_image_url")),
    is_visible: toBoolean(formData.get("is_visible")),
    seo_title: toTextOrNull(formData.get("seo_title")),
    seo_description: toTextOrNull(formData.get("seo_description")),
    og_image_url: toTextOrNull(formData.get("og_image_url")),
    published_at: toBoolean(formData.get("is_visible")) ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await supabase.from("journal_posts").update(payload).eq("id", id);
    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("journal_posts").insert(payload);
    if (error) {
      throw error;
    }
  }

  revalidatePath("/journal");
  revalidatePath("/studio/journals");
}

export async function deleteJournalPost(formData: FormData) {
  await requireStudioRole(["owner", "admin"]);
  const supabase = await getSupabaseServerClient();
  const id = toTextOrNull(formData.get("id"));

  if (!id) {
    throw new Error("Journal id is required.");
  }

  const { error } = await supabase.from("journal_posts").delete().eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/journal");
  revalidatePath("/studio/journals");
}

export async function createStudioUser(formData: FormData) {
  await requireStudioRole(["owner"]);

  const email = toTextOrNull(formData.get("email"))?.toLowerCase();
  const fullName = toTextOrNull(formData.get("full_name"));
  const password = toTextOrNull(formData.get("password"));
  const role = toTextOrNull(formData.get("role")) as StudioRole | null;

  if (!email || !password || !role || !["admin", "editor"].includes(role)) {
    throw new Error("Valid user details are required.");
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw error || new Error("Failed to create user.");
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    role,
  });

  if (profileError) {
    throw profileError;
  }

  revalidatePath("/studio/users");
}

export async function updateStudioUserRole(formData: FormData) {
  await requireStudioRole(["owner"]);

  const id = toTextOrNull(formData.get("id"));
  const role = toTextOrNull(formData.get("role")) as StudioRole | null;

  if (!id || !role || !["admin", "editor", "owner"].includes(role)) {
    throw new Error("Invalid role update.");
  }

  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .maybeSingle<{ role: StudioRole }>();

  if (profile?.role === "owner" && role !== "owner") {
    throw new Error("Owner role cannot be reassigned.");
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) {
    throw error;
  }

  revalidatePath("/studio/users");
}
