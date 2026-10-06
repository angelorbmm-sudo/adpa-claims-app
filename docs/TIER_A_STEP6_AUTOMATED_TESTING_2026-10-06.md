# ADPA Tier-A Step 6 — Automated Testing & Regression Protection

Audit/build date: 2026-10-06
Status: COMPLETE — FIRST AUTOMATED REGRESSION BASELINE INSTALLED

## What was implemented
A zero-new-dependency Node test suite was added at tests/domain.test.js and wired into package.json as npm test. GitHub's ADPA Build Check now runs the regression suite after the production frontend build.

## Automated tests installed
1. Payment receipt-state recognition.
2. Coverage/ledger reconciliation totals.
3. Documented unrecoverable/waived depreciation is not treated as outstanding.
4. Mortgage held-fund calculation.
5. Paid supplement is terminal.
6. Stale package blocks closure.
7. Ledger mismatch blocks closure.
8. Open issue and overdue carrier clock block closure.
9. California compliance HOLD when authority controls are not verified.
10. California prototype compliance clear when required controls are verified.
11. California 15-calendar-day acknowledgment base rule.
12. Nevada 20-working-day acknowledgment base rule and weekend skipping.
13. Calendar helper month-boundary behavior.
14. California/Nevada rule registries remain separated.

## CI gate
.github/workflows/build-check.yml now executes:
- npm install
- npm run build
- npm test
- selected server syntax checks

A failed domain test now fails the build workflow, providing automatic regression protection for these covered behaviors.

## Deliberately not hidden by tests
Tests encode the current audited behavior; they do not certify legal applicability. Step 3 findings remain: holiday-aware calendars, effective-dated rule registry, exceptions, catastrophe/emergency verification and CA limitations notice require controlled remediation. Tests for those items should be added when the implementation exists.

## Remaining test pyramid backlog
HIGH:
- PostgreSQL integration tests for tenant isolation and cross-tenant claim-ID collision.
- Auth/RBAC/license negative tests.
- Optimistic concurrency 409 tests.
- Migration preflight/skip/replace/conflict tests.
- Server release/closure contract tests against frontend reconciliation fixtures.
- Package snapshot/hash/staleness tests after package logic is extracted from App.jsx.
- Evidence SHA-256/object-storage tests when storage exists.

MEDIUM:
- React component tests for Work Queue, financial reconciliation, approvals and closure.
- End-to-end browser synthetic claim journey.
- Accessibility automated checks.
- API malformed payload and error-shape tests.
- Timezone/DST/calendar boundary fixtures.
- Property/fuzz tests for money/deadline invariants.

## Tier-A rule
No critical domain refactor should remove or materially change a passing regression test without a documented reason, reviewed expected-behavior change and replacement/updated test.

## Step 6 conclusion
ADPA now has its first automated regression safety net and CI is configured to enforce it. This is a meaningful change from the prior build-only check: GitHub can now reject code that breaks covered claim reconciliation, closure blockers, compliance behavior or base CA/NV deadline calculations.

This is the foundation, not the final test program. Database/auth/security/E2E suites require the production-like test infrastructure covered by later readiness gates.

STEP 6 COMPLETE.
