import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { StudioRole } from "@/lib/studio/roles";
import { isStudioRole } from "@/lib/studio/roles";

export type StudioProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: StudioRole;
};

export async function getStudioContext() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle<StudioProfile>();

  if (!profile || !isStudioRole(profile.role)) {
    return { supabase, user, profile: null };
  }

  return { supabase, user, profile };
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
