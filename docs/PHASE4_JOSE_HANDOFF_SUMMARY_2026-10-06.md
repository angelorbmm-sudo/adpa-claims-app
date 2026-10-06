# Phase 4 — José Handoff Summary

Date: 2026-10-06
Status: COMPLETE

## Goal
Move ADPA from private development to isolated synthetic staging without redesigning the application.

## Preserve
Keep the existing React/Vite + Express/PostgreSQL architecture, guided claim workflow, specialist claim modules, synthetic test fixtures, financial invariants, tenant-safe identity work, evidence custody boundary, audit trail and production-readiness gates.

## Four remaining engineering blockers
1. P0-02: Move Licensed PA Approval and Client Authorization out of generic editable claim JSON into protected server-owned authority records tied to tenant, claim and current package hash. Generic claims:write must never create privileged authority.
2. P0-05: Require explicit active organization context and verify the authenticated user's membership in that exact organization. Do not select an arbitrary membership.
3. P0-06: Resolve/review exact npm dependencies in a trusted runtime, generate a genuine package-lock.json, switch CI to npm ci and run clean build/tests.
4. P0-10: Make regulatory/compliance authority server-owned and effective-dated with primary-source provenance, verified calendar semantics and REVIEW/HOLD for uncertain applicability.

## José staging work
Provision a synthetic-only staging environment with web/API hosting, managed PostgreSQL with TLS/backups/PITR, private versioned object storage, OIDC/JWT identity, secret management, HTTPS, logs/metrics/alerts and least-privilege deployment credentials.

No real client data is required or permitted for this milestone.

## Evidence requirements
Evidence must be tenant/claim authorized, private, server-keyed, hash/size/type verified, quarantined before Ready, scanned before Ready, versioned, auditable and recoverable. Do not store raw evidence bytes in generic claim JSON.

## Migration order
Backup staging; tenant-safe identity migration; protected authority migration; org/RBAC changes; evidence metadata changes; regulatory schema if used; seed synthetic users/orgs/claims; reconcile; test rollback/restore.

## Synthetic acceptance dataset
Use the Phase 2 California fire master fixture plus at least two organizations and scenarios for water/partial payment/depreciation, stale package, late clock, supplement, closed/reopened claim, Nevada, mortgage/loss draft, heavy contents, duplicate-looking payment, waived depreciation and the same legacy claim id in both organizations.

## First staging acceptance sequence
Deploy exact reviewed Git SHA; verify health/readiness; authenticate every role; prove explicit org isolation; load/edit/reload the synthetic fire claim; test optimistic concurrency; test private evidence/quarantine; reconcile money/depreciation/mortgage; assemble package/hash; prove staff/reviewer cannot forge PA/client authority; exercise legitimate protected authority; run release/closure checks; test same-id cross-tenant isolation; restore backup; run cutover rehearsal; run staging security validation; remediate; then hold Production Readiness Review #2.

## Hard NO-GO
Tenant crossover, authentication bypass, forged licensed/client authority, public evidence, secret leakage, unexplained financial differences, lost/duplicated claims, package hash corruption, evidence-original replacement, silent stale-write overwrite or failed restore.

## Ownership
José: staging/cloud, DB, private storage, IdP, secrets, deploy/monitoring/backups and permitted security-control implementation.
Angelo: Reviewer authority, client-authorization business evidence, licensed PA/compliance judgment, pilot scope and final business go/no-go.
Susie/ADPA build: workflow/modules, fixtures/tests, reconciliation, documentation, code review and prepared staging acceptance checks.

## First successful staging milestone
Angelo can open the synthetic fire claim, work through the guided flow, save/reload through the authoritative API, use private synthetic evidence, reconcile finances, assemble a package, exercise protected authority and see correct closure blockers while tenant/RBAC isolation and backup/restore are proven.

This does not authorize real-client production.

PHASE 4 HANDOFF: COMPLETE.
REAL-CLIENT PRODUCTION: HOLD.
