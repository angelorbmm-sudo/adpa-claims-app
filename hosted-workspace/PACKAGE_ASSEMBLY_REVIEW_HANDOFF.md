# Claim package assembly and internal exports review — 2026-10-14

Area 46 reviewed. Ledger: 33 of 52 areas reviewed, 19 remaining. Next: package approval connection and release handoff review.

## Completed behavior

- Assembly requires the exact opened saved-facts/evidence fingerprint as well as the saved claim revision. Original metadata, private object identity and evidence provenance are bound into the canonical package fingerprint. Private storage keys and upload-provenance fields are excluded from public file lists and saved exports.
- Every selected original is read and SHA-256 checked before saving. Content-addressed upload IDs are verified where available. A final R2 lease/digest check and atomic SQL claim/evidence guard prevent changed inputs from silently creating a reviewed snapshot.
- The 50-package limit is enforced inside the insert, alongside full claim material, revision and evidence count/metadata checks. A retry ID returns its saved package only for matching original assembly inputs; changed text or reviewed source fingerprints cannot reuse it as a successful new package.
- ZIP downloads verify selected original metadata and SHA-256 content, including same-length modifications. Missing or changed originals abort the whole download. A final current-facts check prevents stale-warning races during download. Attachments remain separate from browser Print / Save as PDF.
- Current workstream, agreement, mortgage/draw and pricing projections use explicit field lists, including nested pricing sources, quotes and signer records. Correction histories, internal review snapshots and unexpected fields are excluded. Existing separate valuation/payment figures are preserved; assembly does not compute a combined demand.
- New snapshots carry export schema 2. Legacy snapshots remain stored, become conservatively stale through fingerprint version 2, and require reassembly before HTML or ZIP export under current checks.
- The package workspace preserves unsaved entries on rejected saves and refreshes, guards navigation and overlapping operations, opens selected supporting originals, and captures the displayed source fingerprint at confirmation. A confirmed save followed by a failed preview refresh remains explicitly reported as saved, with the saved package ID retained.

## Validation

596 automated tests passed, including 12 new package regression checks covering opened fingerprints, content changes, missing originals, R2 races, atomic claim/evidence/count guards, idempotent retries, legacy export handling, private history exclusion and save/refresh outcomes. Existing authority/package linkage and release-denial tests pass. TypeScript passed. Production build is part of publication packaging.

## Remaining verification

Browser/mobile walkthrough is pending because the supported browser QA capability is unavailable in this environment. Real specialist validation, provider integrations, signer identity verification and release readiness remain separate work. The app stays owner-private; no carrier message, signature request or money movement is sent by package assembly.
