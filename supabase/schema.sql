-- Wild Mother Artisan Commerce Platform v1 schema
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null unique,
  role text not null check (role in ('owner', 'admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_single_owner_idx
on public.profiles ((role))
where role = 'owner';

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean unique default true,
  business_name text not null,
  business_tagline text,
  contact_email text,
  contact_phone text,
  address_line_1 text,
  address_line_2 text,
  opening_hours text,
  instagram_url text,
  facebook_url text,
  pinterest_url text,
  footer_text text,
  default_seo_title text,
  default_seo_description text,
  logo_image_url text,
  wordmark_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings add column if not exists logo_image_url text;
alter table public.site_settings add column if not exists wordmark_image_url text;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  is_visible boolean not null default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  price text,
  short_description text,
  long_description text,
  ingredients text,
  allergens text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  is_visible boolean not null default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists price text;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null unique,
  bucket text not null default 'media',
  mime_type text,
  bytes bigint,
  width integer,
  height integer,
  public_url text not null,
  alt_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  position integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, media_asset_id)
);

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_image_url text,
  is_visible boolean not null default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists journal_posts_set_updated_at on public.journal_posts;
create trigger journal_posts_set_updated_at
before update on public.journal_posts
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.media_assets enable row level security;
alter table public.product_images enable row level security;
alter table public.journal_posts enable row level security;

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings"
on public.site_settings for select
using (true);

drop policy if exists "public read owner count for setup" on public.profiles;
create policy "public read owner count for setup"
on public.profiles for select
using (role = 'owner');

drop policy if exists "authenticated read own profile" on public.profiles;
create policy "authenticated read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "owner manage profiles" on public.profiles;
create policy "owner manage profiles"
on public.profiles for all
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
);

drop policy if exists "first owner bootstrap insert" on public.profiles;
create policy "first owner bootstrap insert"
on public.profiles for insert
with check (
  auth.uid() = id
  and role = 'owner'
  and not exists (select 1 from public.profiles where role = 'owner')
);

drop policy if exists "public read pages" on public.pages;
create policy "public read pages"
on public.pages for select
using (true);

drop policy if exists "public read visible categories" on public.categories;
create policy "public read visible categories"
on public.categories for select
using (is_visible = true);

drop policy if exists "public read visible products" on public.products;
create policy "public read visible products"
on public.products for select
using (is_visible = true);

drop policy if exists "public read product images" on public.product_images;
create policy "public read product images"
on public.product_images for select
using (true);

drop policy if exists "public read media" on public.media_assets;
create policy "public read media"
on public.media_assets for select
using (true);

drop policy if exists "public read visible journal" on public.journal_posts;
create policy "public read visible journal"
on public.journal_posts for select
using (is_visible = true);

drop policy if exists "authenticated manage site settings" on public.site_settings;
create policy "authenticated manage site settings"
on public.site_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage pages" on public.pages;
create policy "authenticated manage pages"
on public.pages for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage categories" on public.categories;
create policy "authenticated manage categories"
on public.categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage products" on public.products;
create policy "authenticated manage products"
on public.products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage media" on public.media_assets;
create policy "authenticated manage media"
on public.media_assets for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage product images" on public.product_images;
create policy "authenticated manage product images"
on public.product_images for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage journal" on public.journal_posts;
create policy "authenticated manage journal"
on public.journal_posts for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.site_settings (
  singleton,
  business_name,
  business_tagline,
  default_seo_title,
  default_seo_description,
  footer_text,
  opening_hours
)
values (
  true,
  'Wild Mother',
  'Artisan foods from a working homestead',
  'Wild Mother | Homestead Provisions',
  'Handcrafted bakery, pantry goods, and homestead essentials made in small seasonal batches.',
  'Crafted slowly. Shared generously.',
  'Thursday to Sunday, 8:00-16:00'
)
on conflict (singleton) do update
set
  business_name = excluded.business_name,
  business_tagline = excluded.business_tagline,
  default_seo_title = excluded.default_seo_title,
  default_seo_description = excluded.default_seo_description,
  footer_text = excluded.footer_text,
  opening_hours = excluded.opening_hours;

insert into public.pages (slug, title, content, seo_title, seo_description)
values (
  'home',
  'Homepage',
  '{
    "hero": {
      "key": "hero",
      "title": "Wild Mother Homestead Provisions",
      "subtitle": "Handcrafted in small batches",
      "body": "Slow-fermented loaves, seasonal pantry goods, and natural home essentials inspired by field, orchard, and woodsmoke.",
      "button_label": "Explore Products",
      "button_url": "/products"
    },
    "featured_products": {
      "key": "featured_products",
      "title": "Featured Products",
      "body": "A rotating curation from the bake room, dairy kitchen, and apothecary bench."
    },
    "categories": {
      "key": "categories",
      "title": "Shop by Craft",
      "body": "Browse artisan categories and discover what is fresh this week."
    },
    "story": {
      "key": "story",
      "title": "Our Story",
      "subtitle": "Rooted in the homestead",
      "body": "Wild Mother began as a family table ritual and grew into a place where traditional skills, seasonal ingredients, and honest food can thrive.",
      "button_label": "Read the Journal",
      "button_url": "/journal"
    },
    "seasonal": {
      "key": "seasonal",
      "title": "Seasonal Collection",
      "body": "Limited-run bakes and pantry releases shaped by weather and harvest."
    },
    "gallery": {
      "key": "gallery",
      "title": "Gallery",
      "body": "From flour dust to final wrap: moments from the kitchen and market stall."
    },
    "journal": {
      "key": "journal",
      "title": "Journal & Recipes",
      "body": "Stories from the homestead, preserving notes, and simple recipe cards."
    },
    "instagram": {
      "key": "instagram",
      "title": "From the Field Notes",
      "body": "A living strip of recent photography for social and campaign content."
    },
    "contact": {
      "key": "contact",
      "title": "Visit & Contact",
      "body": "Share your request, catering enquiry, or wholesale interest.",
      "button_label": "Get in Touch",
      "button_url": "/#contact"
    }
  }'::jsonb,
  'Wild Mother | Homestead Provisions',
  'Handcrafted bakery, pantry goods, and homestead essentials from a working homestead.'
)
on conflict (slug) do update
set
  title = excluded.title,
  content = excluded.content,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

insert into public.pages (slug, title, content, seo_title, seo_description)
values
(
  'about',
  'About',
  '{"body":"Wild Mother is a small homestead studio focused on traditional food craft, seasonal produce, and honest ingredients."}'::jsonb,
  'About Wild Mother',
  'Learn the story behind Wild Mother and our homestead craft values.'
),
(
  'contact',
  'Contact',
  '{"body":"For catering, wholesale, or local pickup questions, send us a note and we will respond shortly."}'::jsonb,
  'Contact Wild Mother',
  'Get in touch with Wild Mother for orders, wholesale, and event enquiries.'
)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 10485760)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "authenticated upload media bucket" on storage.objects;
create policy "authenticated upload media bucket"
on storage.objects for insert
with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "authenticated update media bucket" on storage.objects;
create policy "authenticated update media bucket"
on storage.objects for update
using (bucket_id = 'media' and auth.role() = 'authenticated')
with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "authenticated delete media bucket" on storage.objects;
create policy "authenticated delete media bucket"
on storage.objects for delete
using (bucket_id = 'media' and auth.role() = 'authenticated');
