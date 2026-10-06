# ADPA Tier-A Step 5 — Repo-Wide Code Health Review

Audit date: 2026-10-06
Status: COMPLETE — PASS WITH CODE-HEALTH REMEDIATION BACKLOG

Scope: maintainability, duplication, dependency discipline, validation, error handling, state management, date/money helpers, security-sensitive patterns, CI quality gates, production diagnostics and likely regression hotspots. This review records findings; it does not silently refactor the audited application.

## Positive findings
- Code is organized into domain-focused React components rather than one monolithic screen.
- Core reconciliation and compliance helpers have begun moving into lib modules.
- Server SQL uses parameterized queries.
- Server request parsing uses Zod at the primary claim/migration boundaries.
- Production configuration explicitly rejects the development authentication bypass.
- Server suppresses x-powered-by and limits JSON request size.
- CORS is constrained to configured app origin.
- Regulated release/closure checks are server-side concepts, not merely UI buttons.
- GitHub build check performs a frontend production build and syntax checks on selected backend files.
- No dangerouslySetInnerHTML usage was found in the reviewed default branch.
- Evidence hashing, package hashing and optimistic version concepts already exist.

## Findings

### S5-H01 — Dependencies are not reproducibly pinned
Severity: HIGH.
package.json uses "latest" for React, React DOM, Vite and the React Vite plugin. CI also uses npm install rather than npm ci. A future dependency release can therefore change the build without an ADPA code change.
Remediation: commit a reviewed lockfile, pin direct dependencies to controlled versions/ranges, use npm ci in CI, and adopt scheduled dependency updates with review.

### S5-H02 — No automated test command or test suite is part of CI
Severity: HIGH.
Current CI proves that Vite builds and four server files parse. It does not prove business rules, tenant isolation, money calculations, package integrity, release/closure behavior, migrations or component workflows.
Remediation: Step 6 must add unit/integration/E2E tests and make critical suites mandatory in CI.

### S5-H03 — Domain rules are duplicated across components/server
Severity: HIGH.
Payment reconciliation, depreciation, mortgage remaining, supplement terminal statuses, compliance and deadline checks are repeated in WorkQueue, PortfolioDashboard, App dashboard, claimReconciliation and server closure/release routes. Step 2 already demonstrated inconsistent results.
Remediation: centralize domain definitions and use shared fixtures/contract tests; server remains authoritative for production gates.

### S5-H04 — App.jsx owns too many responsibilities
Severity: HIGH maintainability risk.
App.jsx performs navigation, local persistence, draft state, claim mutation, package staleness, package assembly/hash, summary calculations and module orchestration.
Remediation: separate claim repository/state service, package service, routing/navigation shell and domain selectors. Do this incrementally with tests, not a wholesale rewrite.

### S5-H05 — Permissive passthrough schema weakens type/data guarantees
Severity: HIGH.
The server validates a small top-level claim shape and then accepts arbitrary nested claim content via passthrough.
Remediation: introduce versioned schemas for the complete claim graph and explicit migration functions. Reject unknown/invalid production status/value shapes where appropriate.

### S5-H06 — Error handling is insufficient for production operations
Severity: HIGH.
The browser API wrapper collapses non-2xx responses into Error(message), losing structured fields such as currentVersion from a 409. The server logs raw errors with console.error and has no request/correlation ID or structured logging.
Remediation: typed API errors preserving status/body/correlation ID; structured server logging with redaction; user-safe error UI; retry policy only for safe/idempotent operations.

### S5-H07 — localStorage writes have no failure/recovery path
Severity: HIGH for the current prototype data store.
saveWorkspace directly calls localStorage.setItem. Quota/storage exceptions can break persistence without an explicit recovery workflow.
Remediation: catch storage failures, show a blocking data-safety warning, provide verified backup/export and move production persistence to backend.

### S5-M01 — Money arithmetic is repeated Number math
Severity: MEDIUM-HIGH.
Many components convert with Number and compare using 0.01 tolerances. This is fragile as financial logic grows.
Remediation: one money utility/domain type using integer cents or fixed precision, documented rounding, parsing and formatting.

### S5-M02 — Date/deadline helpers are repeated and timezone-sensitive
Severity: MEDIUM-HIGH.
isPast/date comparisons and YYYY-MM-DD conversions occur in multiple files using constructed local Date objects and Date.now.
Remediation: one calendar/date domain service with explicit claim timezone and jurisdiction calendar.

### S5-M03 — Prototype ID generation is non-cryptographic
Severity: MEDIUM.
uid uses Date.now plus Math.random.
Remediation: crypto.randomUUID for browser temporary IDs and server UUIDs for canonical entities.

### S5-M04 — App dashboard has a known depreciation inconsistency
Severity: MEDIUM.
Its depreciation outstanding calculation does not use the canonical disposition-aware reconciliation helper.
Remediation: all dashboards/selectors consume reconciliationForClaim.

### S5-M05 — Work Queue duplicates payment/status logic
Severity: MEDIUM.
paymentMismatch and several terminal-state checks are local implementations rather than canonical selectors.
Remediation: shared domain selectors.

### S5-M06 — Portfolio Dashboard duplicates reconciliation/deadline logic
Severity: MEDIUM.
Cross-claim totals are hand-computed and already disagree with disposition-aware depreciation logic.
Remediation: aggregate canonical per-claim selectors.

### S5-M07 — Build check syntax coverage is incomplete
Severity: MEDIUM.
Only selected server files receive node --check. Auth, audit, storage, DB and other modules are not individually checked, and there is no lint/typecheck.
Remediation: syntax/import smoke test entire server entry graph; add ESLint and, when practical, TypeScript or JSDoc/type checking.

### S5-M08 — No static security/dependency/secret scanning gate is visible in CI
Severity: MEDIUM-HIGH.
Remediation: add dependency review, secret scanning where available, CodeQL/SAST and an SBOM/dependency inventory in later security/supply-chain gates.

### S5-M09 — Health endpoint is shallow
Severity: MEDIUM.
It reports service/storage configuration but does not prove DB connectivity or readiness dependencies.
Remediation: separate liveness from readiness; readiness checks DB and required production dependencies without leaking secrets.

### S5-M10 — API mutation retry/idempotency policy is undefined
Severity: MEDIUM.
Release/closure checks are auditable mutations and migration imports are high-impact; future email/e-sign/payment-like actions will require explicit idempotency semantics.
Remediation: classify endpoints and add idempotency keys where duplicate execution could matter.

### S5-M11 — Large JSON claim documents can become a scaling hotspot
Severity: MEDIUM.
Whole-claim updates and before/after audit snapshots are simple now but can become expensive as evidence metadata, contents and histories grow.
Remediation: establish size budgets and eventually normalize high-churn/high-volume collections while retaining immutable package projections.

### S5-L01 — UI formatting/helpers are duplicated
Severity: LOW.
money, date checks and small Gate/Stat patterns recur.
Remediation: consolidate only when tests protect behavior; avoid premature design-system work.

## Regression hotspots identified
1. Claim package assembly/staleness/hash.
2. Release and closure authority.
3. Payment/coverage/depreciation/mortgage reconciliation.
4. Work Queue exception generation.
5. CA/NV deadline calculations.
6. Representation/compliance gates.
7. Browser-to-backend migration and conflict handling.
8. Tenant/auth/license boundaries.
9. Evidence hashing/storage transition.
10. Closed-claim reopen behavior.

## Recommended code-quality gates
- Reproducible install from lockfile.
- Build.
- Lint.
- Type/schema check.
- Unit tests.
- Server integration tests with disposable PostgreSQL.
- Critical E2E claim journey.
- Dependency/security scan.
- Secret scan.
- No unresolved critical/high test failures.
- Reviewed migration for schema changes.

## Refactoring rule for ADPA
Do not rewrite large working modules simply to make them prettier. First put tests around behavior, then extract one canonical rule at a time, compare old/new results on fixtures, and remove the duplicate only after parity is proven.

## Step 5 conclusion
The repository is a credible working prototype with sensible modularization and several safety-oriented patterns. Its main code-health risk is not messy syntax; it is duplicated business logic combined with a lack of automated regression tests and reproducible dependency control. Those issues are manageable and should be addressed beginning with Step 6 testing before broad refactoring.

STEP 5 COMPLETE.
