import Link from "next/link";
import { logAuthDebug } from "@/lib/auth-debug";
import { requireStudioUser } from "@/lib/studio-auth";

const navGroups = [
  {
    label: null,
    items: [{ href: "/studio", label: "Dashboard", icon: "⌂" }],
  },
  {
    label: "Website",
    items: [
      { href: "/studio/website/homepage", label: "Homepage", icon: "🏠" },
      { href: "/studio/website/about", label: "About", icon: "✦" },
      { href: "/studio/website/contact", label: "Contact", icon: "✉" },
      { href: "/studio/seo", label: "SEO", icon: "⌕" },
    ],
  },
  {
    label: "Shop",
    items: [
      { href: "/studio/products", label: "Products", icon: "⬡" },
      { href: "/studio/categories", label: "Categories", icon: "⊞" },
      { href: "/studio/collections", label: "Collections", icon: "❖" },
    ],
  },
  {
    label: null,
    items: [{ href: "/studio/media", label: "Media Library", icon: "◫" }],
  },
  {
    label: null,
    items: [{ href: "/studio/journals", label: "Journal", icon: "✑" }],
  },
  {
    label: null,
    items: [
      { href: "/studio/settings", label: "Settings", icon: "⚙" },
      { href: "/studio/users", label: "Studio Users", icon: "⊙" },
    ],
  },
];

export default async function StudioProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStudioUser();

  logAuthDebug("studio-layout", "session-ok", {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Mobile top bar */}
      <header className="border-b border-[var(--line)] bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-serif text-xl text-[var(--forest)]">Wild Mother Studio</p>
          <Link href="/studio/sign-out" className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
            Sign out
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-[var(--line)] md:bg-white md:min-h-screen">
          {/* Brand */}
          <div className="border-b border-[var(--line)] px-5 py-5">
            <p className="font-serif text-xl leading-tight text-[var(--forest)]">Wild Mother</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[var(--sage)]">Studio</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {navGroups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-4" : ""}>
                {group.label ? (
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{group.label}</p>
                ) : null}
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--forest)]"
                      >
                        <span className="w-4 text-center text-base opacity-60">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-[var(--line)] px-3 py-3">
            <p className="mb-2 truncate px-2 text-xs text-[var(--muted)]">{profile.email}</p>
            <Link
              href="/"
              target="_blank"
              className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--forest)] hover:bg-[var(--paper)]"
            >
              <span className="opacity-60">↗</span> Preview site
            </Link>
            <Link
              href="/studio/sign-out"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--paper)]"
            >
              <span className="opacity-60">→</span> Sign out
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
