# Inventory reconciliation and carrier response comparison review — 2026-10-14

Area 49 reviewed. Ledger: 36 of 52 reviewed, 16 remaining. Next: payment review and depreciation accounting handoff review.

## Completed changes

- Comparison writes bind exact saved claim state/name/address, revision, owner, evidence count and complete evidence metadata/provenance/private object identity in the final atomic update. Same-version edits cannot be overwritten silently.
- Carrier/support originals and frozen comparison baseline reads retain their original object leases and byte digests. All captured leases are rechecked before persistence. A reread cannot replace the first baseline lease and conceal a replacement. Content-addressed upload IDs must match actual original bytes.
- New comparison creation also tracks the saved workbook, reviewed inventory model and submitted PDF when present. Supplement downloads verify sources, leases and final saved-fact/evidence currency. Comparison CSV exports verify supporting originals before returning a file.
- Source-row corrections, group revisions/removals and archive/reopen events retain earlier history instead of truncating at 100 entries. Audit history extends beyond the former 200-entry truncation. Explicit 300-entry comparison and 1,000-entry audit limits stop further changes while preserving earlier records. Retained comparison changes are visible.
- Integer-cent totals reject missing, noninteger and overflowing values. Unsafe eligible subtotals stay unknown and block supplement readiness. Legacy agreed groups with unknown quantities, unaligned values or absent separate agreement evidence remain held. Duplicate group identities are held. Import range bounds match the 2,500-row limit.
- CSV formula neutralization includes leading whitespace/control characters. RCV, depreciation, ACV and valuation differences remain separate from payment/entitlement calculations.
- Unrecorded comparison forms survive refresh failures, prevent claim/comparison replacement and competing tracker/export actions, and require explicit discard before switching edited records. Synchronous request guards avoid overlapping requests. Confirmed saves clear submitted entries before refresh; subsequent refresh failures remain reported as saved. Uploaded originals remain reported as saved if the following refresh fails.

## Validation

623 tests passed, including ten new regression checks for evidence/state races, carrier/baseline lease changes, retained history/audit records, safe cent arithmetic and overflow readiness, legacy count holds, whitespace-obscured CSV formulas and saved-versus-refresh-failed outcomes. Existing baseline freeze, carrier import/transcription, grouping/omission, agreement, correction, supplement and authorization tests pass. TypeScript passed. Production build is included in publication packaging.

## Remaining verification

Browser/mobile walkthrough remains pending because the supported browser QA capability is unavailable. Independent specialist workflow validation and AI/provider setup remain separate. The app remains owner-private. No carrier message, claim approval or payment action was performed.
