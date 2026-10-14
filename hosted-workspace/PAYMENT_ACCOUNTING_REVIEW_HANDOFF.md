# Payment review and depreciation accounting handoff review — 2026-10-14

Area 50 reviewed. Ledger: 37 of 52 reviewed, 15 remaining. Next: policyholder status and recovery handoff review.

## Changes

- Payment writes bind exact claim material state/name/address, owner, revision, evidence count and complete original metadata/provenance/private object identity at the final atomic update. Existing cross-claim physical-check identity protection remains in place.
- Every source read retains its initial object lease and verified byte digest. Content-addressed upload IDs must match actual bytes. All captured leases are checked before persistence; changed originals cannot silently post or revise managed ledger records.
- Check and managed ledger histories retain corrections beyond their former 100-entry truncation, with explicit 300-entry limits. Statement/depreciation histories retain earlier revisions with 200-entry limits, and payment audit retains records beyond its former 300-entry truncation with a 1,000-entry limit. Limits reject new changes while preserving history. Statement and depreciation revisions are visible.
- Legacy incomplete/invalid check stage sequences, duplicate status records, invalid chronology, duplicate physical identities, invalid allocations and missing face/identity facts are held outside known stage totals.
- Integer-cent subtotal arithmetic rejects unknown, negative, fractional and overflowing values. Unsafe statement/depreciation subtotals remain unknown. Single-payment advice, like cumulative summaries, does not count checks issued after the source as-of date.
- Unlinked issued checks carrying recoverable-depreciation allocations hold the remaining-depreciation figure even when those check records have become stale. A stale check cannot be silently treated as no payment.
- Unrecorded review forms survive status refresh and rejected saves, protect claim selection and competing pricing/export/tracker actions, and require explicit discard before switching edited records. Confirmed saves clear submitted entries before refreshing; refresh failures remain reported as saved. Uploaded originals remain reported as saved if their subsequent refresh fails.

## Validation

633 tests passed, including ten new payment regression checks covering evidence/state races, final check lease replacement, incomplete status sequences, duplicate legacy identities, stale unlinked depreciation checks, retained check/ledger/audit history, safe cents, source as-of dates and saved-versus-refresh outcomes. Existing split-allocation, legacy migration, duplicate ownership, stage chronology, bank-evidence, statement, policy/depreciation and voiding tests pass. TypeScript passed. Production build is included in publication packaging.

## Remaining verification

Browser/mobile walkthrough remains pending because the supported browser QA capability is unavailable. Bank/provider verification and independent specialist validation remain separate. Recorded destinations, allocations and check stages do not move funds. No bank action, payment transfer or carrier message was sent. The app stays owner-private.
