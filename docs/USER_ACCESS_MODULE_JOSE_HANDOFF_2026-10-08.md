# ADPA User Access — implementation and identity handoff

Date: 2026-10-08
Status: Account-planning module implemented. Live sign-in, activation and account invitations NOT connected.

## What is usable now
- User Access navigation, team planning cards, create/edit/archive plans, proposed role matrix, and explicit claim assignments.
- Three initial demo plans: Angelo Daniel (administrator with separate proposed PA authority), Jason (Claims Staff, no PA approval/release), Peter Rooney (proposed scope/estimate specialist).
- Local demo plans use their own browser-storage key; no login, password or real access is created.
- Login Setup explains pending provider-hosted sign-in, password recovery, MFA, invitations and revocation; no secret is collected.
- API mode obtains actual identity/permissions from the server. Account planning requires users:manage; browser role selection never substitutes for authorization.
- Server account plans are tenant-scoped, input-validated and audited within the same transaction. Only draft/archived are accepted.
- Existing memberships are read-only in this module. No provider calls, invitation delivery or membership grants.

## José's connection points
1. Run the existing db:migrate command to create access_account_plans. This implementation has not run against a hosted database.
2. Connect the chosen identity provider's hosted sign-in, verified email, recovery and MFA. Do not build a password store or put secrets into Vite variables.
3. Replace the legacy sessionStorage token approach with the approved session/token adapter and renewal/logout strategy. apiRequest is the existing centralized request seam.
4. Complete explicit organization selection and membership verification described in P0_05_IDENTITY_ORG_RBAC_2026-10-06.md. Existing auth.js still uses the first membership; this module does not fix that production blocker.
5. Reconcile live server permissions with the proposed matrix BEFORE activation: admin must not imply licensed authority; reviewer must lose general claims:write; add estimator with field-limited write handling. Current server roles remain unchanged deliberately.
6. Add server-enforced claim assignments to list/read/write/evidence/approval routes. Planning assignments alone do not restrict existing claim APIs.
7. Connect administrator-approved provisioning, invitation delivery, identity-subject matching, suspension and immediate session revocation. Access plans must never be activated by copying browser fields blindly.
8. Connect Angelo's administrative membership and separately verified PA authority. Verify license records per claim jurisdiction. Jason remains Claims Staff with no PA authority.
9. Harden all approval/release record writes: the current general claim JSON save path must not allow staff to insert PA approvals or released settlement states. Existing release/closure check routes alone are insufficient.
10. Preserve independent client authorization, current-package checks and financial gates. No live carrier send or settlement release is enabled by this module.
11. Validate least privilege, cross-tenant and cross-claim denial, inactive/revoked sessions, privileged MFA, concurrent account changes and audit durability in staging.

## API contract implemented
All endpoints inherit existing bearer authentication on /api.
- GET /api/access/me: actual user identity, organization and server permissions.
- GET /api/access/members: administrator-only organization membership list, read-only.
- GET /api/access/plans: administrator-only proposed plans.
- POST /api/access/plans: save an inactive plan.
- PUT /api/access/plans/:uuid: edit or archive an inactive plan in the current organization.

POST/PUT fields: displayName, email (optional blank), role, licensedAuthority, scope="assigned", claimIds[], status="draft"|"archived", notes.
Unknown fields (including passwords) are rejected. Assignments must identify claims in the current organization.
Saving returns planningOnly=true, accountActivated=false, invitationSent=false.

## Validation and remaining limits
Regression tests cover the agreed Jason policy, proposed role separation, invalid/active plan rejection, unauthorized administration, tenant-scoped plan writes, unknown-claim rejection, audit recording and absence of live identity/membership writes.
Tests use an injected database test double; real PostgreSQL migrations and transaction rollback must be verified in staging.
This is a plug-in-ready planning module, not proof that production identity, claim restrictions or legal authority enforcement is complete.
