import Link from "next/link";
import { signInStudio } from "@/app/studio/sign-in/actions";

export default async function StudioSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = Boolean(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
        <p className="font-serif text-3xl text-[var(--forest)]">Wild Mother Studio</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Sign in to manage products, pages, and media.</p>

        <form action={signInStudio} className="mt-6 space-y-4">
          <label className="block space-y-1 text-sm">
            <span>Email</span>
            <input name="email" type="email" required className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-[var(--line)] px-3 py-2"
            />
          </label>
          {hasError ? <p className="text-sm text-red-700">Sign-in failed. Check credentials.</p> : null}
          <button className="w-full rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white">Sign in</button>
        </form>

        <p className="mt-6 text-xs text-[var(--muted)]">
          First-time setup only: <Link className="underline" href="/studio/sign-up">create owner account</Link>
        </p>
      </section>
    </main>
  );
}
