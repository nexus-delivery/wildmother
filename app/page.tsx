import { verifySupabaseConnection } from "@/lib/supabase";

export default async function Home() {
  const connection = await verifySupabaseConnection();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Wild Mother
        </h1>
        <p className="mt-2 text-slate-600">
          Supabase connection status for this environment.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-wide text-slate-500">Status</p>
          <p
            className={`mt-2 text-lg font-medium ${
              connection.ok ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {connection.ok ? "Connected" : "Connection failed"}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            HTTP code: <span className="font-medium">{connection.status}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">{connection.message}</p>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          This page only verifies connectivity. No ecommerce features are enabled.
        </p>
      </section>
    </main>
  );
}
