# P0-08 — Backup, Point-in-Time Recovery and Restore Proof

Date: 2026-10-06
Status: RECOVERY RUNBOOK COMPLETE; ACTUAL RESTORE PROOF REQUIRES PROVISIONED STAGING

## Purpose
A backup is not considered usable merely because a provider says backups are enabled. ADPA must prove that claim data, tenant ownership, audit history and evidence can be restored and reconciled after loss.

## Recovery objectives for approval
Tier 1 claim database / authority / audit / evidence index: target RPO <= 15 minutes; RTO <= 4 hours.
Original evidence: target RPO effectively zero after a successful durable/versioned upload acknowledgement; ordinary recovery RTO <= 4 hours.
Application/API bad release: target RTO <= 2 hours.
Nonessential analytics/demo/AI: target RTO <= 24 hours.
These remain targets until measured.

## Required provider controls
PostgreSQL:
- automated encrypted backups;
- point-in-time recovery;
- documented retention window;
- backup/PITR monitoring and alerting;
- restore into a new isolated database;
- backup/admin credentials separated from ordinary app writes where feasible.

Evidence storage:
- private encrypted versioned objects;
- no public access;
- recovery/version retention appropriate to approved policy;
- object inventory containing immutable document id/object version/hash relationship;
- legal hold/retention enforcement;
- restore/version-recovery test.

Configuration:
- infrastructure/configuration reproducible from reviewed documentation/automation;
- secrets restored from secret manager, never copied from source control;
- IdP configuration/recovery documented;
- prior immutable application release available.

## Staging restore drill
1. Build a known synthetic dataset across at least two organizations, including the same legacy claim id in both tenants.
2. Include claims, payments, package hashes, audit events, evidence metadata and stored evidence objects.
3. Record a pre-failure manifest: row counts, tenant/claim/version tuples, financial totals, package hashes, evidence ids/hashes/object versions and audit-event counts.
4. Record the provider recovery point/time.
5. Add a small second wave of synthetic changes to measure PITR loss precisely.
6. Deliberately destroy/corrupt only the disposable staging target according to provider-safe procedure.
7. Restore PostgreSQL into a new clean staging database.
8. Recover/attach evidence object versions into the restored staging environment.
9. Restore application configuration without production credentials.
10. Apply only reviewed forward-compatible schema migrations needed by the restored release.
11. Reconcile the restored state against the pre-failure manifest.
12. Run domain tests, authentication/RBAC/tenant smoke tests and P0 #1 identity tests.
13. Verify every expected evidence object is retrievable and its server-calculated hash/version matches metadata.
14. Verify audit history and organization attribution.
15. Measure actual RPO and RTO.
16. Record discrepancies, fix, destroy the failed drill environment and repeat until PASS.

## Mandatory reconciliation
A restore is FAIL if any unexplained difference exists in:
- organization/claim ownership;
- claim count/version;
- material financial totals;
- package snapshot hashes;
- authority/approval state once P0 #2 is implemented;
- evidence document count;
- original evidence hash/object version;
- audit history/tenant attribution;
- schema version.

## Failure/rollback rules
Never restore directly over the only remaining good environment.
Never guess-merge divergent claims.
Freeze writes when integrity is uncertain.
Preserve the failed/corrupted copy for investigation where safe.
Restore to isolated infrastructure, reconcile, then deliberately cut traffic.
Security incident recovery must include credential revocation/rotation and log preservation.
A database restore alone is not a complete ADPA restore; evidence custody must reconcile too.

## Operational drill record
For each drill record:
- incident/drill ID and date;
- source release Git SHA and schema version;
- selected recovery point;
- start/end timestamps;
- measured RPO/RTO;
- DB backup identifier;
- evidence version/inventory reference;
- restored counts/hashes;
- failed checks;
- corrective actions;
- technical recovery sign-off;
- security/privacy sign-off;
- licensed operations sign-off before live claim work resumes.

## Frequency
Perform before first live production cutover; after material DB/storage/identity architecture changes; after a material recovery incident; and periodically on an approved operating schedule.

## Current repository protections already supporting recovery
- transactional DB helper;
- migration preflight and skip-existing default;
- optimistic concurrency;
- P0 #3 server-authoritative direction;
- P0 #4 fail-closed evidence custody boundary;
- P0 #7 DB readiness and graceful shutdown;
- production cutover runbook already requires backup/reconciliation/rollback.

## Safety-control event
An attempt to add an automated database recovery-manifest script was blocked by repository safety controls. The block was respected. No workaround or database-access script was committed.

## Current decision
Recovery architecture/runbook: PASS.
RPO/RTO targets: DEFINED, NOT MEASURED.
Managed PostgreSQL backups/PITR: NOT PROVISIONED.
Evidence versioned recovery: NOT PROVISIONED.
Actual staging restore: NOT TESTED.
Production disaster-recovery P0: HOLD until a staging restore drill passes.

P0-08 DESIGN/RUNBOOK COMPLETE. Actual P0-08 production proof cannot be truthfully completed until José provisions staging and provider backups/object storage exist.
