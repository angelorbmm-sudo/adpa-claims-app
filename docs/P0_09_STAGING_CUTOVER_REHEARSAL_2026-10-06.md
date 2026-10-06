# P0-09 — Staging Cutover Rehearsal Execution Gate

Date: 2026-10-06
Status: REHEARSAL PACKAGE COMPLETE; EXECUTION BLOCKED UNTIL STAGING EXISTS

## Objective
Execute—not merely describe—the ADPA cutover rehearsal before any real-client production migration. The rehearsal must prove that synthetic/deidentified browser-era data can move to the authoritative backend without tenant, financial, evidence, package, authority or audit corruption and can be rolled back/restored.

## Execution prerequisites
P0-09 may not be marked runtime PASS until:
- isolated staging web/API/PostgreSQL/storage/IdP exist;
- P0-01 tenant-safe identity migration is applied/proven;
- P0-02 server-owned privileged authority is implemented;
- P0-05 explicit organization selection is implemented;
- P0-06 reviewed lockfile + npm ci reproducible build passes;
- P0-07 staging infrastructure acceptance passes;
- P0-08 managed backup/PITR and restore capability exist;
- private evidence storage adapter + quarantine verification are operational;
- exact release candidate Git SHA is selected.

## Rehearsal dataset
At least 12 synthetic/deidentified claims across two organizations:
1 CA fire major loss;
2 CA water/partial payment/depreciation;
3 stale package;
4 late carrier clock;
5 open supplement;
6 closed then reopened;
7 Nevada claim;
8 mortgage/loss-draft claim;
9 heavy contents claim (~2,000 items);
10 duplicate-looking payment;
11 documented unrecoverable/waived depreciation;
12 deliberate same legacy claim id in both organizations.
Include policy/photo/receipt/video evidence, duplicate hash, redacted derivative and quarantine/type-mismatch cases when storage is active.

## Execution sequence
A. Freeze exact release candidate and record Git SHA/dependency lock/schema versions.
B. Confirm staging is isolated and synthetic-only; verify backups/recovery point.
C. Load the known source dataset and create pre-cutover manifest.
D. Run migration preflight; unresolved identity/jurisdiction/collision = STOP.
E. Import with skip_existing first; replacement is not default.
F. Reconcile claim counts, tenant ownership, versions, money totals, package hashes, evidence ids/hashes/object versions and audit history.
G. Run tenant/RBAC/license/concurrency/release/closure/evidence negative tests.
H. Exercise duplicate, interrupted upload, stale-version save, stale package, invalid jurisdiction license and cross-tenant id cases.
I. Deliberately perform rollback/restore into isolated staging and repeat reconciliation.
J. Record measured duration/RPO/RTO, discrepancies, logs and sign-offs.

## Hard fail conditions
Any unexplained dollar difference.
Any tenant crossover or ambiguous organization.
Any lost/duplicated claim.
Any package hash mismatch.
Any missing or altered original evidence hash/version.
Any privileged approval that can be forged from generic claim JSON.
Any audit history/tenant mismatch.
Any stale write that overwrites a newer version.
Any restore that cannot reproduce the accepted manifest.
Any production credential/data discovered in staging.

## Sign-off record
Technical recovery/infra owner.
Security/privacy reviewer.
Licensed PA operations owner.
Product/business owner.
Exact RC Git SHA and lockfile hash.
Schema/migration versions.
Backup/recovery identifiers.
Manifest results and exception list.
Decision: PASS / FAIL / RETEST REQUIRED.

## Current execution result
Environment discovery: FAIL/PENDING — no production-like staging environment has been provisioned.
Dataset specification: PASS.
Execution procedure: PASS.
Hard-fail criteria: PASS.
Rollback/restore procedure: PASS.
Actual migration run: NOT TESTED.
Actual evidence run: NOT TESTED.
Actual RBAC/tenant negative tests: NOT TESTED.
Actual restore: NOT TESTED.
Measured RPO/RTO: NOT TESTED.
Final staging sign-off: BLOCKED.

## Decision
P0-09 PREPARATION: COMPLETE.
P0-09 RUNTIME EXECUTION: BLOCKED BY ABSENT STAGING AND upstream P0 dependencies.
Production cutover remains NO-GO.

This is an intentional hard gate. Repository code or documentation cannot substitute for executing the rehearsal against real staging infrastructure.
