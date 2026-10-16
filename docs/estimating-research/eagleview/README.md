# EagleView-style measurement intelligence — Phases 1–3

**Status:** Research and proposed technical specification; not production integration, not independently accuracy-validated.

ADPA expects subscriptions to EagleView and Xactimate. Prefer licensed reports and permitted APIs over custom imagery extraction. HomeBack I/II may reuse data only when the contract, consent and data-rights permit.

## Phases
1. **Phase 1:** roof and exterior measurement concepts; imagery, geometry, evidence, quality assurance.
2. **Phase 2:** licensed report procurement, vendor integration feasibility, source controls, caching, report status and commercial questions.
3. **Phase 3:** facet geometry, pitch correction, edge semantics, waste, exterior elevations, quantity audit and reviewer approval.

## Essential business rules
- Store source, original units, license/retention constraints, and report version.
- Distinguish plan (horizontal) area from sloped roof area.
- Never apply pitch twice to a vendor-reported sloped area.
- Use pitch-specific calculations for each facet; preserve original source quantities.
- Separate installed quantity, waste, package coverage, and rounded purchase quantity.
- Deduplicate edges and accessory quantities.
- Route missing pitch, occlusions, contradictory sources and manual overrides to review.
- Require professional sign-off before quantities feed final estimates.
- No automatic assertion of policy coverage or supplement entitlement.
- Keep client reports and proprietary vendor files out of this public repository.

## Calculation examples
Pitch factor = sqrt(1 + (rise/12)^2).
Sloped facet area = horizontal projected facet area × pitch factor.
Roof squares = sloped area in square feet / 100.
Example: 1,200 sq ft at 6:12 → 1,341.6408 sloped sq ft → 13.4164 squares.
An illustrative 10% material waste yields 14.7580 squares before product-specific rounding. Waste is never a default finding.

## José's development plan
1. Confirm EagleView product/API entitlements and permitted use.
2. Implement vendor-neutral report/measurement ingestion and provenance.
3. Normalize facets, edges, elevations, units and source confidence.
4. Implement versioned calculations and exceptions.
5. Build reviewer UI with before/after override audit.
6. Integrate approved quantities with construction assemblies and LifeWorth.
7. Validate with Peter Rooney on multiple real roof configurations before release.

**Original PDF and ZIP research archives are not represented by this repository index.** Keep them in restricted Drive once uploaded and verify José's access.
