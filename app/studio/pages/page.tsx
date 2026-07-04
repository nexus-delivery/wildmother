import Link from "next/link";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioPagesPage() {
  await requireStudioRole(["owner", "admin", "editor"]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Website Pages</h1>
        <p className="mt-2 text-[var(--muted)]">Edit every public page on your website.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Homepage", desc: "Hero, story, featured products and all homepage sections", href: "/studio/website/homepage" },
          { title: "About", desc: "Your homestead story and background", href: "/studio/website/about" },
          { title: "Contact", desc: "Contact details and enquiry copy", href: "/studio/website/contact" },
          { title: "Settings & Footer", desc: "Business details, social links and footer text", href: "/studio/settings" },
        ].map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white p-5 hover:bg-[var(--paper)] transition-colors"
          >
            <p className="font-serif text-xl text-[var(--ink)]">{page.title}</p>
            <p className="text-sm text-[var(--muted)]">{page.desc}</p>
            <p className="text-sm font-medium text-[var(--forest)]">Edit →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

