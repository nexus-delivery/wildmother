import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wild Mother",
    template: "%s | Wild Mother",
  },
  description: "Artisan homestead provisions and handcrafted seasonal goods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-serif text-3xl text-[var(--forest)]">
              Wild Mother
            </Link>
            <nav className="flex items-center gap-5 text-sm text-[var(--ink)]">
              <Link href="/products">Products</Link>
              <Link href="/journal">Journal</Link>
              <Link href="/studio">Studio</Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
            <p>Wild Mother. Crafted slowly. Shared generously.</p>
            <p>Artisan Commerce Platform v1</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
