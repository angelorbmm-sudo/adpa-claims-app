# ADPA Estimating Intelligence — Research Handoff Index (2026-10-16)

Status: **research specifications only; not implemented or independently validated**.

## Workstreams
- Xactimate-style estimating: quantity takeoff, measurement units, labor, materials, equipment, waste, taxes, supplements, reporting.
- Construction calculation engine: separate scope quantities from pricing, maintain evidence and calculation audit.
- Construction assemblies: candidate repair workflows; applicability depends on inspection evidence and professional review.
- LifeWorth shared pricing: distinct contents replacement, construction materials, installed construction, and mitigation domains.
- Advanced estimating and supplements: compare scopes and price bases; prevent duplicates; require documented justification.
- Advanced Xactimate research: line-item selection, Sketch, macros, pricing adjustments and validation plan.

## Rules for development
1. These are **proposed** requirements. Peter Rooney must verify construction methods, Angelo must approve business rules, and José must approve technical implementation.
2. Do not copy proprietary Xactimate price lists, software code, or licensed data.
3. Use synthetic examples in this public repository. Keep client data, source estimates, vendor agreements, interviews, and protected materials in restricted Drive.
4. Keep each observation's source, unit, geography, timestamp, inclusion of tax/shipping, evidence and review status.
5. Never automatically conclude coverage or that a supplement is owed.
6. Prioritize the existing ADPA MVP; these research items are future implementation candidates.

## Source library
Google Drive master folder (access requires confirmation):
https://drive.google.com/drive/folders/1f1xQdLVKyWNw6643hKeRjJxx0W3qfLVq

## Implementation sequence (proposed)
1. Approve scope/quantity schema and units.
2. Validate calculation formulas using synthetic cases.
3. Integrate permissioned LifeWorth observations with provenance.
4. Implement candidate assemblies and review triggers.
5. Implement estimate comparison and supplement draft workflows.
6. Compare against authorized real-world Xactimate output and Peter-approved estimates.

This index does **not** claim the PDFs, JSON packages, or test suites have been uploaded to Drive or committed here.
