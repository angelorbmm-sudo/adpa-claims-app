# Phase 4 — EagleView-to-Xactimate and LifeWorth integration

**Status:** Completed research specification; not a deployed integration.

## Goal
Consume authorized roof and exterior measurements, create evidence-backed scope candidates, obtain professional approval, and hand off estimate-ready quantities to licensed Xactimate workflows while comparing independent LifeWorth observations.

## Data flow
Licensed EagleView report or authorized import → provenance and units → validated geometry → proposed assemblies → reviewer approval → approved scope lines → supported Xactimate interface or manual handoff → versioned estimate comparison and supplement review.

## Non-negotiable rules
- Do not assume subscription includes API access, licensed item-code redistribution, or cross-product reuse.
- Never double-apply pitch; keep vendor-reported and calculated areas separate.
- Keep installed quantity, waste, purchase quantity and price separate.
- Require evidence and assembly applicability for starter, drip edge, flashing, ventilation, underlayment and other candidates.
- Do not treat possible omissions as automatically owed or covered.
- Require explicit approval before final export or supplement transmission.
- Store source rights, version, reviewer identity, timestamps and before/after changes.
- Never publish private client data or proprietary reports in this public repository.

## Implementation order
A. Synthetic import and validation
B. Candidate scope rules and evidence
C. Reviewer approvals, versioning and audit
D. LifeWorth price comparison
E. Authorized Xactimate handoff adapter
F. Peter Rooney and José validation

Full Phase 4 PDF/ZIP archive remains a separate deliverable; this repository stores sanitized specifications.
