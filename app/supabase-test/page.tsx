import { verifySupabaseConnection } from "@/lib/supabase";

export default async function SupabaseTestPage() {
  const connection = await verifySupabaseConnection();
  const hasError = !connection.ok;
  const fullErrorMessage = JSON.stringify(
    {
      status: connection.status,
      message: connection.message,
    },
    null,
    2,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Supabase Test
        </h1>
        <p className="mt-2 text-slate-600">
          Local lightweight connectivity check without querying app data tables.
        </p>

        {!hasError && (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-lg font-medium text-emerald-800">✅ Supabase connected</p>
            <p className="mt-2 text-sm text-emerald-700">Connection check succeeded.</p>
          </div>
        )}

        {hasError && (
          <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-lg font-medium text-rose-800">Connection failed</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-rose-100 p-3 text-sm text-rose-800">
              {fullErrorMessage}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}