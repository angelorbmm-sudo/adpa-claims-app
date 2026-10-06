# P0-11 — Production Financial Invariants

Date: 2026-10-06
Status: CODE REMEDIATION COMPLETE; CI/STAGING PROOF PENDING

## Implemented
- Added server/financial.js as the canonical server financial invariant service.
- Currency is converted to integer cents with strict two-decimal validation rather than relying on floating-point tolerance.
- Closure now independently evaluates server financial invariants from the persisted claim record.
- Both issued and received ledger totals must reconcile to coverage totals.
- Issued-but-unreceived payments block financial readiness.
- Unallocated/unexplained payments block readiness.
- Possible duplicate payment pairs block readiness and are never automatically deleted.
- Recoverable depreciation is tracked in exact cents; documented unrecoverable/waived amounts do not remain outstanding.
- Mortgage/loss-draft held funds account for initial release and subsequent draws.
- Closure response includes exact-cent financial values plus display-dollar values.
- Added nine server financial negative/regression tests.
- Added server financial module syntax validation to CI.

## Safety rules
Financial equality does not determine policy entitlement.
Possible duplicates require human reconciliation.
No automatic deletion/merging of payments.
No automatic waiver of depreciation.
Mortgage-controlled proceeds remain distinct from proceeds actually released.
Browser display totals do not override server closure calculation.

## Tests added
Exact-cent parsing; balanced issued/received ledger; one-cent mismatch; issued/unreceived; unallocated payment; duplicate detection; waived depreciation; partial depreciation release; mortgage draws/held balance.

## Remaining staging proof
Run full npm test/build from reviewed lockfile.
Exercise API closure-check with persisted synthetic claims.
Verify malformed >2-decimal amounts fail safely rather than becoming authoritative.
Test concurrency around simultaneous payment edits.
Reconcile high-volume/heavy claim fixtures.
Compare browser display to server result.
Confirm tenant isolation and audit event output.
Test DB persistence/restore preserves exact source values.

## Known dependency
P0-02 still blocks final privileged closure authority because approvals/client authority remain in generic claim JSON. P0-11 fixes the financial calculation authority; it does not bypass P0-02.

## Decision
Exact-cent server calculation: PASS (code).
Issued/received reconciliation: PASS (code).
Depreciation/mortgage controls: PASS (code).
Duplicate/unallocated/unreceived gates: PASS (code).
Automated test coverage: ADDED; remote CI result not asserted here.
Production runtime: HOLD pending trusted build + staging + P0-02.

P0-11 CODE REMEDIATION COMPLETE.
