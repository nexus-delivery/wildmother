# Wild Mother - Artisan Commerce Platform v1

Production-ready Next.js + Supabase website and Studio CMS for artisan food businesses.

## What is included

- Public artisan storefront with editable homepage sections
- Studio admin area (renamed from Admin)
- Supabase authentication for Studio login
- Product CRUD with:
	- title, short/long descriptions
	- ingredients and allergens
	- category and tags
	- featured and visible toggles
	- SEO title/description, slug, OpenGraph image URL
	- multi-image gallery with drag-reorder and featured image
- Unlimited category CRUD with SEO fields
- Media Library with:
	- drag-and-drop upload
	- multiple image upload
	- search
	- delete
	- reuse in products/pages
	- copy image URL
- Homepage CMS content editing
- Site settings CMS
- SEO foundations:
	- per-page/product/category metadata
	- OpenGraph support
	- product JSON-LD schema
	- automatic sitemap and robots
- Responsive layouts for desktop/tablet/mobile

## 1) Configure environment variables

Use `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Wild Mother
```

## 2) Create database and storage

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.

This creates all CMS tables, RLS policies, and the `media` storage bucket.

## 3) Create first Studio login user

Run:

```bash
STUDIO_ADMIN_EMAIL=owner@example.com STUDIO_ADMIN_PASSWORD='strong-password-here' npm run studio:create-user
```

## 4) Start the app

```bash
npm install
npm run dev
```

Open:

- Website: `http://localhost:3000`
- Studio: `http://localhost:3000/studio/login`

## 5) First content workflow

1. Upload photos in Studio > Media Library.
2. Create categories in Studio > Categories.
3. Create products and attach/reorder images in Studio > Products.
4. Edit homepage JSON/content in Studio > Pages.
5. Update contact, social links, and defaults in Studio > Site Settings.

## Notes

- Pricing and checkout are intentionally not included in this phase.
- The architecture is modular so this repo can be reused as the baseline for future artisan commerce clients.
