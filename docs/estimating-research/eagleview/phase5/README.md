# Phase 5 — Roof Scope Generation & Missing-Line-Item Detection

**Status:** Research specification complete; no production engine, vendor integration or validation yet.

## Goal
Use licensed EagleView measurements and evidence to propose construction scope candidates, compare them with versioned carrier estimates, and require professional approval before export or supplement drafting.

## Workflow
Claim context → licensed measurement import → loss evidence → repair strategy review → candidate assemblies → semantic inclusion/duplicate screening → quantity review → professional approval → authorized Xactimate handoff → versioned comparison.

## Critical business rules
1. No candidate without source measurement/evidence references and versioned assembly rule.
2. Do not infer hidden damage, roof layers or repair-vs-replacement decisions from aerial imagery.
3. A possible omission is not proof of coverage, requirement or payment.
4. Check whether an accessory is already included in bundled scope.
5. Keep installed quantity, waste, purchase-unit rounding and price separate.
6. Preserve reported and calculated sloped area; never double-apply pitch.
7. Every override requires identity, reason, before/after values and timestamp.
8. Export only reviewer-approved scope versions and licensed data.
9. Retain source confidence and unresolved review flags.
10. Never upload private claims or proprietary vendor reports to public GitHub.

## Candidate assembly families
Roof covering, tear-off/disposal, underlayment, starter/drip edge, ridge/hip caps, valley membrane, flashing, ventilation, decking, access/protection, permits/code. Applicability must be evidence-based.

## José's next implementation steps
- Define approved measurement import and evidence model.
- Build candidate assembly engine with conditional rules.
- Implement semantic estimate matching and duplicate screening.
- Add review queue, audit events and versioned export.
- Run synthetic acceptance tests, then Peter Rooney-reviewed real-world scenarios.

The full Phase 5 PDF and ZIP are separate archival deliverables and are not uploaded by this GitHub commit.
