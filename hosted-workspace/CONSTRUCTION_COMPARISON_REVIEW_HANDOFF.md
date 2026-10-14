# Construction scope comparison review — 2026-10-13

Module 37 cleanup completed.

- Restored the construction panel and navigation to the actually served claim workspace. The old synchronization helper had expected fragments that were no longer present; it now inserts or updates only construction fragments and preserves other modules.
- Missing, repeated, unpriced and unsafe line references cannot silently yield partial comparisons. Ambiguous repeated descriptions remain manual rather than receiving arbitrary exact-match suggestions.
- CSV imports reject duplicate headers, wrong column counts, malformed numeric cells and fractional-cent price/tax/O&P fields. Zero remains distinct from unknown.
- Reviewed differences require both attached originals, current evidence metadata, source page/quantity/unit review, reviewer, coverage and rationale. A recorded absence needs the complete-carrier-scope confirmation. Overlapping comparisons are blocked.
- Server saves preserve existing source versions; corrections add linked revisions. Comparison corrections append history. Reviewed snapshots bind immutable version metadata and selected lines without copying entire large estimates into every comparison.
- Source-linked supplement drafts must retain the exact reviewed positive difference, coverage, source versions and selected-line snapshot. Changes to evidence during saving are rejected. Source comparisons and proposals do not update claim values or payments.
- Preparation, internal packages and authority review show stale/incomplete construction comparisons. Historical drafts remain preserved and require current review before release.

Validation: automated preparation suite, TypeScript and production build; served inline script syntax and public/source engine synchronization. Live browser/mobile validation and Peter's estimating walkthrough remain pending. No live Xactimate export or carrier sending added.

Ledger: 24 of 52 reviewed; 28 remain. Next: 38 supplements and disputes.
