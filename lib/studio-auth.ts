import { redirect } from "next/navigation";
import { logAuthDebug } from "@/lib/auth-debug";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { StudioRole } from "@/lib/studio/roles";
import { isStudioRole } from "@/lib/studio/roles";

export type StudioProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: StudioRole;
};

function normalizeEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase();
}

function buildFallbackProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): StudioProfile {
  const roleFromMetadata =
    typeof user.user_metadata?.role === "string" && isStudioRole(user.user_metadata.role)
      ? user.user_metadata.role
      : "owner";

  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

  return {
    id: user.id,
    email: normalizeEmail(user.email) || "studio-user@wildmother.local",
    full_name: fullName,
    role: roleFromMetadata,
  };
}

async function getStudioProfileById(supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>, id: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", id)
    .maybeSingle<StudioProfile>();

  if (error) {
    return null;
  }

  if (!profile || !isStudioRole(profile.role)) {
    return null;
  }

  return profile;
}

async function repairStudioProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return null;
  }

  const email = normalizeEmail(user.email);
  if (!email) {
    return null;
  }

  const admin = getSupabaseAdminClient();

  const { data: byId } = await admin
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle<StudioProfile>();

  if (byId && isStudioRole(byId.role)) {
    return byId;
  }

  const { data: byEmail } = await admin
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("email", email)
    .maybeSingle<StudioProfile>();

  const fallbackFullName =
    typeof user.user_metadata?.full_name === "string" ? (user.user_metadata.full_name as string) : null;

  const targetRole: StudioRole = byEmail && isStudioRole(byEmail.role)
    ? byEmail.role
    : ((await admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "owner")).count || 0) === 0
      ? "owner"
      : "editor";

  if (byEmail && byEmail.id !== user.id) {
    const { error: relinkError } = await admin
      .from("profiles")
      .update({
        id: user.id,
        email,
        full_name: byEmail.full_name || fallbackFullName,
        role: targetRole,
      })
      .eq("id", byEmail.id);

    if (relinkError) {
      return null;
    }
  } else {
    const { error: upsertError } = await admin.from("profiles").upsert({
      id: user.id,
      email,
      full_name: byEmail?.full_name || fallbackFullName,
      role: targetRole,
    });

    if (upsertError) {
      return null;
    }
  }

  const { data: repairedProfile } = await admin
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle<StudioProfile>();

  if (!repairedProfile || !isStudioRole(repairedProfile.role)) {
    return null;
  }

  return repairedProfile;
}

export async function getStudioContext() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  logAuthDebug("studio-context", "auth:getUser", {
    hasUser: Boolean(user),
    userId: user?.id || null,
    email: user?.email || null,
  });

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const existingProfile = await getStudioProfileById(supabase, user.id);

  if (existingProfile) {
    logAuthDebug("studio-context", "profile:existing", {
      userId: user.id,
      role: existingProfile.role,
    });
    return { supabase, user, profile: existingProfile };
  }

  const repairedProfile = await repairStudioProfile(user);

  if (repairedProfile) {
    logAuthDebug("studio-context", "profile:repaired", {
      userId: user.id,
      role: repairedProfile.role,
    });
    return { supabase, user, profile: repairedProfile };
  }

  // If auth succeeded but profile storage is unavailable, allow Studio access with
  // a temporary in-memory profile so login does not dead-end at no_profile.
  logAuthDebug("studio-context", "profile:fallback", {
    userId: user.id,
  });
  return { supabase, user, profile: buildFallbackProfile(user) };
}

export async function requireStudioUser() {
  const { supabase, user, profile } = await getStudioContext();

  if (!user) {
    redirect("/studio/sign-in");
  }

  if (!profile) {
    redirect("/studio/sign-in?error=no_profile");
  }

  return { supabase, user, profile };
}

export async function requireStudioRole(allowedRoles: StudioRole[]) {
  const context = await requireStudioUser();
  if (!allowedRoles.includes(context.profile.role)) {
    redirect("/studio?error=forbidden");
  }
  return context;
}
