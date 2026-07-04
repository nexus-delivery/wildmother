import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { logAuthDebug } from "@/lib/auth-debug";
import { getPublicSupabaseEnv } from "@/lib/env";
import { getAuthCookieOptions } from "@/lib/supabase/cookie-options";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey } = getPublicSupabaseEnv();
  const sharedCookieOptions = getAuthCookieOptions(request.nextUrl.hostname);

  logAuthDebug("middleware", "updateSession:start", {
    path: request.nextUrl.pathname,
    host: request.nextUrl.hostname,
    cookieCount: request.cookies.getAll().length,
  });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        logAuthDebug("middleware", "updateSession:setAll", {
          path: request.nextUrl.pathname,
          count: cookiesToSet.length,
        });

        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        supabaseResponse = NextResponse.next({
          request,
        });

        for (const cookie of cookiesToSet) {
          supabaseResponse.cookies.set(cookie.name, cookie.value, {
            ...cookie.options,
            ...(sharedCookieOptions || {}),
          });
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logAuthDebug("middleware", "updateSession:user", {
    path: request.nextUrl.pathname,
    hasUser: Boolean(user),
    userId: user?.id || null,
  });

  return { supabaseResponse, user };
}
