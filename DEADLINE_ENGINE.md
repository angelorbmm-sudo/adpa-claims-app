# ADPA California + Nevada Deadline Engine

Purpose: preserve a contemporaneous, source-linked claim chronology and create operational reminders before carrier-response deadlines. This is a workflow control, not an automatic finding of bad faith or a substitute for legal advice.

## Initial California rules encoded
- 10 CCR 2695.5(b): complete response to pertinent claimant communications — 15 calendar days.
- 10 CCR 2695.5(e)(1): acknowledge notice of claim — 15 calendar days.
- 10 CCR 2695.7(b): accept or deny after proof of claim — 40 calendar days, subject to the regulation.
- 10 CCR 2695.7(c)(1): continuing investigation notices — 30 calendar-day intervals after the initial period, subject to the regulation.
- 10 CCR 2695.7(h): payment after acceptance — 30 calendar days, subject to exceptions.

Primary source: California Department of Insurance Fair Claims Settlement Practices Regulations.

## Initial Nevada rules encoded
- NAC 686A.665: acknowledgment and pertinent claimant communications — 20 working days.
- NAC 686A.670: investigation timing.
- NAC 686A.675: proof-of-loss decision, additional-time notices, payment timing, and undisputed portions.

Primary source: Nevada Administrative Code Chapter 686A.

## Design
Each clock stores jurisdiction, event/rule, trigger date, calculated due date, pre-deadline reminder date, authority, subject/document, carrier/adjuster, source/evidence reference, status, and an append-only-style audit history.

Default warning: two calendar days before the calculated due date. The warning creates a Work Queue exception and can prepare a draft follow-up. External sending remains disabled until a controlled delivery integration and approval gate are connected.

## Important production rule
Nevada working-day calculation in the browser currently excludes Saturday and Sunday only. Before production reliance, add the applicable Nevada holiday calendar and test claim-specific exceptions. Every regulatory clock must permit a licensed reviewer to verify or override the calculated date with a reason, while preserving both the original calculation and the override in the audit trail.

Rules need effective-from/effective-through dates before multi-year production use. Disaster/emergency rules, policy-specific contractual deadlines, statutes of limitation, suit limitations, proof-of-loss demands, appraisal deadlines, mortgage/loss-draft deadlines, and litigation deadlines should be separate clock classes with appropriate professional review.
