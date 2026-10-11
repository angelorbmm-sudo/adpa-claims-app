# Material decisions and scope support

Implemented 2026-10-11, based on Arman's documentation guidance. Available in Water Scope Studio and assigned mitigation company jobs under Material decisions; also linked from the mitigation workspace.

## Field-to-review workflow
1. Record a Daily field visit with exact material/location, proposed action (Continue drying, Remove, Clean or Needs assessment), reported salvageability and porosity, professional assessor, factual reason, original files and locators. Reported category/class remains the contractor's assessment; unknown values remain unknown.
2. Include moisture readings with instrument, test point, method, units and supporting originals. Add mitigation scope tasks for the measured room, including quantity basis, necessity and cited originals.
3. Open Material decisions. Select the saved room/material decision, inspect its originals, choose the supporting readings from that same visit and select applicable mitigation tasks from the same room.
4. A manager or ADPA records an internal source review with a note explaining why those readings and tasks apply to the exact material/location. Drying and removal decisions require linked material readings. Missing assessments, original references or task support block review.
5. Prepare, copy or download the internal text justification. The draft includes reported decisions, selected readings, scope tasks, source locators and saved review gaps. Draft preparation sends nothing.
6. The company manager handoff to ADPA is blocked while current assigned material decisions lack a current support review. Review does not grant ADPA scope acceptance, coverage or settlement authority.

## Corrections and access
Daily field decisions remain immutable. Correct them through the existing Daily field visit correction workflow; original decisions remain historical. Corrected decisions cannot be reviewed or used as current, even if the new correction's original is outside the company's sharing projection. Correction metadata carries no hidden decision content.

Company technicians can record daily assessments but cannot record manager material source reviews. The review requires an assigned company job, accessible room, visit sources and mitigation tasks. Withdrawn originals hide affected decisions/review notes and block further review. Reviews become stale after linked visit, room, task, correction or original metadata changes. An altered reading/task selection requires a new review. Reviews append to history and contribute to claim-package and handoff fingerprints.

## Limits
The workflow records professional judgment; it does not decide whether a material is safe, salvageable, properly dried or compliant. It does not infer the applicability of a reading or task from a checkbox, determine water category, price new work, approve coverage or payments, or export Xactimate. Those remain professional review and integration tasks. No financial ledger or approval fields are changed.

## Verification
203 automated tests cover the existing application and material review, including company isolation, manager-only review, strict input, unsupported assessments, missing/foreign readings, invalid scope citations, source withdrawal, changed source fingerprints, hidden corrections, package inclusion and API origin/version guards. TypeScript and production build are checked before deployment. Browser/phone visual QA is unavailable in this environment; a walkthrough with Arman remains necessary before broad use.
