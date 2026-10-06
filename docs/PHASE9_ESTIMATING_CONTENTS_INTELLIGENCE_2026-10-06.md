# Phase 9 — Estimating & Contents Intelligence

Date: 2026-10-06
Status: CODE COMPLETE; REMOTE CI/BROWSER VALIDATION PENDING

## Goal
Create the normalized intelligence layer between carrier estimates/contents records and future estimating engines, including the planned Xactimate-mimic project.

## Architecture
Yes: the Xactimate-mimic project should eventually plug into this layer rather than replacing ADPA.

Recommended boundary:
Xactimate/Xactimate-mimic/ESX or other estimate source -> import/normalization adapter -> ADPA estimating intelligence -> issue/supplement/negotiation/package workflow.

ADPA remains the claims operating system and authority/workflow layer. The estimating engine supplies structured scope/pricing data and source/version metadata.

## Dwelling/structure intelligence
Added src/lib/estimatingIntelligence.js.

Estimate analysis supports both:
- detailed line-item records using quantity x unit price; and
- existing total-level synthetic estimate fixtures.

It calculates ADPA total, carrier total, variance, coverage totals and review/source gaps.

Initial variance categories:
- Missing scope;
- Quantity;
- Unit price;
- Scope / pricing;
- No material variance.

The Estimate Comparison UI now displays variance type, unsupported variance count and aggregate variance categories. Variance lines without support are visibly marked SOURCE NEEDED.

## Contents/LKQ intelligence
The same engine normalizes contents:
- quantity;
- ADPA RCV;
- carrier RCV;
- RCV variance;
- depreciation;
- calculated ACV;
- replacement-source presence;
- LKQ/valuation review state.

Contents UI now shows item count, calculated RCV/ACV/depreciation, unresolved LKQ/valuation count and missing replacement-source count.

## Synthetic acceptance
Regression coverage verifies:
- missing carrier scope classification;
- Phase 2 $340,000 vs $285,000 dwelling totals and $55,000 variance;
- Phase 2 contents RCV/ACV/depreciation calculations;
- Phase 6 2,000-item contents fixture retains exactly 150 review items;
- water claim surfaces estimate review/source gaps.

## Future Xactimate-mimic adapter contract
Future imported estimate lines should ideally provide:
- stable external/source line id;
- estimate version/source file id;
- coverage;
- room/area;
- trade/category;
- item/code/description;
- quantity and unit;
- unit price;
- tax/overhead/profit components where applicable;
- depreciation/ACV fields where applicable;
- source/page/line provenance;
- pricing database/region/date when known;
- human review state.

Do not bind ADPA core workflow directly to one vendor file format. Keep adapters separate so Xactimate, the mimic engine, contractor estimates, carrier PDFs and future estimating sources can feed the same normalized comparison model.

## Boundaries
This intelligence compares recorded numbers; it does not independently establish coverage, entitlement, code applicability, reasonable price, matching, causation or settlement value. Those remain source-dependent and human/licensed-review controlled.

PHASE 9 CODE: COMPLETE.
XACTIMATE-MIMIC INTEGRATION BOUNDARY: DEFINED.
REMOTE CI/BROWSER VALIDATION: PENDING.
REAL CLIENT PRODUCTION: HOLD.
