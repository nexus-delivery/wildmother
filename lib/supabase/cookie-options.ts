function hostnameFromSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    return "";
  }

  try {
    return new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function resolveAuthCookieDomain(hostname?: string) {
  const host = (hostname || hostnameFromSiteUrl() || "").toLowerCase();

  if (host.endsWith("wildmother.co.uk")) {
    return ".wildmother.co.uk";
  }

  return undefined;
}

export function getAuthCookieOptions(hostname?: string) {
  const domain = resolveAuthCookieDomain(hostname);
  if (!domain) {
    return undefined;
  }

  return {
    domain,
    path: "/",
    secure: true,
    sameSite: "lax" as const,
  };
}
