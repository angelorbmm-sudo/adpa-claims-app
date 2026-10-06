# ADPA Tier-A Step 13 — Production Infrastructure Architecture

Audit/design date: 2026-10-06
Status: COMPLETE — PRODUCTION INFRASTRUCTURE BLUEPRINT DEFINED; NO LIVE INFRASTRUCTURE ACTIVATED

Purpose: define the production and staging environment required to move ADPA from the current private browser/backend foundation to a controlled internet-facing claims platform.

## Core rule
The private GitHub repository is source control, not the production database. adpa.claims should become the user-facing HTTPS application. Production claim records belong in managed PostgreSQL; original evidence belongs in private object storage; identity belongs in a production identity provider; secrets belong in a secret manager. No real client PII/evidence goes into the public demo or GitHub repository.

## Environment topology

### Production
- https://adpa.claims — production web application/PWA.
- https://api.adpa.claims — production API, or same-origin /api reverse proxy if chosen to reduce cross-origin complexity.
- Managed PostgreSQL — private/restricted network access, TLS, encryption at rest, automated backup/PITR.
- Private object storage — originals/derivatives, encryption, versioning, short-lived authorized access, malware/quarantine workflow.
- Production identity provider — OIDC/JWT with MFA policy as appropriate, issuer/audience/JWKS verification, explicit organization context.
- Central logging/metrics/alerts.
- Secret manager/KMS.
- DNS/TLS/WAF/rate-limit edge as supported by selected provider.

### Staging
- Separate staging application/API/database/storage/identity configuration.
- Synthetic/de-identified data only.
- Same architecture/configuration class as production where practical.
- Used for migrations, restore drills, security tests, performance tests and release rehearsal.
- Staging credentials/secrets must never grant production access.

### Demo
- Public synthetic-only environment.
- No production API/database/storage credentials.
- Prominent TEST DATA ONLY warning.
- Prefer completely isolated configuration/project/account from production.

## Trust boundaries
Internet/browser -> edge/TLS -> web app -> authenticated API -> authorization/tenant boundary -> PostgreSQL/private object storage.
External vendors (identity, future e-sign/email/AI) are separate trust boundaries with minimum-data scopes, explicit credentials and audited actions.

## Required production infrastructure gates

### I01 Domain, DNS and TLS
- adpa.claims under owner-controlled registrar/DNS.
- HTTPS only; automated certificate renewal.
- HSTS after HTTPS behavior is proven.
- Production and staging DNS clearly separated.
- No wildcard/public DNS record exposing internal services unnecessarily.

### I02 Application hosting
- Immutable deployable artifact tied to source commit.
- At least two healthy application instances/managed equivalent when availability requirements justify it.
- /live and /ready endpoints separated.
- Graceful shutdown/draining.
- Autoscaling/capacity limits based on Step 11 tests.
- Previous known-good release available for rollback.

### I03 PostgreSQL
- Managed supported PostgreSQL service.
- Encryption in transit/at rest.
- No public unrestricted database exposure.
- Separate least-privilege application/migration/admin credentials.
- Automated backups and PITR.
- Multi-AZ/high-availability configuration based on approved availability target.
- Connection pooling/timeouts/metrics.
- Numbered immutable schema migrations.
- Restore drill required before live cutover.

### I04 Evidence/object storage
- Private bucket/container; public access blocked.
- Encryption at rest and TLS.
- Object versioning/immutability strategy.
- Server-authorized short-lived upload/download.
- Server-side hash verification.
- MIME/type/size controls, malware quarantine and derivative separation.
- Tenant/claim/evidence object naming must not itself expose unnecessary PII.
- Lifecycle/retention/legal-hold controls.
- Access logging and restore/hash drill.

### I05 Identity and access
- Production OIDC/OAuth identity provider.
- AUTH_DEV_BYPASS permanently false in production.
- MFA required for privileged/admin/licensed roles unless a documented risk decision says otherwise.
- Explicit active organization selection for multi-org users.
- Server-side RBAC/tenant enforcement.
- Dedicated privileged endpoints for PA approvals/signatures/releases/migration.
- Joiner/mover/leaver process and emergency credential revocation.

### I06 Secrets and keys
- No production secret in GitHub source, browser bundle, .env committed file, screenshots or tickets.
- Provider secret manager for DB credentials, signing/integration secrets and vendor keys.
- Environment-scoped secrets with least privilege.
- Rotation/revocation procedure.
- KMS/provider-managed encryption keys initially unless stronger customer-managed-key requirements are approved.
- Secrets never written to application/audit logs.

### I07 Network/edge controls
- HTTPS only.
- Exact production origins; restrictive CORS or same-origin API.
- WAF/rate limiting where useful.
- DB/storage management plane restricted from public access.
- Egress controls/allowlists for sensitive vendor integrations where practical.
- DDoS/provider edge protection appropriate to exposure.

### I08 Logging, monitoring and alerting
Centralized, access-controlled, time-synchronized telemetry:
- request ID/correlation ID;
- authentication/authorization failures;
- privileged approval/release/closure/migration actions;
- application errors and latency;
- DB pool/query saturation;
- storage failures/quarantine;
- deployment/migration events;
- backup/PITR failures;
- security alerts.
Redact/minimize PII and never log tokens/secrets. Define retention separately from claim evidence retention.

### I09 Backup and disaster recovery
- Automated encrypted DB backups + PITR.
- Evidence durability/versioning.
- Configuration/infrastructure recovery documentation.
- Backup access separated from ordinary app writes where feasible.
- Step 10 restore drill with synthetic data before production.
- Approved/measured RPO/RTO, not merely proposed targets.

### I10 CI/CD and supply chain
- Step 9 first: reviewed pinned dependencies + committed lockfile + npm ci.
- Build/tests/security checks before deployment.
- Protected production environment with explicit approval.
- Immutable release identity: source SHA, dependency lock hash, artifact hash, test result.
- Production deploy credentials short-lived/federated where supported.
- GitHub Actions least privilege and hardened immutable action references.
- No direct developer laptop deployment to production.

### I11 Configuration and feature flags
Production must explicitly keep disabled until separately approved/tested:
- dev authentication bypass;
- browser localStorage as system of record;
- unreviewed evidence upload;
- autonomous AI claim decisions;
- outbound carrier email;
- production e-signature;
- automatic settlement/release/legal conclusions;
- unsafe migration replacement.
Feature flags/default-deny controls should permit controlled pilot activation.

### I12 Operational ownership
Named roles, not single-person dependency:
- Product/Business owner;
- Technical owner;
- Production deploy approver;
- Security/privacy owner;
- Data/backup recovery owner;
- Licensed PA authority owner;
- Incident lead.
José can implement technical infrastructure, but production authority/security/PA approvals remain separate responsibilities.

## Current repo readiness vs blueprint
PASS/FOUNDATION:
- Express API foundation.
- production config rejects dev bypass.
- JWT issuer/audience/JWKS design.
- organization/role concepts.
- PostgreSQL schema/transaction helper.
- private storage adapter fails closed.
- restricted configured CORS.
- 2 MB JSON limit.
- server-side regulated check concepts.
- CI build + Step 6 domain tests.
- cutover/rollback runbook.

PARTIAL:
- health endpoint exists but is not true dependency readiness.
- PostgreSQL pool exists but lacks measured timeout/sizing.
- audit exists but tenant/integrity findings from Steps 4/7 remain.
- migration exists but privilege/key/schema issues remain.
- deployment workflow exists only for synthetic GitHub Pages demo.

MISSING/BLOCKING:
- actual managed PostgreSQL.
- actual private object storage.
- production IdP/account lifecycle/MFA.
- production host/API/domain/TLS routing.
- secret manager/KMS configuration.
- centralized logging/metrics/alerts.
- WAF/rate limits.
- numbered DB migration framework.
- production CI/CD/rollback.
- staging environment.
- backup/PITR restore proof.
- lockfile/reproducible build from Step 9.
- tenant-safe claim key and server-owned privileged approvals from Steps 4/7.
- paginated production API from Step 11.

## Recommended implementation order
1. Remediate Step 9 reproducible dependency build.
2. Correct tenant-safe IDs/audit/privileged approval ownership.
3. Create isolated cloud projects/accounts for staging and production.
4. Establish DNS/TLS and staging app/API.
5. Provision staging managed PostgreSQL.
6. Implement numbered migrations and tenant-safe schema.
7. Connect production-grade IdP/RBAC in staging.
8. Implement private object storage/evidence custody in staging.
9. Add secret manager and environment configuration.
10. Add /live, /ready, graceful shutdown, request IDs, structured logs/metrics/alerts and rate limits.
11. Implement paginated API/backend authority; remove localStorage as canonical store.
12. Harden CI/CD and create immutable staging releases.
13. Run security, privacy, load, accessibility and restore tests against staging.
14. Provision production using the same reviewed infrastructure pattern.
15. Perform Step 14 staging cutover rehearsal.
16. Only after sign-off, conduct controlled production pilot.

## Provider selection criteria
ADPA does not need a specific cloud vendor to satisfy the architecture. Select based on:
- managed PostgreSQL maturity/PITR;
- private object storage/versioning;
- IAM/secret management;
- logging/monitoring;
- availability/region;
- security/compliance features required by ADPA;
- predictable cost at early scale;
- developer/José operational familiarity;
- straightforward backup/export/exit path;
- support for short-lived CI deployment credentials.
Avoid choosing infrastructure solely because it makes the first demo easiest.

## Go-live infrastructure acceptance tests
1. HTTP redirects to HTTPS and TLS configuration passes review.
2. Production dev bypass cannot start.
3. Tenant A cannot read/write/audit/evidence Tenant B.
4. claims_staff cannot forge PA/client approval through generic update.
5. IdP token issuer/audience/expiry and membership tests pass.
6. DB not publicly open; app uses least-privilege credential.
7. Storage public access blocked; unauthorized object URL fails.
8. Evidence upload/scan/hash/retrieve/version/retention tests pass.
9. Secrets absent from repo/browser/build/logs.
10. /live and /ready correctly reflect dependency health.
11. Rate-limit/abuse behavior is tested.
12. Logs/alerts show synthetic security/availability events without sensitive payload leakage.
13. Backup/PITR restore succeeds and meets approved RPO/RTO.
14. Deployment rollback restores previous release without claim loss.
15. Schema migration rehearsal succeeds and preserves tenant/data integrity.
16. Clean build is reproducible from lockfile and CI.
17. 10k synthetic-claim/load targets from Step 11 meet approved budgets.
18. Mobile/accessibility tests from Step 12 pass approved criteria.
19. Production configuration has no demo/test credentials/data.
20. Pilot feature flags default to safest state.

## Release decision
Private GitHub source: PASS as development source control.
Public synthetic demo: PASS with caution and isolation.
Staging infrastructure: READY TO IMPLEMENT.
Production infrastructure: NOT YET PROVISIONED.
Real client migration: HOLD.
Real evidence upload: HOLD.
Production pilot: HOLD until Steps 13–15 infrastructure/rehearsal gates pass.

## Step 13 conclusion
The target architecture is now explicit: adpa.claims is the HTTPS user experience; a separately secured API enforces identity, tenant and licensed authority; PostgreSQL is canonical claim data; private object storage is canonical evidence; GitHub/CI produces immutable tested releases; secrets, logs, backups and monitoring are independent managed controls. The current repository contains a useful backend foundation, but production infrastructure must be provisioned and proven in staging before any live client information is moved.

STEP 13 COMPLETE.
