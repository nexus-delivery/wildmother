import { NextResponse, type NextRequest } from "next/server";
import { logAuthDebug } from "@/lib/auth-debug";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function resolveDestination(nextParam: string | null) {
  if (!nextParam) {
    return "/studio";
  }

  if (!nextParam.startsWith("/")) {
    return "/studio";
  }

  return nextParam;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const destination = resolveDestination(url.searchParams.get("next"));

  logAuthDebug("auth-callback", "received", {
    hasCode: Boolean(code),
    error,
    destination,
  });

  if (error) {
    logAuthDebug("auth-callback", "provider-error", {
      error,
      errorDescription,
    });
    return NextResponse.redirect(new URL("/studio/sign-in?error=callback_failed", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/studio/sign-in?error=missing_code", request.url));
  }

  const supabase = await getSupabaseServerClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    logAuthDebug("auth-callback", "exchange-failed", {
      code: exchangeError.code,
      status: exchangeError.status || null,
      message: exchangeError.message,
    });
    return NextResponse.redirect(new URL("/studio/sign-in?error=callback_exchange_failed", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logAuthDebug("auth-callback", "exchange-success", {
    hasUser: Boolean(user),
    userId: user?.id || null,
    destination,
  });

  return NextResponse.redirect(new URL(destination, request.url));
}
