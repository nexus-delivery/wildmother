export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type CmsPageSection = {
  key: string;
  title: string;
  subtitle?: string;
  body?: string;
  button_label?: string;
  button_url?: string;
  image_url?: string;
};

export type CmsHomepageContent = {
  hero: CmsPageSection;
  featured_products: CmsPageSection;
  categories: CmsPageSection;
  story: CmsPageSection;
  seasonal: CmsPageSection;
  gallery: CmsPageSection;
  journal: CmsPageSection;
  instagram: CmsPageSection;
  contact: CmsPageSection;
};

export type ProductRecord = {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  ingredients: string | null;
  allergens: string | null;
  tags: string[];
  featured: boolean;
  is_visible: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
};
