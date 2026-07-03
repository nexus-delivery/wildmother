import Link from "next/link";
import { requireStudioUser } from "@/lib/studio-auth";

const navItems = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/journals", label: "Journals" },
  { href: "/studio/products", label: "Products" },
  { href: "/studio/categories", label: "Categories" },
  { href: "/studio/media", label: "Media Library" },
  { href: "/studio/pages", label: "Pages" },
  { href: "/studio/settings", label: "Site Settings" },
  { href: "/studio/users", label: "Studio Users" },
  { href: "/studio/seo", label: "SEO" },
];

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStudioUser();

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-2xl text-[var(--forest)]">Studio</p>
            <p className="text-xs text-[var(--muted)]">{profile.email} · {profile.role}</p>
          </div>
          <Link href="/studio/sign-out" className="rounded-md border border-[var(--line)] px-4 py-2 text-sm">
            Sign out
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 md:grid-cols-[220px_1fr]">
        <nav className="rounded-xl border border-[var(--line)] bg-white p-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--paper)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/" className="mt-4 block rounded-md border border-[var(--line)] px-3 py-2 text-sm text-center">
            View site
          </Link>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
