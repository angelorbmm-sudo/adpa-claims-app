# EagleView Phase 6 — Supervised Roof Estimate Testing & Validation

**Status:** Validation protocol and proposed tests complete. **No tests executed, no measured accuracy and no production certification.**

## Five benchmark scenarios
- R1: simple gable, wind damage
- R2: hip roof, multiple facets
- R3: multi-valley roof, dormers and complex accessories
- R4: roof with penetrations and mixed repair strategy
- R5: obscured or contradictory measurements

## Execution sequence
1. Freeze synthetic or permissioned case and expected source measurements.
2. Peter produces an independent expert scope without seeing ADPA's output.
3. José executes the calculation, assembly and omission logic.
4. Compare facet/edge errors, candidate recall, unsupported proposals and duplicates.
5. Log defects and reviewer decisions; rerun after fixes.
6. Angelo authorizes a supervised pilot only after release gates pass.

## Release blockers
Double pitch correction, unlicensed reuse, missing-unit silent acceptance, unsupported hidden damage, untracked override, duplicate charges, unapproved estimate export or automated coverage decisions.

Set tolerances **before** running tests. Keep client data and licensed vendor files out of this public repository.
