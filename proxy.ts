import { NextResponse, type NextRequest } from "next/server";
import { logAuthDebug } from "@/lib/auth-debug";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isStudio = path.startsWith("/studio");
  const isSignIn = path === "/studio/sign-in" || path === "/studio/login";
  const isSignUp = path === "/studio/sign-up";

  const { supabaseResponse, user } = await updateSession(request);

  logAuthDebug("proxy", "route-check", {
    path,
    isStudio,
    isSignIn,
    hasUser: Boolean(user),
    userId: user?.id || null,
  });

  if (isStudio && !isSignIn && !isSignUp && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/studio/sign-in";
    redirectUrl.searchParams.set("redirectTo", path);
    logAuthDebug("proxy", "redirect:signin", {
      from: path,
      to: redirectUrl.pathname,
    });
    return NextResponse.redirect(redirectUrl);
  }

  if (isSignIn && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/studio";
    logAuthDebug("proxy", "redirect:studio", {
      from: path,
      to: redirectUrl.pathname,
      userId: user.id,
    });
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/studio/:path*"],
};