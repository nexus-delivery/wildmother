"use server";

import { redirect } from "next/navigation";

export async function loginStudio() {
  redirect("/studio/sign-in");
}
