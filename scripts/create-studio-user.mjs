import { createClient } from "@supabase/supabase-js";

function readEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }
  return value;
}

async function main() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  const email = readEnv("STUDIO_ADMIN_EMAIL");
  const password = readEnv("STUDIO_ADMIN_PASSWORD");
  const role = (process.env.STUDIO_ADMIN_ROLE?.trim() || "owner").toLowerCase();

  if (!["owner", "admin", "editor"].includes(role)) {
    throw new Error("STUDIO_ADMIN_ROLE must be owner, admin, or editor.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: existingList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw listError;
  }

  const existing = existingList.users.find((user) => user.email === email);

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });

    if (error) {
      throw error;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: existing.id,
      email,
      role,
    });

    if (profileError) {
      throw profileError;
    }

    console.log(`Updated existing Studio user: ${email} (${role})`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("User was not returned by Supabase.");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    role,
  });

  if (profileError) {
    throw profileError;
  }

  console.log(`Created Studio user: ${email} (${role})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
