import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { logAuthDebug } from "@/lib/auth-debug";
import { getPublicSupabaseEnv } from "@/lib/env";
import { getAuthCookieOptions } from "@/lib/supabase/cookie-options";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getPublicSupabaseEnv();
  const sharedCookieOptions = getAuthCookieOptions();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        logAuthDebug("server", "setAll", { count: cookiesToSet.length });

        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, {
            ...cookie.options,
            ...(sharedCookieOptions || {}),
          });
        }
      },
    },
  });
}
