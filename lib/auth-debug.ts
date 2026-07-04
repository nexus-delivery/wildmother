type AuthDebugMeta = Record<string, unknown>;

function isAuthDebugEnabled() {
  const explicitFlag = process.env.AUTH_DEBUG?.trim();
  if (explicitFlag === "1" || explicitFlag === "true") {
    return true;
  }

  return process.env.VERCEL_ENV === "production";
}

function sanitizeMeta(meta: AuthDebugMeta | undefined) {
  if (!meta) {
    return undefined;
  }

  const sanitized: AuthDebugMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }

    if (key.toLowerCase().includes("email") && typeof value === "string") {
      const [local, domain] = value.split("@");
      if (domain) {
        sanitized[key] = `${local.slice(0, 2)}***@${domain}`;
      } else {
        sanitized[key] = "***";
      }
      continue;
    }

    if (key.toLowerCase().includes("token") || key.toLowerCase().includes("cookie")) {
      sanitized[key] = "[redacted]";
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

export function logAuthDebug(scope: string, message: string, meta?: AuthDebugMeta) {
  if (!isAuthDebugEnabled()) {
    return;
  }

  const payload = sanitizeMeta(meta);
  if (payload) {
    console.log(`[auth:${scope}] ${message}`, payload);
    return;
  }

  console.log(`[auth:${scope}] ${message}`);
}
