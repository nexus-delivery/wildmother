import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/studio/sign-in", process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"));
}
