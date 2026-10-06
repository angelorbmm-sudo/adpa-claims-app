# ADPA Tier-A Readiness — Step 2 End-to-End Claim Journey Audit

**Audit date:** 2026-10-06  
**Frozen application baseline:** `e6aadaf4177202eb3bc3d1a2d2ebd494247390d6`  
**Scope:** Synthetic claim journeys only. No real client data was used. This document records audit findings; it does not alter the frozen baseline application behavior.

## Method
The existing claim model, connected modules, workflow gates, reconciliation logic, routing, release controls, deadline engine, evidence manifest, mortgage/depreciation controls and closure logic were traced through representative synthetic claim journeys. Negative-path conditions were deliberately introduced to determine whether ADPA blocks, warns, routes or permits the next action.

## Synthetic journeys exercised

### J1 — California residential fire / major-loss claim
Path: Intake → CA representation/compliance → policy → evidence → Coverage A/B/C/D/CODE → contents → ALE → estimate variance → carrier communications/deadlines → payment ledger → mortgage loss draft → depreciation → supplement/issues → package → approvals → release → final reconciliation → closure → reopen.

**Result:** Core journey is represented end-to-end. Material authority, stale-package, open-issue, depreciation, mortgage, late-clock and closure controls exist. Several cross-module consistency gaps were found below.

### J2 — California water loss / partial payment / recoverable depreciation
Path emphasizes mitigation/evidence, dwelling estimate variance, partial carrier payment, replacement proof, recoverable depreciation, supplement and final reconciliation.

**Result:** Workflow is supported. Recovery disposition is correctly capable of distinguishing recovered from documented unrecoverable/waived amounts. Dashboard and final closure do not currently display that disposition consistently.

### J3 — Storm/tree loss with denial or causation dispute
Path emphasizes causation evidence, issue file, carrier position vs ADPA position, escalation, critical-event routing, supplement/dispute and licensed review.

**Result:** ADPA correctly routes material/specialist issues away from routine automation. It does not automatically declare bad faith or a legal conclusion. Source linking remains too free-form for Tier-A evidence traceability.

### J4 — Nevada property claim
Path: NV intake → jurisdiction → representation/compliance → NV deadline clocks → evidence → issue/review → package/approval/closure.

**Result:** State separation exists and NV timing rules are separately modeled. Nevada contract/authority requirements and holiday/effective-date applicability still require authoritative verification before production reliance.

### J5 — Mortgage-controlled rebuild
Path: insurance proceeds → servicer → held funds → endorsement → draw → inspection → lender conditions → releases → final lender reconciliation.

**Result:** Operational workflow is represented. The meaning of `heldBalance` must be made unambiguous because current formulas treat it as the original controlled amount and subtract releases from it.

### J6 — Closed claim receives new substantive information
Path: final package → PA/client approval → closure → substantive claim change → stale package → reopen.

**Result:** Strong control. Substantive changes stale the latest package; Work Queue identifies a changed closed claim and requires reasoned reopen; routing returns reopened work to B1.

## Controls that passed the journey audit
- Jurisdiction is explicitly stored and CA/NV rules are separated.
- New claims begin with compliance and policy holds rather than an assumed-ready state.
- Representation, compliance, policy/evidence, issue, critical-event and licensed-review concepts are represented.
- Evidence records use browser SHA-256 and duplicate detection.
- AI preparation is shadow/deterministic and expressly non-autonomous.
- Material issue positions can be held for licensed PA review.
- Carrier communications can create state-aware deadline clocks.
- Deadline notices are drafts; external sending is separate.
- Payment/coverage reconciliation exists.
- Recoverable depreciation is tracked separately from nonrecoverable/waived disposition.
- Mortgage draws, inspections, conditions and releases are represented.
- Claim packages are versioned and substantive claim changes can stale a package.
- Approvals are bound to package hash.
- Closed/Audit cannot be manually selected as a shortcut.
- Closure blocks on compliance hold, stale/missing package, ledger-vs-coverage mismatch, outstanding depreciation, lender-held proceeds, open issues, open supplements, recovery items, critical events and overdue clocks.
- Reopening requires a reason and creates workflow history.
- Backend design includes organization isolation, role permissions, jurisdiction-specific PA-license verification and optimistic concurrency.

## Gap register

### STEP2-H01 — Final package evidence manifest does not bind the evidence SHA-256
**Severity:** High  
The package snapshot's document manifest contains ID, name, category, size and createdAt, but omits SHA-256, source, coverage tag and review status. A Tier-A final package should be able to prove exactly which evidence bytes/metadata supported the package.

**Recommendation:** Include evidence SHA-256 and material provenance/review metadata in the immutable package snapshot and package hash.

### STEP2-H02 — Final package identity/context is incomplete
**Severity:** High  
The package snapshot includes claim ID, insured, property, carrier and claim number but omits date of loss and cause of loss; valuation source/reviewer are also not preserved alongside valuation.

**Recommendation:** Add dateOfLoss, causeOfLoss, valuationSource, valuationReviewer and other material claim-context fields to the snapshot.

### STEP2-H03 — Closure can pass despite issued/unreceived, unallocated or possible duplicate payments
**Severity:** High  
Final Financial Reconciliation correctly flags these exceptions, but canonical `closureBlockers()` only requires received-ledger totals to reconcile to coverage received totals. Therefore the financial screen can show HOLD while the closure engine can still become ready.

**Recommendation:** Make the canonical closure gate include issued/unreceived payments, missing allocation/explanation and unresolved possible-duplicate review.

### STEP2-H04 — Browser and server representation/release gates are not identical
**Severity:** High  
Browser `complianceStatus()` can treat an executed compliance contract record as sufficient representation evidence, while the server release check additionally requires representation template verification and signed date. This can produce a browser “ready” result that a production server would reject.

**Recommendation:** One canonical server-owned authority rule set; frontend should display server gate results rather than independently reimplement material authorization.

### STEP2-H05 — Original evidence bytes are not persisted
**Severity:** High / known production boundary  
Evidence metadata and hash are stored in the browser record, but original files remain “Local selection only — secure object storage pending.”

**Recommendation:** Private object storage, signed access, malware/type validation, immutable original retention and restore testing before live production data.

### STEP2-H06 — Frontend remains localStorage system of record
**Severity:** High / known production boundary  
The production backend foundation exists but ordinary claim edits still persist to browser localStorage. Normal browser edits therefore do not receive backend role enforcement, optimistic concurrency or server audit events.

**Recommendation:** Complete frontend-to-backend migration only after staging/security/backup gates pass.

### STEP2-M01 — Dashboard depreciation amount conflicts with disposition logic
**Severity:** Medium  
The dashboard computes recoverable minus released without excluding “Documented unrecoverable/waived,” while canonical closure logic excludes that documented disposition. A claim can therefore be correctly closable while the dashboard still shows an outstanding amount.

**Recommendation:** Use the canonical reconciliation function everywhere.

### STEP2-M02 — Work Queue and closure disagree on Paid supplements
**Severity:** Medium  
Canonical reconciliation treats Paid as terminal. Work Queue's supplement-open logic currently recognizes Resolved/Closed/Approved but not Paid.

**Recommendation:** Centralize supplement terminal-status logic.

### STEP2-M03 — Mortgage held-balance semantics are ambiguous
**Severity:** Medium  
The formula subtracts initial release and draw releases from `heldBalance`. The UI label “Funds held by servicer” could be interpreted as a current remaining balance, which would cause releases to be subtracted twice.

**Recommendation:** Rename/model fields explicitly as originalControlledProceeds, releases, and calculatedRemainingHeld; do not allow ambiguous double-entry semantics.

### STEP2-M04 — Evidence-to-issue references remain free-form
**Severity:** Medium  
Issue files can carry policy/evidence references, but Tier-A traceability needs stable structured IDs/citations and direct navigation to the exact evidence/policy/estimate/payment line.

**Recommendation:** Replace/augment free text with typed reference objects and immutable IDs.

### STEP2-M05 — Deadline calendar is not production-complete
**Severity:** Medium / known  
CA holiday/final-day treatment and NV holiday-aware working-day calculations are not implemented; effectiveFrom/effectiveThrough values are null.

**Recommendation:** Complete authoritative legal verification and versioned calendar/applicability engine before production reliance.

### STEP2-M06 — Ordinary browser workflow changes lack immutable audit events
**Severity:** Medium / known transition issue  
Routing/closure and some module histories exist, but browser localStorage is not an immutable enterprise audit log.

**Recommendation:** On backend cutover, record material mutations server-side with actor, organization, timestamp, before/after, source and version.

### STEP2-M07 — Closure and release use overlapping but different approval concepts
**Severity:** Medium  
Release requires Operational Review + Licensed PA Approval + Client Authorization. Closure requires Licensed PA Approval + Client Authorization, but not Operational Review. This may be intentional, but it needs a documented policy decision so the difference is not accidental.

**Recommendation:** Decide and document the required approval matrix by action type.

### STEP2-L01 — Manual routing remains intentionally possible
**Severity:** Low/controlled  
Users may manually assign B0-B6. CLOSED is protected. This is useful operationally but should become role/audit controlled on the backend.

## Negative-path results
1. Missing carrier/claim number/date of loss → Work Queue flags incomplete intake.
2. Missing representation/compliance/policy → B0/compliance HOLD.
3. Missing policy/evidence → B1 evidence build.
4. Open unapproved issue → B3 licensed approval.
5. Material dispute → B5 true PA adjustment.
6. EUO/SIU/litigation/counsel/critical trigger → B6 specialist/legal/critical.
7. Late carrier clock → critical follow-up/closure blocker.
8. Payment ledger mismatch → financial exception/closure blocker.
9. Outstanding recoverable depreciation → closure blocker.
10. Lender-held proceeds → closure blocker.
11. Open issue/supplement/recovery/critical event → closure blocker.
12. Claim changes after package → package becomes stale.
13. Closed claim changes → Work Queue requires reopen.
14. Manual CLOSED shortcut → blocked unless closure audit already completed.
15. Reopen without reason → blocked.

## Step 2 conclusion
**Status: COMPLETE — PASS WITH REMEDIATION BACKLOG.**

ADPA has a coherent end-to-end claim operating model. No missing top-level stage was found that makes the claim journey impossible to represent. The audit did identify seven High/known-production-boundary findings, seven Medium findings and one Low/controlled finding. These should feed the Tier-A backlog and later gates rather than be silently patched during the audit.

The strongest next move is Step 3: authoritative California/Nevada compliance verification. That review should resolve the legal/rule assumptions before deeper architecture and code remediation, because those verified rules will define several tests and server-side gates.
