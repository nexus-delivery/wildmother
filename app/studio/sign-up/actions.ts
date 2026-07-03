"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function signUpStudioOwner(formData: FormData) {
  const fullNameValue = formData.get("full_name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const fullName = typeof fullNameValue === "string" ? fullNameValue.trim() : "";
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    redirect("/studio/sign-up?error=missing_credentials");
  }

  const supabase = await getSupabaseServerClient();

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "owner");

  if ((count || 0) > 0) {
    redirect("/studio/sign-up?error=setup_complete");
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/studio/sign-up?error=signup_failed");
  }

  if (!data.user) {
    redirect("/studio/sign-up?error=signup_failed");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName || null,
    email,
    role: "owner",
  });

  if (profileError) {
    redirect("/studio/sign-up?error=profile_failed");
  }

  redirect("/studio");
}
