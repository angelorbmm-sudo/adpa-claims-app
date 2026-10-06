# Phase 7 — PA Command Center

Date: 2026-10-06
Status: DESIGN/IMPLEMENTATION SPEC COMPLETE; CODE WRITE BLOCKED BY REPOSITORY SAFETY CONTROL

## Goal
Turn Portfolio Command and Work Queue into the operating screen that tells a public adjuster what needs attention now, why, where money is stuck and which claim requires licensed review.

## Command-center model
For every active claim, compute a non-authoritative operational command summary from existing ADPA data:
- workflow recommended next step;
- workflow stage status;
- licensed-PA review count;
- critical-event count;
- compliance HOLD;
- overdue carrier clocks;
- open issues;
- overdue supplements;
- overdue recovery;
- recoverable depreciation outstanding;
- lender-held funds;
- requested and received totals.

## Priority
Critical: unresolved critical event, overdue verified carrier clock, or compliance HOLD.
High: licensed-PA review needed, overdue recovery/supplement, or several workflow attention states.
Normal: ordinary open workflow with no critical/high condition.

Priority is operational triage only. It must never create a legal conclusion, coverage decision, settlement authority or bad-faith determination.

## Portfolio screen
Top cards:
- Active claims
- Claims needing PA review
- Critical claims
- Late carrier clocks
- Open issues
- Requested
- Received
- Recoverable depreciation outstanding
- Lender-held funds

Claim table:
Priority | Claim | State | Recommended next action | PA review | Critical events | Late clocks | Open issues | Requested | Received | Open

Default order: highest operational priority first.

## Work Queue integration
System-generated queue items should remain explainable and link to the exact module. The queue should add a concise workflow-intelligence item when a claim is Blocked/Needs Attention or Needs PA Review, while avoiding duplicate alerts already represented by a more specific system exception.

## Mobile
On iPhone, summary cards collapse to one column and claim rows/cards must preserve the three most important facts:
1 priority;
2 next action;
3 reason/amount/deadline.

## Synthetic acceptance
The Phase 6 denial claim should rank high/critical because of the unresolved critical event.
The mortgage fixture should surface lender-held funds.
The water fixture should surface depreciation and unresolved supplement/evidence/estimate work.
The contents-heavy fixture should surface unfinished valuation review.
The Nevada fixture must retain NV jurisdiction and must not inherit CA conclusions.

## Intended code
A small pure selector module (paCommand.js) should aggregate existing workflowIntelligence, reconciliation and compliance state. PortfolioDashboard should consume the selector. Tests should prove sorting/metrics and fixture-specific alerts.

## Safety boundary
The attempted repository write for this operational selector was blocked by the repository safety control. No workaround was attempted. Existing code was not weakened.

PHASE 7 DESIGN: COMPLETE.
PHASE 7 CODE: BLOCKED.
REAL CLIENT PRODUCTION: HOLD.
