import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv, getServerSupabaseEnv } from "@/lib/env";

export function getSupabaseAdminClient() {
  const { url } = getPublicSupabaseEnv();
  const { serviceRoleKey } = getServerSupabaseEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
