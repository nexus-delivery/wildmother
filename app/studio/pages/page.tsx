import { updateHomepageContent } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioPagesPage() {
  await requireStudioRole(["owner", "admin", "editor"]);
  const data = await getStudioBootstrapData();
  const supabase = await getSupabaseServerClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("slug,title,content,seo_title,seo_description,og_image_url")
    .in("slug", ["about", "contact"]);

  const about = pages?.find((item) => item.slug === "about");
  const contact = pages?.find((item) => item.slug === "contact");

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Pages</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Edit homepage copy, section labels, and SEO fields. Everything is CMS-driven.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Homepage Content</h2>
        <form action={updateHomepageContent} className="mt-4 space-y-3">
          <input type="hidden" name="page_slug" value="home" />
          <label className="space-y-1 text-sm block">
            <span>Page title</span>
            <input
              name="title"
              defaultValue={data.homepage.title}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>SEO title</span>
            <input
              name="seo_title"
              defaultValue={data.homepage.seo_title || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>SEO description</span>
            <textarea
              name="seo_description"
              rows={3}
              defaultValue={data.homepage.seo_description || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>Hero image URL</span>
            <input
              name="hero_image_url"
              defaultValue={data.homepage.content.hero.image_url || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>Story image URL</span>
            <input
              name="story_image_url"
              defaultValue={data.homepage.content.story.image_url || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>Seasonal image URL</span>
            <input
              name="seasonal_image_url"
              defaultValue={data.homepage.content.seasonal.image_url || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>OpenGraph image URL</span>
            <input
              name="og_image_url"
              defaultValue={data.homepage.og_image_url || ""}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm block">
            <span>Homepage content JSON</span>
            <textarea
              name="content_json"
              rows={26}
              defaultValue={JSON.stringify(data.homepage.content, null, 2)}
              className="w-full rounded-md border border-[var(--line)] px-3 py-2 font-mono text-xs"
            />
          </label>
          <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white">Save homepage</button>
        </form>
      </article>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">About Page</h2>
        <PageSimpleForm
          slug="about"
          defaultTitle={about?.title || "About"}
          defaultBody={(about?.content as { body?: string } | null)?.body || ""}
          defaultSeoTitle={about?.seo_title || ""}
          defaultSeoDescription={about?.seo_description || ""}
          defaultOgImageUrl={about?.og_image_url || ""}
        />
      </article>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Contact Page</h2>
        <PageSimpleForm
          slug="contact"
          defaultTitle={contact?.title || "Contact"}
          defaultBody={(contact?.content as { body?: string } | null)?.body || ""}
          defaultSeoTitle={contact?.seo_title || ""}
          defaultSeoDescription={contact?.seo_description || ""}
          defaultOgImageUrl={contact?.og_image_url || ""}
        />
      </article>
    </section>
  );
}

function PageSimpleForm({
  slug,
  defaultTitle,
  defaultBody,
  defaultSeoTitle,
  defaultSeoDescription,
  defaultOgImageUrl,
}: {
  slug: "about" | "contact";
  defaultTitle: string;
  defaultBody: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageUrl: string;
}) {
  const json = JSON.stringify({ body: defaultBody }, null, 2);

  return (
    <form action={updateHomepageContent} className="mt-4 space-y-3">
      <input type="hidden" name="page_slug" value={slug} />
      <label className="space-y-1 text-sm block">
        <span>Title</span>
        <input name="title" defaultValue={defaultTitle} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span>SEO title</span>
        <input name="seo_title" defaultValue={defaultSeoTitle} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span>SEO description</span>
        <textarea name="seo_description" rows={3} defaultValue={defaultSeoDescription} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span>OpenGraph image URL</span>
        <input name="og_image_url" defaultValue={defaultOgImageUrl} className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
      </label>
      <label className="space-y-1 text-sm block">
        <span>Content JSON</span>
        <textarea name="content_json" rows={10} defaultValue={json} className="w-full rounded-md border border-[var(--line)] px-3 py-2 font-mono text-xs" />
      </label>
      <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white">Save {slug} page</button>
    </form>
  );
}
