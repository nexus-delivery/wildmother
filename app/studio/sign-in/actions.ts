"use server";

import { redirect } from "next/navigation";
import { logAuthDebug } from "@/lib/auth-debug";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function resolveStudioRedirect(redirectTo: string | null) {
  if (!redirectTo) {
    return "/studio";
  }

  if (!redirectTo.startsWith("/studio")) {
    return "/studio";
  }

  return redirectTo;
}

export async function signInStudio(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const redirectToValue = formData.get("redirect_to");

  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const redirectTo = typeof redirectToValue === "string" ? redirectToValue : null;
  const destination = resolveStudioRedirect(redirectTo);

  logAuthDebug("sign-in", "attempt", {
    email,
    destination,
  });

  if (!email || !password) {
    logAuthDebug("sign-in", "missing-credentials", { email });
    redirect("/studio/sign-in?error=missing_credentials");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logAuthDebug("sign-in", "failed", {
      email,
      code: error.code,
      status: error.status || null,
      message: error.message,
    });
    redirect("/studio/sign-in?error=invalid_credentials");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  logAuthDebug("sign-in", "success", {
    email,
    hasUser: Boolean(user),
    userId: user?.id || null,
    destination,
  });

  if (!user) {
    redirect("/studio/sign-in?error=session_not_persisted");
  }

  redirect(destination);
}
