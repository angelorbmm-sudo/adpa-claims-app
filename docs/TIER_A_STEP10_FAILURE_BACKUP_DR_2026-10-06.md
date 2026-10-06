# ADPA Tier-A Step 10 — Failure, Backup & Disaster-Recovery Review

Audit date: 2026-10-06
Status: COMPLETE — RECOVERY DESIGN DEFINED; PRODUCTION DR HOLD REMAINS

Scope: database failure, transaction rollback, browser persistence loss, evidence-storage failure, migration failure, deployment failure, dependency outage, authentication outage, data corruption, backup/restore, rollback, observability and business-continuity expectations.

This step is a static failure-mode review and recovery-plan design against the current repository. A real backup restore, failover, chaos or infrastructure recovery drill cannot be truthfully executed until production-like PostgreSQL/object storage/identity infrastructure exists.

## Existing resilience controls that passed review
- Database helper supports explicit BEGIN/COMMIT/ROLLBACK transactions.
- Browser migration import runs as one database transaction.
- Migration preflight is non-destructive.
- Default import mode is skip_existing rather than silent replacement.
- Data cutover runbook explicitly requires backup, reconciliation, restore testing and rollback.
- Optimistic claim version checking exists on normal claim saves.
- DataTransitionCenter requires a pre-migration workspace export and warns it is not encrypted.
- Production data transition remains process-locked.
- Private evidence storage fails closed (503/501) rather than pretending uploads succeeded.
- Demo deployment is manual workflow_dispatch and separated from the private production foundation.
- Existing runbook says to stop writes and preserve both datasets when reconciliation/auth/document/audit integrity fails.

## Recovery objectives to adopt before production
Tier 1 — claim database, authority/approvals, audit and evidence index: proposed RPO <= 15 minutes, RTO <= 4 hours.
Tier 1 — original evidence objects: proposed RPO effectively zero after successful acknowledged upload through versioned/durable object storage; RTO <= 4 hours for ordinary access, with provider disaster recovery documented.
Tier 2 — application/API: proposed RTO <= 2 hours for a bad deployment/instance failure.
Tier 3 — analytics/demo/nonessential AI: RTO <= 24 hours; must never block access to canonical claim records.

These are engineering targets for approval, not guarantees until measured in restore drills.

## Findings

### S10-C01 — No production backup/restore system exists yet
Severity: CRITICAL before live client data.
The repository describes managed PostgreSQL backups/PITR and private object storage, but neither is provisioned/tested here.
Fix: managed encrypted DB backups + PITR, durable versioned object storage, documented backup ownership, retention and restore credentials; perform staging restore before cutover.

### S10-C02 — Evidence recovery cannot be tested because original storage is unimplemented
Severity: CRITICAL before live evidence.
A database restore alone would not restore claim evidence because original bytes are not yet under ADPA custody.
Fix: object versioning/replication as appropriate, inventory manifest, hash reconciliation and restore drill covering DB-to-object relationships.

### S10-H01 — Browser localStorage has no durable recovery guarantee
Severity: HIGH.
loadWorkspace returns null on parse/storage failure and saveWorkspace does not catch quota/storage exceptions. Browser/device loss can destroy the current working copy unless a recent manual export exists.
Fix: production backend authority; until migration, frequent secure exports and blocking persistence-failure UI. Do not treat localStorage as backup.

### S10-H02 — Browser backup export is manual and plaintext
Severity: HIGH.
A manual JSON download is useful for transition but is not an automated encrypted backup service, has no restore validation and can be misplaced.
Fix: controlled encrypted backup mechanism and tested import/restore validation.

### S10-H03 — Health endpoint is liveness, not readiness
Severity: HIGH operational risk.
GET /health can report ok even if PostgreSQL is unreachable; storage status only reports configuration.
Fix: separate /live from protected/appropriate /ready; readiness tests DB connectivity and required dependencies with timeout, without exposing secrets.

### S10-H04 — No graceful shutdown/draining
Severity: HIGH.
The server has no visible SIGTERM/SIGINT shutdown handler to stop accepting traffic and close the PostgreSQL pool during deployment/termination.
Fix: graceful drain, bounded shutdown timeout and deployment termination tests.

### S10-H05 — No retry/backoff/circuit policy for dependency outages
Severity: HIGH.
DB/JWKS/future storage/email/e-sign/AI outages have no explicit resilience policy.
Fix: dependency-specific timeouts; safe bounded retry with jitter only for idempotent operations; circuit/degraded-mode behavior; never blindly retry regulated outbound actions.

### S10-H06 — No centralized observability/alerting
Severity: HIGH.
Errors are console.error only; no correlation/request ID, metrics, traces, alert thresholds or on-call runbook.
Fix: structured redacted logs, request IDs, service metrics, dependency health, error-rate/latency alerts and incident runbooks.

### S10-H07 — No tested deployment rollback mechanism
Severity: HIGH.
GitHub Pages deployment exists for demo, but production API/database deployment has no blue/green/canary/previous-artifact rollback procedure.
Fix: immutable release artifact, previous known-good artifact, backward-compatible DB migration policy and rehearsed rollback.

### S10-H08 — Schema migration strategy is not safely reversible/versioned
Severity: HIGH.
server/migrate.js applies schema.sql directly. There is no numbered migration history, migration lock/version table, expand/contract policy or rollback/forward-fix strategy.
Fix: ordered immutable DB migrations with schema version and production migration runbook; prefer forward-fix and expand/contract for live systems.

### S10-H09 — No corruption detection beyond selected hashes/version fields
Severity: HIGH.
Claim JSON/database rows lack periodic integrity reconciliation; evidence hashes are not yet server/object bound.
Fix: scheduled integrity checks: row counts, tenant invariants, package hashes, object manifests/hashes, audit continuity and financial invariants.

### S10-H10 — Authentication/JWKS outage behavior is not operationally defined
Severity: HIGH.
If the IdP/JWKS endpoint fails, protected work may fail. Security must not be bypassed to restore availability.
Fix: define safe cache/expiry behavior supported by auth library/provider, alerting and read-only/business-continuity procedure. Never enable dev bypass in production.

### S10-M01 — Connection pool has no explicit app-level timeout policy
Severity: MEDIUM-HIGH.
Pool max is set, but connection/query timeout behavior is not explicitly configured in db.js.
Fix: measured connection/query timeouts, cancellation where safe and saturation metrics.

### S10-M02 — Migration is atomic but potentially large/long
Severity: MEDIUM.
Up to 500 claims are imported in one transaction. This gives atomicity but can create long locks/resource pressure.
Fix: benchmark staging; use controlled batches/checkpoints while preserving per-claim idempotency and reconciliation.

### S10-M03 — No degraded read-only mode
Severity: MEDIUM.
During a partial outage, ADPA has no designed way to communicate whether users may safely view cached/last-known data while writes are disabled.
Fix: explicit maintenance/read-only state; never present stale local data as current without a banner/version timestamp.

### S10-M04 — Recovery ownership/escalation is not assigned
Severity: MEDIUM.
Runbook has technical sequence but no named role model.
Fix: assign Incident Lead, Technical Recovery, Data Reconciliation, Security/Privacy, Licensed PA/Operations and Communications roles independent of individual names.

## Failure scenarios and expected behavior

1. Bad frontend release: stop rollout, serve previous immutable artifact, no DB change required.
2. Bad API release: remove unhealthy instances, restore previous compatible artifact, preserve logs/audit.
3. Bad DB migration: stop writes; do not guess/hand-edit production; execute rehearsed forward-fix/rollback strategy and reconcile.
4. PostgreSQL outage: fail readiness, reject unsafe writes, alert, restore/fail over managed DB, reconcile versions/audit.
5. Object-storage outage: claims remain accessible where safe; evidence upload/download clearly unavailable; do not mark evidence stored.
6. Partial evidence upload: no Ready status until object commit + hash verification + metadata transaction complete.
7. IdP/JWKS outage: no authentication bypass; alert and follow documented continuity mode.
8. Browser crash/network loss during edit: unsaved state clearly identified; after backend cutover use versioned server saves/drafts and conflict resolution.
9. Duplicate/replayed mutation: idempotency/version controls prevent double effect for sensitive actions.
10. Corrupted claim JSON: quarantine affected record/version, restore known-good version/backup, preserve corrupted copy for investigation.
11. Deleted evidence under legal hold: production controls must block the deletion; recovery is not a substitute for authorization.
12. Regional/provider outage: invoke documented provider DR; validate tenant, object and audit integrity before reopening writes.
13. Ransomware/account compromise: revoke credentials, freeze writes, preserve logs, restore from protected backups, rotate secrets, verify clean state.
14. Accidental bulk migration replacement: stop writes, use before/after audit + backup to restore/reconcile; privileged migration controls from Step 7 required.
15. AI/vendor outage: core claim system continues; AI/external integration enters unavailable/degraded state and cannot block canonical records.

## Required restore drill
A staging drill must:
- create a known synthetic multi-claim dataset with package hashes, payments, approvals, audit events and evidence objects;
- record manifest/counts/hashes;
- take/identify a recovery point;
- deliberately remove/corrupt the staging environment;
- restore DB and object storage into a clean environment;
- restore identity/config references without copying production secrets;
- run schema migrations safely;
- reconcile claim count, tenant ownership, versions, money totals, package hashes, evidence hashes/object versions and audit history;
- execute Step 6 tests plus tenant/security smoke tests;
- measure actual RPO/RTO;
- document discrepancies and repeat until acceptance passes.

## Production DR acceptance criteria
- Automated encrypted DB backups enabled and monitored.
- PITR window documented and successfully exercised.
- Evidence durability/versioning/restore verified.
- Backup credentials separated from ordinary application write credentials where feasible.
- Restore can be performed from written runbook by authorized staff.
- Measured RPO/RTO meet approved targets.
- Restored environment passes tenant isolation, auth, financial, package/evidence and audit checks.
- Deployment rollback demonstrated.
- Schema forward/rollback strategy demonstrated.
- IdP/storage/DB outage alerts tested.
- At least one tabletop security/data-loss exercise completed.
- Restore drill repeated on material architecture change and periodically thereafter.

## Release decision
Synthetic demo/local use: PASS WITH CAUTION.
Browser workspace as durable backup: FAIL/HOLD.
Live production database: HOLD until managed backup/PITR + restore drill.
Live evidence custody: HOLD until object storage + restore/hash drill.
Production DR readiness: HOLD until measured recovery drill meets approved RPO/RTO.

## Step 10 conclusion
ADPA already has a sensible cutover/rollback philosophy and transactional migration foundation, but disaster recovery is not a document—it must be demonstrated. The next production milestone is to provision production-like infrastructure and prove that a deliberately lost staging system can be restored with the correct claims, evidence, financial state, approvals, package hashes and audit history.

STEP 10 COMPLETE.
