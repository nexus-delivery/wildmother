import { updateHomepageContent } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";
import Link from "next/link";

export default async function StudioHomepageEditorPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();
  const hp = data.homepage;
  const c = hp.content;
  const mediaOptions = data.mediaAssets.map((a) => ({ id: a.id, fileName: a.file_name, url: a.public_url }));

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[var(--forest)]">Homepage Editor</h1>
          <p className="mt-2 text-[var(--muted)]">Edit every section of your homepage. Changes save immediately.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="shrink-0 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--forest)] hover:bg-[var(--paper)]"
        >
          ↗ Preview site
        </Link>
      </header>

      {/* Page SEO */}
      <form action={updateHomepageContent} className="rounded-2xl border border-[var(--line)] bg-white p-6 space-y-4">
        <input type="hidden" name="page_slug" value="home" />
        <h2 className="font-serif text-2xl text-[var(--ink)]">Page SEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">SEO title</span>
            <input name="seo_title" defaultValue={hp.seo_title || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">SEO description</span>
            <input name="seo_description" defaultValue={hp.seo_description || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
        </div>
        <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save SEO</button>
      </form>

      {/* Hero section */}
      <SectionCard title="Hero Section" description="The first thing visitors see">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Heading</span>
              <input name="hero_title" defaultValue={c.hero.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Subheading</span>
              <input name="hero_subtitle" defaultValue={c.hero.subtitle || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block md:col-span-2">
              <span className="font-medium text-[var(--ink)]">Body text</span>
              <textarea name="hero_body" rows={3} defaultValue={c.hero.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button label</span>
              <input name="hero_button_label" defaultValue={c.hero.button_label || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button link</span>
              <input name="hero_button_url" defaultValue={c.hero.button_url || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <div className="md:col-span-2">
              <ImagePickerField
                label="Hero image"
                name="hero_image_url"
                defaultValue={c.hero.image_url || ""}
                mediaOptions={mediaOptions}
              />
            </div>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save hero</button>
        </form>
      </SectionCard>

      {/* Featured Products section */}
      <SectionCard title="Featured Products Section" description="Heading and intro text for your featured products row">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Section heading</span>
              <input name="featured_products_title" defaultValue={c.featured_products.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Description</span>
              <input name="featured_products_body" defaultValue={c.featured_products.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save section</button>
        </form>
      </SectionCard>

      {/* Categories section */}
      <SectionCard title="Shop by Craft Section" description="Heading for your categories grid">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Section heading</span>
              <input name="categories_title" defaultValue={c.categories.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Description</span>
              <input name="categories_body" defaultValue={c.categories.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save section</button>
        </form>
      </SectionCard>

      {/* Story section */}
      <SectionCard title="Our Story Section" description="The homestead story block with an optional image">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Heading</span>
              <input name="story_title" defaultValue={c.story.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Subheading</span>
              <input name="story_subtitle" defaultValue={c.story.subtitle || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block md:col-span-2">
              <span className="font-medium text-[var(--ink)]">Body text</span>
              <textarea name="story_body" rows={3} defaultValue={c.story.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button label</span>
              <input name="story_button_label" defaultValue={c.story.button_label || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button link</span>
              <input name="story_button_url" defaultValue={c.story.button_url || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <div className="md:col-span-2">
              <ImagePickerField
                label="Story image"
                name="story_image_url"
                defaultValue={c.story.image_url || ""}
                mediaOptions={mediaOptions}
              />
            </div>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save story</button>
        </form>
      </SectionCard>

      {/* Seasonal section */}
      <SectionCard title="Seasonal Collection Section" description="Limited-run seasonal content block">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Heading</span>
              <input name="seasonal_title" defaultValue={c.seasonal.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Description</span>
              <input name="seasonal_body" defaultValue={c.seasonal.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <div className="md:col-span-2">
              <ImagePickerField
                label="Seasonal image"
                name="seasonal_image_url"
                defaultValue={c.seasonal.image_url || ""}
                mediaOptions={mediaOptions}
              />
            </div>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save section</button>
        </form>
      </SectionCard>

      {/* Journal section */}
      <SectionCard title="Journal Section" description="Heading for the latest journal posts row">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Section heading</span>
              <input name="journal_section_title" defaultValue={c.journal.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Description</span>
              <input name="journal_section_body" defaultValue={c.journal.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save section</button>
        </form>
      </SectionCard>

      {/* Contact section */}
      <SectionCard title="Contact Section" description="Call-to-action block at the bottom of the homepage">
        <form action={updateHomepageContent} className="space-y-4">
          <input type="hidden" name="page_slug" value="home" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Heading</span>
              <input name="contact_section_title" defaultValue={c.contact.title} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Body text</span>
              <input name="contact_section_body" defaultValue={c.contact.body || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button label</span>
              <input name="contact_button_label" defaultValue={c.contact.button_label || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
            <label className="space-y-1 text-sm block">
              <span className="font-medium text-[var(--ink)]">Button link</span>
              <input name="contact_button_url" defaultValue={c.contact.button_url || ""} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            </label>
          </div>
          <button className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-white">Save section</button>
        </form>
      </SectionCard>
    </section>
  );
}

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <div className="mb-4 border-b border-[var(--line)] pb-4">
        <h2 className="font-serif text-xl text-[var(--ink)]">{title}</h2>
        <p className="mt-0.5 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ImagePickerField({
  label,
  name,
  defaultValue,
  mediaOptions,
}: {
  label: string;
  name: string;
  defaultValue: string;
  mediaOptions: Array<{ id: string; fileName: string; url: string }>;
}) {
  return (
    <div className="space-y-2">
      <label className="space-y-1 text-sm block">
        <span className="font-medium text-[var(--ink)]">{label}</span>
        <input
          name={name}
          defaultValue={defaultValue}
          list={`${name}-options`}
          placeholder="Paste URL or pick from library below"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <datalist id={`${name}-options`}>
        {mediaOptions.map((asset) => (
          <option key={asset.id} value={asset.url}>
            {asset.fileName}
          </option>
        ))}
      </datalist>
      {defaultValue ? (
        <p className="rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs text-[var(--muted)] truncate">
          Current: {defaultValue}
        </p>
      ) : null}
    </div>
  );
}
