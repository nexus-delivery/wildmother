import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export type SupabaseConnectionStatus = {
  ok: boolean;
  status: number;
  message: string;
};

export async function verifySupabaseConnection(): Promise<SupabaseConnectionStatus> {
  try {
    const authSettingsUrl = new URL("/auth/v1/settings", supabaseUrl).toString();
    const response = await fetch(authSettingsUrl, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const details = (await response.text()).slice(0, 240);
      return {
        ok: false,
        status: response.status,
        message: details || "Supabase endpoint returned an error response.",
      };
    }

    return {
      ok: true,
      status: response.status,
      message: "Connected to Supabase Auth API.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      ok: false,
      status: 0,
      message,
    };
  }
}