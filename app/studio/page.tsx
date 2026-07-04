import Link from "next/link";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioDashboardPage() {
  await requireStudioRole(["owner", "admin", "editor"]);

  const actions = [
    {
      icon: "🏠",
      label: "Edit Homepage",
      description: "Update your hero, story, and featured sections",
      href: "/studio/website/homepage",
      accent: "var(--forest)",
    },
    {
      icon: "⊞",
      label: "Add Category",
      description: "Create a new product category",
      href: "/studio/categories",
      accent: "var(--olive)",
    },
    {
      icon: "⬡",
      label: "Add Product",
      description: "List a new artisan product",
      href: "/studio/products",
      accent: "var(--honey)",
    },
    {
      icon: "📷",
      label: "Upload Photos",
      description: "Add images to your media library",
      href: "/studio/media",
      accent: "var(--terracotta)",
    },
    {
      icon: "◫",
      label: "Manage Media Library",
      description: "Browse, search and organise your images",
      href: "/studio/media",
      accent: "var(--brown)",
    },
    {
      icon: "✍️",
      label: "Write Journal Post",
      description: "Share a story, recipe or homestead update",
      href: "/studio/journals",
      accent: "var(--forest)",
    },
    {
      icon: "↗",
      label: "Preview Website",
      description: "See your live storefront",
      href: "/",
      accent: "var(--sage)",
      external: true,
    },
  ];

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Good morning</h1>
        <p className="mt-2 text-[var(--muted)]">What would you like to work on today?</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            className="group flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{action.icon}</span>
            <div>
              <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--forest)]">{action.label}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="font-serif text-2xl text-[var(--ink)]">Quick start guide</h2>
        <ol className="mt-4 space-y-3 text-sm text-[var(--ink)]">
          {[
            { step: "1", text: "Upload product photos in the Media Library", href: "/studio/media" },
            { step: "2", text: "Create categories for your product ranges", href: "/studio/categories" },
            { step: "3", text: "Add products and assign gallery images", href: "/studio/products" },
            { step: "4", text: "Edit your homepage hero and copy", href: "/studio/website/homepage" },
            { step: "5", text: "Update your business settings and SEO", href: "/studio/settings" },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--paper)] text-xs font-semibold text-[var(--forest)]">
                {item.step}
              </span>
              <Link href={item.href} className="leading-6 underline-offset-2 hover:underline">
                {item.text}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
