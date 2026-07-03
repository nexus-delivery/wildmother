const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const REQUIRED_SERVER_ENV = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

export function getPublicSupabaseEnv() {
  return {
    url: readEnv(REQUIRED_ENV[0]),
    anonKey: readEnv(REQUIRED_ENV[1]),
  };
}

export function getServerSupabaseEnv() {
  return {
    serviceRoleKey: readEnv(REQUIRED_SERVER_ENV[0]),
  };
}

export function getSiteEnv() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Wild Mother";

  return { siteUrl, siteName };
}
