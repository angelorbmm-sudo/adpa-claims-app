// Proposed access only. These plans never authorize a session or change RBAC.
export const ACCESS_ROLES = [
  { key: "admin", label: "Administrator", description: "Manage team accounts and settings. Licensed authority is separate.", capabilities: ["claims:read", "claims:write", "documents:read", "documents:write", "users:manage"] },
  { key: "licensed_pa", label: "Licensed PA", description: "Claim editing, PA review and release, subject to active jurisdictional license checks.", capabilities: ["claims:read", "claims:write", "documents:read", "documents:write", "claims:approve", "claims:release"] },
  { key: "claims_staff", label: "Claims Staff", description: "Operational claim and evidence editing; no PA approval or settlement release.", capabilities: ["claims:read", "claims:write", "documents:read", "documents:write"] },
  { key: "estimator", label: "Scope / Estimate Specialist", description: "Assigned scope and estimate work. Requires a dedicated limited-write endpoint before activation.", capabilities: ["claims:read", "documents:read", "estimates:write"] },
  { key: "reviewer", label: "Reviewer", description: "Review claim materials and record review notes. No general claim editing or PA authority.", capabilities: ["claims:read", "documents:read", "reviews:write"] },
  { key: "read_only", label: "Viewer", description: "View assigned claims and evidence without changing records.", capabilities: ["claims:read", "documents:read"] }
];
export const CAPABILITIES = [
  ["claims:read", "View claims"], ["claims:write", "Edit claims"], ["documents:write", "Edit evidence"],
  ["estimates:write", "Edit scopes / estimates"], ["reviews:write", "Review notes"],
  ["users:manage", "Manage accounts"], ["claims:approve", "Licensed PA approval"], ["claims:release", "Settlement release"]
];
export const roleDefinition = role => ACCESS_ROLES.find(r => r.key === role);
export function plannedCapabilities(plan) {
  const caps = new Set(roleDefinition(plan.role)?.capabilities || []);
  if (plan.role === "admin" && plan.licensedAuthority) {
    caps.add("claims:approve"); caps.add("claims:release");
  }
  return [...caps];
}
export function validateAccessPlan(plan, claimIds = []) {
  const errors = [];
  if (!String(plan.displayName || "").trim()) errors.push("Enter a display name.");
  if (!roleDefinition(plan.role)) errors.push("Choose a supported proposed role.");
  if (plan.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(plan.email)) errors.push("Enter a valid email or leave it blank until confirmed.");
  if (!["draft", "archived"].includes(plan.status)) errors.push("Plans can only be draft or archived; they do not activate accounts.");
  if (plan.scope !== "assigned") errors.push("Use explicit claim assignments.");
  if (!Array.isArray(plan.claimIds) || plan.claimIds.some(id => !claimIds.includes(id))) errors.push("One or more assigned claims are unavailable.");
  if (plan.licensedAuthority && plan.role !== "admin") errors.push("Separate licensed authority is only an administrator planning option.");
  return errors;
}
export function initialAccessPlans() {
  return [
    { id: "plan-angelo", displayName: "Angelo Daniel", email: "", role: "admin", licensedAuthority: true, scope: "assigned", claimIds: [], status: "draft", notes: "Owner and licensed PA. License verification and administrator MFA must be completed before activation." },
    { id: "plan-jason", displayName: "Jason", email: "", role: "claims_staff", licensedAuthority: false, scope: "assigned", claimIds: [], status: "draft", notes: "Agreed access: claim editing. No current PA license; no PA approval or settlement release." },
    { id: "plan-peter", displayName: "Peter Rooney", email: "", role: "estimator", licensedAuthority: false, scope: "assigned", claimIds: [], status: "draft", notes: "Proposed scope / estimate specialist. Confirm assignments and limited-write enforcement before activation." }
  ];
}
