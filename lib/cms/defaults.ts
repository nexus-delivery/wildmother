import type { CmsHomepageContent } from "@/lib/cms/types";

export const defaultHomepageContent: CmsHomepageContent = {
  hero: {
    key: "hero",
    title: "Wild Mother Homestead Provisions",
    subtitle: "Handcrafted in small batches",
    body: "Slow-fermented loaves, seasonal pantry goods, and natural home essentials inspired by field, orchard, and woodsmoke.",
    button_label: "Explore Products",
    button_url: "/products",
  },
  featured_products: {
    key: "featured_products",
    title: "Featured Products",
    body: "A rotating curation from the bake room, dairy kitchen, and apothecary bench.",
  },
  categories: {
    key: "categories",
    title: "Shop by Craft",
    body: "Browse artisan categories and discover what is fresh this week.",
  },
  story: {
    key: "story",
    title: "Our Story",
    subtitle: "Rooted in the homestead",
    body: "Wild Mother began as a family table ritual and grew into a place where traditional skills, seasonal ingredients, and honest food can thrive.",
    button_label: "Read the Journal",
    button_url: "/journal",
  },
  seasonal: {
    key: "seasonal",
    title: "Seasonal Collection",
    body: "Limited-run bakes and pantry releases shaped by weather and harvest.",
  },
  gallery: {
    key: "gallery",
    title: "Gallery",
    body: "From flour dust to final wrap: moments from the kitchen and market stall.",
  },
  journal: {
    key: "journal",
    title: "Journal & Recipes",
    body: "Stories from the homestead, preserving notes, and simple recipe cards.",
  },
  instagram: {
    key: "instagram",
    title: "From the Field Notes",
    body: "A living strip of recent photography for social and campaign content.",
  },
  contact: {
    key: "contact",
    title: "Visit & Contact",
    body: "Share your request, catering enquiry, or wholesale interest.",
    button_label: "Get in Touch",
    button_url: "/#contact",
  },
};

export const defaultSiteSettings = {
  business_name: "Wild Mother",
  business_tagline: "Artisan foods from a working homestead",
  contact_email: "hello@wildmother.example",
  contact_phone: "+44 0000 000000",
  address_line_1: "Farm Lane",
  address_line_2: "Countryside",
  opening_hours: "Thursday to Sunday, 8:00-16:00",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  pinterest_url: "https://pinterest.com",
  footer_text: "Crafted slowly. Shared generously.",
  default_seo_title: "Wild Mother | Homestead Provisions",
  default_seo_description:
    "Wild Mother creates handcrafted bakery, pantry, and homestead essentials inspired by seasonal ingredients.",
  logo_image_url: null,
  wordmark_image_url: null,
};
