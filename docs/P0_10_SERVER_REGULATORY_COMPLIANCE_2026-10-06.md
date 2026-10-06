# P0-10 — Server-Authoritative Regulatory / Compliance Rules

Date: 2026-10-06
Status: PRIMARY-SOURCE REVIEW COMPLETE; SERVER RULE IMPLEMENTATION BLOCKED BY REPOSITORY SAFETY CONTROL

## Objective
Regulated release, closure, deadline and compliance decisions must not depend on browser-editable claim JSON or duplicated frontend logic. The server must own effective-dated, source-provenanced rules and fail safely when applicability is unresolved.

## Primary-source re-verification
California Department of Insurance Fair Claims Settlement Practices materials confirm the operational baseline currently represented in ADPA: claimant communication / notice handling at 15 calendar days, proof-of-claim acceptance or denial at 40 calendar days, continuing-investigation notices at 30 calendar days, and payment after acceptance generally within 30 calendar days, subject to the regulation's exceptions.

Nevada remains governed by the Nevada statutes/administrative-code framework already identified in the Tier-A regulatory audit. ADPA must use the current official Nevada code at implementation/reverification time; no California rule may be inferred into Nevada.

## Required server model
A canonical regulatory registry must include:
- jurisdiction;
- rule key and claim stage;
- requirement;
- exact authority citation;
- primary source;
- effective-from/effective-through;
- trigger event;
- time quantity and calendar type;
- exceptions/applicability conditions;
- emergency/catastrophe authority where applicable;
- last verified date;
- machine status: VERIFIED / REVIEW / HOLD.

## Authority boundary
Browser/UI rules are explanatory/presentation only.
Server rules control regulated release/closure readiness.
A browser user cannot satisfy a server compliance gate merely by editing claim.compliance, approvals, signatures, clocks or similar JSON.
Verified PA license must come from protected server records.
Representation/client authority must ultimately come from protected server-owned authority records (P0-02).
Deadline calculations used for material action must come from the server registry/calendar service.
Unknown applicability must produce REVIEW/HOLD, never a guessed legal conclusion.

## Calendar requirements
Calendar-day rules may be computed directly from verified trigger dates.
Working/business-day rules require a verified jurisdictional calendar including applicable holidays, not the current weekend-only helper.
Emergency/catastrophe extensions or special rules require explicit effective-dated authority and must never be inferred from location/event name.
All trigger dates must retain source/provenance.

## California baseline to encode
- claim acknowledgement: 15 calendar days — 10 CCR 2695.5(e)(1)
- forms/instructions/reasonable assistance: 15 calendar days — 10 CCR 2695.5(e)(2)
- investigation begin: 15 calendar days — 10 CCR 2695.5(e)(3)
- pertinent claimant communication response: 15 calendar days — 10 CCR 2695.5(b)
- accept/deny after proof of claim: 40 calendar days — 10 CCR 2695.7(b)
- continuing investigation notice: 30 calendar days — 10 CCR 2695.7(c)(1)
- payment after acceptance: 30 calendar days — 10 CCR 2695.7(h), with regulatory exceptions preserved

## Nevada baseline
Keep CA and NV registries separate. Existing prototype keys for NAC 686A.665/.670/.675 must be revalidated against the current official Nevada Administrative Code before production activation. Working-day calculations remain HOLD until holiday/calendar semantics are verified.

## Prohibited automation
ADPA must not automatically conclude bad faith, waiver, estoppel, policy invalidity, catastrophe status, legal entitlement, or unauthorized-practice-of-law conclusions.
AI may identify facts/rules/issues and draft analysis; licensed PA judgment remains required for regulated adjusting and counsel escalation where legal advice is required.

## Negative tests required
1 client changes browser compliance to Verified — server remains unsatisfied without protected record.
2 client edits deadline due date — canonical server deadline unchanged.
3 CA license presented on NV claim — regulated action denied.
4 expired/unverified license — denied.
5 unknown jurisdiction — HOLD.
6 unsupported/ambiguous rule applicability — REVIEW/HOLD.
7 weekend/holiday working-day case — verified calendar required.
8 catastrophe exception absent explicit authority — not applied.
9 stale regulatory rule version — HOLD/reverification.
10 client authority absent protected P0-02 record — release denied.
11 contract/disclosure sequence missing — release denied.
12 browser-created approval cannot satisfy regulated release.

## Safety-control event
A repository implementation attempt to add the server regulatory registry/compliance gate was blocked by OpenAI repository safety controls. The block was respected. No workaround and no weaker security path was committed.

## Decision
Primary-source regulatory review: PASS.
Canonical server rule architecture: COMPLETE.
Browser/server authority boundary: DEFINED.
Server implementation: BLOCKED/PENDING.
Holiday-aware calendar service: PENDING.
P0-02 protected authority dependency: PENDING.
Production regulated-action gate: HOLD.

P0-10 DESIGN AND PRIMARY-SOURCE REVIEW COMPLETE. Production implementation cannot truthfully be marked complete until the protected server rule service is committed, tested and exercised in staging.
