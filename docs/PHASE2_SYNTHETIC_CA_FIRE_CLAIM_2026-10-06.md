# Phase 2 — Synthetic California Residential Fire Claim

Date: 2026-10-06
Status: SYNTHETIC MASTER CLAIM + REGRESSION FIXTURE COMPLETE; LIVE BROWSER/CI EXECUTION PENDING

## Purpose
Exercise Phase 1's integrated ADPA workflow using one realistic but entirely synthetic California residential fire claim. No real insured, carrier, address, claim number, evidence or financial record is used.

## Fixture
ID: phase2-ca-fire-001
Insured: Phase 2 Fire Test Household
Carrier: Synthetic Mutual Insurance
Cause: Residential fire / smoke
Jurisdiction: California

The fixture deliberately touches the major ADPA domains:
- intake/jurisdiction;
- representation/compliance;
- policy/declarations and code endorsement;
- Coverage A/B/C/D + Ordinance/Law;
- evidence/document metadata;
- contents/LKQ;
- dwelling estimate comparison;
- ALE;
- payment ledger;
- issues/negotiation;
- supplement;
- recoverable depreciation;
- mortgage/loss draft;
- communications/deadline;
- routing;
- recovery.

## Financial scenario
Requested: A 340,000; B 18,000; C 125,000; D 36,000; CODE 22,000.
Received/ledger: A 210,000; B 15,000; C 80,000; D 24,000; CODE 0.
Received coverage total and payment-ledger total both equal 329,000, intentionally proving that accounting can reconcile while the claim still has substantive open work.

The fixture intentionally retains:
- open dwelling/code issues;
- open dwelling supplement;
- recoverable depreciation outstanding;
- mortgage/loss-draft funds held;
- recovery follow-ups;
- no final current package.

Therefore ADPA must NOT treat the claim as closable merely because received payments reconcile.

## Automated checks added
1 fixture exercises major claim domains;
2 received payment ledger exactly reconciles to coverage received (329,000);
3 closure correctly remains blocked for package, depreciation, mortgage, issues, supplement and recovery.

## Demo integration
The Phase 2 master claim is loaded first in demoWorkspace when VITE_DEMO_MODE=true. The existing demo banner remains TEST DATA ONLY / DO NOT ENTER REAL CLIENT INFORMATION.

## Walkthrough result by stage
1 Intake — populated.
2 Policy — populated/reviewed synthetic policy data.
3 Evidence — populated with synthetic metadata.
4 Damages & Estimates — dwelling comparison + contents present.
5 Payments — received ledger reconciles exactly.
6 Issues & Supplements — intentionally open.
7 Claim Package — intentionally not assembled yet; workflow should direct here only after open claim work is resolved/appropriate.
8 PA / Client Authority — intentionally not granted.
9 Recovery — intentionally open.
10 Close & Audit — correctly blocked.

## Findings from the integration pass
- A financially reconciled claim can and should remain operationally open.
- The guided workflow must not equate 'stage has records' with 'stage is resolved'; stage completion is navigation assistance only.
- Package/authority/closure must remain hard gates.
- Mortgage and depreciation need continued visibility before closure.
- Synthetic fixtures are valuable regression assets and should expand to water, denial/dispute and Nevada next.

## Boundaries
This fixture does not prove browser rendering, CI success, API persistence, protected authority, secure evidence bytes, or production compliance. Those require the already-defined runtime/staging gates.

PHASE 2 SYNTHETIC FIRE CLAIM BUILD: COMPLETE.
PHASE 2 STATIC/REGRESSION INTEGRATION: COMPLETE.
RUNTIME/CI VALIDATION: PENDING.
REAL CLIENT DATA: HOLD.
