import { createStudioUser, updateStudioUserRole } from "@/app/studio/actions";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioUsersPage() {
  const { supabase } = await requireStudioRole(["owner"]);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .order("created_at", { ascending: true });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Studio Users</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Only owner can create and manage Studio users.</p>
      </header>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Create user</h2>
        <form action={createStudioUser} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Full name</span>
            <input name="full_name" className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Email</span>
            <input name="email" required type="email" className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Password</span>
            <input name="password" required type="password" className="w-full rounded-md border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm">
            <span>Role</span>
            <select name="role" className="w-full rounded-md border border-[var(--line)] px-3 py-2">
              <option value="admin">admin</option>
              <option value="editor">editor</option>
            </select>
          </label>
          <button className="rounded-md bg-[var(--forest)] px-4 py-2 font-semibold text-white md:col-span-2">Create Studio user</button>
        </form>
      </article>

      <article className="rounded-xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-serif text-2xl">Existing users</h2>
        <div className="mt-4 space-y-3">
          {(profiles || []).map((profile) => (
            <form key={profile.id} action={updateStudioUserRole} className="grid items-end gap-2 md:grid-cols-[2fr_2fr_1fr_auto]">
              <input type="hidden" name="id" value={profile.id} />
              <p className="text-sm">{profile.full_name || "No name"}</p>
              <p className="text-sm text-[var(--muted)]">{profile.email}</p>
              <select
                name="role"
                defaultValue={profile.role}
                disabled={profile.role === "owner"}
                className="rounded-md border border-[var(--line)] px-2 py-1 text-sm"
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
              </select>
              <button disabled={profile.role === "owner"} className="rounded-md border border-[var(--line)] px-3 py-1 text-sm disabled:opacity-50">
                Update
              </button>
            </form>
          ))}
        </div>
      </article>
    </section>
  );
}
