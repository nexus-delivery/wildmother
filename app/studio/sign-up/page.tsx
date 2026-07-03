import Link from "next/link";
import { signUpStudioOwner } from "@/app/studio/sign-up/actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function StudioSignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await getSupabaseServerClient();

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "owner");

  const setupComplete = (count || 0) > 0;

  if (setupComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-12">
        <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <p className="font-serif text-3xl text-[var(--forest)]">Studio setup is already complete</p>
          <p className="mt-3 text-sm text-[var(--muted)]">An owner account already exists. Public Studio sign-up is disabled.</p>
          <Link href="/studio/sign-in" className="mt-5 inline-block text-sm underline">
            Go to Studio sign-in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
        <p className="font-serif text-3xl text-[var(--forest)]">Create Studio owner</p>
        <p className="mt-2 text-sm text-[var(--muted)]">This can only be done once for the first Studio account.</p>

        <form action={signUpStudioOwner} className="mt-6 space-y-4">
          <label className="block space-y-1 text-sm">
            <span>Full name</span>
            <input name="full_name" className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Email</span>
            <input name="email" type="email" required className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Password</span>
            <input name="password" type="password" required className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          {params.error ? <p className="text-sm text-red-700">Setup failed. Try again.</p> : null}
          <button className="w-full rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white">Create owner account</button>
        </form>
      </section>
    </main>
  );
}
