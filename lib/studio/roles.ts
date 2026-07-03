export const STUDIO_ROLES = ["owner", "admin", "editor"] as const;

export type StudioRole = (typeof STUDIO_ROLES)[number];

export function isStudioRole(value: string | null | undefined): value is StudioRole {
  return value === "owner" || value === "admin" || value === "editor";
}

export const CONTENT_EDITOR_ROLES: StudioRole[] = ["owner", "admin", "editor"];
export const MANAGEMENT_ROLES: StudioRole[] = ["owner", "admin"];
