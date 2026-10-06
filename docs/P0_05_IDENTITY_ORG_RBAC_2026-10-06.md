# P0-05 — Production Identity, Organization Context, Roles & Access Control

Date: 2026-10-06
Status: DESIGN COMPLETE; SECURITY-SENSITIVE IMPLEMENTATION BLOCKED BY REPOSITORY SAFETY CONTROL; IDP/STAGING PROOF PENDING

## Objective
Ensure every production request is attributable to an authenticated person, an explicit active organization, and a least-privilege role. No user may inherit an arbitrary tenant because a database query returned the first membership.

## Existing foundation verified
- Production authentication uses OIDC/JWT verification through configured issuer, audience and JWKS.
- Development bypass is rejected by configuration in production.
- Active users must have an organization membership.
- RBAC permission middleware exists.
- Roles are admin, licensed_pa, claims_staff, reviewer and read_only.
- Regulated release/closure paths additionally require a verified PA license for the claim jurisdiction.
- Claim and evidence APIs scope data by req.user.organization_id.

## Critical remediation required
Current resolveMembership(userId) uses LIMIT 1. A person belonging to multiple organizations could therefore receive an implicit/arbitrary organization. Production must require explicit organization context and validate that the authenticated user has an active membership in that exact organization.

Required request model:
1. Verify identity-provider token.
2. Resolve token subject to active ADPA user.
3. Require explicit active organization selection.
4. Verify membership for user + selected organization.
5. Attach organization_id and role to request context.
6. Evaluate endpoint permission.
7. For regulated action, additionally verify active jurisdictional PA license.
8. Audit material/privileged action with actor + organization.

## Organization selection
The UI must obtain a server-authorized membership list and require the user to choose an organization when more than one exists. The client may remember the last selected organization for convenience, but the server must revalidate membership on every authenticated request. A client-supplied organization id is context, never proof of membership.

## Role principles
admin: administration plus claim functions, but admin status alone must not substitute for a jurisdictional PA license on licensed actions.
licensed_pa: claim preparation/review/negotiation/release only where license gate passes.
claims_staff: operational claim/document work; no licensed approval/release.
reviewer: review access should be narrowed before production; current claims:write permission requires review.
read_only: no mutations.

## Access lifecycle
Joiner: identity + explicit organization + approved role + MFA/IdP policy + training.
Mover: recalculate role/org access immediately; do not accumulate old permissions.
Leaver: deactivate/revoke promptly while preserving historical audit attribution.
Periodic: recertify admins, licensed users, dormant users, service identities and vendor access.

## Production identity-provider requirements
- OIDC/JWT with asymmetric signing/JWKS.
- MFA policy appropriate for privileged/regulated users.
- Short-lived sessions/tokens and secure renewal/revocation strategy.
- No shared human accounts.
- No production dev bypass.
- Secret/key management outside source.
- Issuer/audience validation.
- Account disable/termination path.
- Authentication/security logs and anomaly monitoring.
- Break-glass process documented, restricted and audited.

## Required staging tests
1. Missing token denied.
2. Invalid/expired/wrong-issuer/wrong-audience token denied.
3. Inactive user denied.
4. User without membership denied.
5. Missing explicit organization denied.
6. User cannot select an organization they do not belong to.
7. Multi-org user receives only explicitly selected org.
8. Tenant switch does not leak cached claims/evidence/audit.
9. read_only mutation denied.
10. claims_staff licensed approval/release denied.
11. reviewer permissions match final approved policy.
12. admin without valid PA license cannot perform licensed regulated action.
13. licensed_pa wrong jurisdiction/expired/unverified license denied.
14. valid licensed_pa correct jurisdiction allowed only for authorized endpoint.
15. deactivated membership loses access promptly.
16. material privileged action audit includes actor and organization.
17. dev bypass cannot activate in production.
18. direct object/claim id guessing cannot cross tenant.

## Safety-control event
An implementation attempt to alter the authentication membership resolver was blocked by repository safety controls. The control was respected. No workaround was used and no weakened authentication code was committed.

## Current decision
Identity/RBAC foundation: PASS.
Explicit organization design: COMPLETE.
Multi-org production safety: HOLD until implementation.
Production IdP: NOT PROVISIONED.
Staging auth/RBAC negative tests: NOT TESTED.
Real-client production: HOLD.

P0-05 DESIGN COMPLETE. Production implementation remains blocked/pending rather than being falsely marked secure.
