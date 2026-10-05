export const ROLES = ["admin", "licensed_pa", "claims_staff", "reviewer", "read_only"];

const permissions = {
  admin: new Set(["claims:read","claims:write","claims:approve","documents:read","documents:write","audit:read","users:manage"]),
  licensed_pa: new Set(["claims:read","claims:write","claims:approve","documents:read","documents:write","audit:read"]),
  claims_staff: new Set(["claims:read","claims:write","documents:read","documents:write"]),
  reviewer: new Set(["claims:read","claims:write","documents:read","audit:read"]),
  read_only: new Set(["claims:read","documents:read"])
};

export function hasPermission(role, permission) {
  return permissions[role]?.has(permission) || false;
}
