import type { NextConfig } from "next";

let supabaseHostname: string | undefined;

try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) {
    supabaseHostname = new URL(url).hostname;
  }
} catch {
  supabaseHostname = undefined;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
