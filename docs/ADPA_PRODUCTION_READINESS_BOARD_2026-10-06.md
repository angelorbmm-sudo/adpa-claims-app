# ADPA Production Readiness Board

**As of:** 2026-10-06  
**Purpose:** Single operating board for the 12 P0 production-readiness items.  
**Production decision:** **NO-GO for real-client production.** Continue private development and synthetic/demo work.

## Status legend
- **CODE DONE** — repository remediation completed; production-like proof may still be required.
- **BLOCKED** — required security-sensitive implementation is not safely writable through the current environment.
- **JOSÉ / INFRA** — requires cloud/provider/identity/storage infrastructure.
- **STAGING TEST** — design/code exists but must be proven against the deployed staging system.
- **OPEN** — material work remains.

| P0 | Control | Repository / Design | Remaining owner | Runtime proof | Current status |
|---|---|---|---|---|---|
| 01 | Tenant-safe claim identity | Composite organization + claim identity, scoped audit/query changes, migration prepared | José + Susie | Migration, same-ID cross-tenant, rollback | **CODE DONE · STAGING TEST** |
| 02 | Server-owned privileged authority | Architecture defined; current generic claim JSON must not authorize PA/client/release actions | Security-permitted code path + Susie/José | RBAC, stale/revoked authority, package binding | **BLOCKED · OPEN** |
| 03 | API/PostgreSQL authoritative system of record | API-first load/save boundary; browser storage demoted to cache/draft in API mode | José + Susie | Multi-session/concurrency/import/outage | **CODE DONE · STAGING TEST** |
| 04 | Secure evidence custody | Tenant-scoped evidence API, hash metadata, upload intent, quarantine, audit boundary | José + Susie | Private object store, scan/hash/version/recovery | **CODE DONE · JOSÉ / INFRA · STAGING TEST** |
| 05 | Production identity/org/RBAC | OIDC/RBAC foundation verified; explicit active-org design complete | Security-permitted code path + José | Multi-org selection, MFA/IdP, negative RBAC | **BLOCKED · JOSÉ / INFRA** |
| 06 | Trusted reproducible build | Node/npm standardized; CI hardened | Susie/José trusted npm runtime | Real reviewed lockfile, npm ci, dependency review | **OPEN** |
| 07 | Staging/production infrastructure | Readiness/liveness, graceful shutdown, production fail-closed config; topology/handoff complete | **José** | Provision staging then production | **JOSÉ / INFRA** |
| 08 | Backup/PITR/restore | Recovery targets and restore/reconciliation runbook complete | **José** + Susie | Real DB/evidence restore; measured RPO/RTO | **JOSÉ / INFRA · STAGING TEST** |
| 09 | Staging cutover rehearsal | Dataset, sequence, hard-fail criteria and rollback procedure complete | José + Susie + Angelo sign-off | Execute complete rehearsal | **STAGING TEST** |
| 10 | Server-authoritative regulatory/compliance | CA/NV architecture and authority boundary defined; protected server implementation pending | Security-permitted code path + Angelo PA review | Calendar/rule/negative compliance tests | **BLOCKED · OPEN** |
| 11 | Production financial invariants | Exact-cent server engine, issued/received reconciliation, depreciation/mortgage/duplicate gates, tests added | Susie + José | CI + persisted API/concurrency/heavy-claim staging tests | **CODE DONE · STAGING TEST** |
| 12 | Staging security validation | Static review and adversarial test program prepared | José + Susie/security reviewer | Execute deployed auth/RBAC/tenant/evidence/web/security tests | **STAGING TEST · BLOCKED BY UPSTREAM** |

## What is already safe to continue
Private GitHub development; synthetic/deidentified demo data; module development; regression-test expansion; documentation; non-production UI/UX testing.

## What remains OFF
Real-client production; live client evidence; production multi-tenant rollout; autonomous settlement/release/legal conclusions; privileged approval based on generic claim JSON; production e-sign until integration/security approval; unreviewed external-AI access to claim evidence; automatic carrier communications.

## Critical path from here
1. Resolve P0-02 privileged authority in a permitted security-code workflow.
2. Resolve P0-05 explicit organization selection and final RBAC.
3. Finish P0-06 with a real reviewed npm dependency graph + package-lock + npm ci.
4. Resolve P0-10 protected regulatory engine/calendar.
5. José provisions isolated synthetic staging: managed PostgreSQL, private evidence storage, OIDC/IdP, secrets, HTTPS, monitoring and backups.
6. Connect/test P0-04 evidence object storage + quarantine verification.
7. Execute P0-01, 03, 04, 05, 06, 08 and 11 staging acceptance suites.
8. Execute P0-09 full cutover/rollback rehearsal.
9. Execute P0-12 security validation and remediate every critical/high release blocker.
10. Run Production Readiness Review #2.
11. Only after all P0 controls PASS: controlled pilot under the Step-16 pilot plan.

## José handoff — first infrastructure session
José does **not** need to redesign ADPA. The first infrastructure session should focus on creating an isolated synthetic staging environment and supplying the deployment/configuration path. No real client data is needed.

Bring/provision:
- selected cloud/provider + region;
- staging web/API hosting;
- managed PostgreSQL with TLS/backups/PITR;
- private object storage with public access blocked/versioning;
- OIDC identity provider configuration;
- secret manager;
- HTTPS staging hostnames;
- centralized logs/metrics/alerts;
- least-privilege deployment identity.

Then Susie/ADPA can work through the prepared staging acceptance checklists instead of improvising production tests.

## Angelo decisions still required before production
- final Reviewer role authority;
- approved PA/client authority workflow and what evidence constitutes client authorization;
- final CA/NV compliance interpretations where professional judgment is required;
- retention/legal-hold business policy with counsel/privacy input as appropriate;
- approval of controlled-pilot scope and named users;
- final production go/no-go after evidence from PRR #2.

## Release rule
**No P0 is considered production PASS solely because code or documentation exists.** Infrastructure-dependent controls require measured staging evidence. Security-sensitive controls that remain blocked are not waived. One critical tenant, authority, evidence, financial-integrity, restore, or authentication failure is a production NO-GO.

## Executive snapshot
- **Code-completed P0s awaiting proof:** 01, 03, 04, 11.
- **Security-sensitive implementation blockers:** 02, 05, 10.
- **Trusted-build work still open:** 06.
- **José/cloud dependent:** 04, 05, 07, 08.
- **Staging execution gates:** 01, 03, 04, 05, 06, 08, 09, 11, 12.
- **Current production status:** **NO-GO — expected and controlled, not a project failure.**

This board supersedes informal status summaries; the detailed P0 documents remain the evidence/runbooks for each row.
