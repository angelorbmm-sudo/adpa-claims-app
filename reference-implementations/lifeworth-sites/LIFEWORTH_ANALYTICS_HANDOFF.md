# LifeWorth analytics dashboard — October 23, 2026

The private Sites workspace now derives its LifeWorth overview from the selected property's saved records. The original LifeWorth pitch deck and HomeBack UX mockup image were reviewed as references. The existing navy/teal interface is retained; the reference's summary cards, value comparison, and history layout are implemented with actual saved data rather than illustrative figures.

## Behavior

- Separate reviewed contents and business-equipment replacement totals, with amounts awaiting review. Building materials are excluded from these totals to avoid automatically counting them again with reconstruction.
- Room bars show reviewed and unreviewed contents/equipment, record counts, quantities, and missing prices.
- Documentation progress requires owner confirmation, a recorded replacement price, and an evidence reference. A reviewed linked receipt reference qualifies. This measures recorded references, not file authenticity or coverage readiness.
- Comparable rebuild costs are compared with the recorded dwelling limit. Missing scope and absent policy/cost inputs are explicit. Upgrades and conditional extensions remain separate, as do land and market value.
- Snapshot saves use the existing authenticated, same-origin, owner-scoped, version-checked API. The server supplies snapshot timestamps. Historical recorded values persist after later inventory changes and are included in the existing JSON export.
- The chart uses the latest 12 snapshots, spaced by record sequence, with all selected-property history in a dated table. Empty states do not insert fictional data.
- Snapshot capacity is 500 per account. Audit remains bounded at 500. Properties with history cannot be deleted to leave orphaned snapshots.
- Good everyday, Better verified-loss discounts, and Best verified disaster/partner-agreed actual-cost no-profit circumstances retain their existing eligibility rules.
- ADPA remains a separate public adjusting business. Existing records and access policy are preserved. No changes were made to Jose's dev.adpa.claims project.

## Verification

759 automated tests passed, including new tests for category separation, property isolation, receipt evidence, immutable snapshots, version conflicts, ownership, capacity and bounded audit. TypeScript and the production build passed. Server rendering succeeded for loading, no-property, empty-property and populated-history states.

Browser visual QA and screenshots remain unverified: the prior preview was blocked by its security policy, and no bypass was attempted. No real user records were inserted for tests.

## Limits

Values are manually entered and change when records are edited. There is no live catalog, automatic appreciation, external appraisal, automatic insurance coverage determination, commerce checkout, or original-file authenticity verification. Snapshots are app-maintained history, not cryptographically notarized records.
