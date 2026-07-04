import Link from "next/link";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioWebsitePage() {
  await requireStudioRole(["owner", "admin", "editor"]);

  const pages = [
    {
      title: "Homepage",
      description: "Hero, featured products, story and all homepage sections",
      href: "/studio/website/homepage",
      preview: "/",
    },
    {
      title: "About",
      description: "Your homestead story and background",
      href: "/studio/website/about",
      preview: "/about",
    },
    {
      title: "Contact",
      description: "Contact details and enquiry copy",
      href: "/studio/website/contact",
      preview: "/contact",
    },
    {
      title: "SEO & Settings",
      description: "Default SEO title, description and site settings",
      href: "/studio/settings",
      preview: null,
    },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Website Content</h1>
        <p className="mt-2 text-[var(--muted)]">Edit every public page on your website — no coding required.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <div key={page.href} className="rounded-2xl border border-[var(--line)] bg-white p-5 flex flex-col gap-4">
            <div className="flex-1">
              <h2 className="font-serif text-xl text-[var(--ink)]">{page.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{page.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={page.href}
                className="rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Edit
              </Link>
              {page.preview ? (
                <Link
                  href={page.preview}
                  target="_blank"
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--forest)] hover:bg-[var(--paper)]"
                >
                  ↗ Preview
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
