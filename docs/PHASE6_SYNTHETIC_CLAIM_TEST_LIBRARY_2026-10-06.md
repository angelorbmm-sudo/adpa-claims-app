# Phase 6 — Synthetic Claim Test Library

Date: 2026-10-06
Status: CODE COMPLETE; REMOTE CI/BROWSER VALIDATION PENDING

## Goal
Prove ADPA workflow intelligence against materially different property-claim patterns rather than optimizing only for the Phase 2 fire claim.

## Added synthetic master scenarios

### 1. California Water / Partial Payment / Depreciation
Tests mitigation/evidence review, estimate review, partial dwelling/contents payments, open supplement and recoverable depreciation.

### 2. California Denial / Causation Dispute
Tests zero carrier payment, coverage/causation dispute, denial evidence and an open critical event requiring licensed review. The fixture does not make an automatic legal/bad-faith conclusion.

### 3. Contents-Heavy Smoke Claim
Contains 2,000 synthetic contents items. 1,850 are reviewed and 150 intentionally remain for review. Tests scale/cognitive load, LKQ/valuation progress and depreciation follow-up.

### 4. Mortgage / Loss-Draft Claim
Tests a large dwelling payment controlled by a synthetic mortgage servicer, initial release, partial draw and $115,000 remaining lender-held funds.

### 5. Nevada Wind/Rain Claim
Tests jurisdiction separation, Nevada deadline-rule lookup, scope variance and an intentionally unresolved verified-due-date/applicability workflow. It does not reuse California compliance assumptions.

All fixtures are explicitly synthetic and contain no real client information.

## Demo integration
All five Phase 6 claims are loaded into Demo Mode immediately after the Phase 2 California fire master claim. Existing generic demo claims remain available.

## Regression tests
Added checks for:
- five unique synthetic patterns and synthetic-data labeling;
- water evidence/estimate work + depreciation;
- denial open issue + critical event;
- 2,000-item contents fixture and unresolved review state;
- exact $115,000 lender-held mortgage balance;
- Nevada jurisdiction and NV-specific rule registry.

## Product findings
ADPA must support claims whose primary operational bottleneck differs:
- evidence/estimate completion;
- licensed dispute review;
- high-volume contents valuation;
- lender-controlled recovery;
- jurisdiction-specific compliance.

This library should remain a permanent regression asset as the AI Preparation, Work Queue, Portfolio Command, package and staging layers evolve.

## Boundaries
Fixtures validate domain behavior only after tests/runtime execute. They do not prove production compliance, real evidence custody, protected authority, infrastructure, browser performance at 2,000 items or staging security.

PHASE 6 CODE: COMPLETE.
SYNTHETIC TEST LIBRARY: COMPLETE.
REAL CLIENT PRODUCTION: HOLD.
