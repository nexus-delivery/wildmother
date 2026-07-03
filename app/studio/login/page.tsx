import { redirect } from "next/navigation";

export default function LegacyStudioLoginPage() {
  redirect("/studio/sign-in");
}
