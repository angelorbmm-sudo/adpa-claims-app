# Photo Findings and Source Review cleanup — 2026-10-13

## Result
Every photo examination/manual record/confirmation now requires the exact authorized source proof opened by the reviewer: SHA-256 digest, original creation timestamp and revision. The server checks that proof against the current authorized original before reading bytes or calling AI. Refreshing the job version cannot silently bind an old manual draft to a replacement photo. Missing proof fails closed; clients with an older open page must refresh.

The authorized inbox supplies source proof only for currently available originals. Existing per-file consent, role/private suggestion projection, full-byte integrity checks and guarded writes remain active. No storage keys or provider secrets are exposed.

The photo form captures the opened source proof, preserves failed drafts and disables saving when the current photo proof differs. The reviewer can inspect the current original, then explicitly clear the draft and start a new review. Existing parent navigation guards protect unsaved findings. Draft confirmation remains deliberate.

After a confirmed server save, the draft clears and a saved message appears before refreshing. If refresh fails, additional writes are disabled and a dedicated refresh button appears, preventing an ordinary retry from creating a duplicate record. This does not implement general idempotency for an uncertain network response before the save receipt.

Contents findings cannot attach to building-component references, and building findings cannot attach to contents-item references. Both/Uncertain findings can retain authorized references without inferred quantities or prices. The job-wide photo-record limit is checked before an external AI call.

## Validation
418 automated tests passed, including changed photo revision despite a refreshed job, missing/mismatched proof, reference-type consistency, withheld proof on unavailable originals and capacity before provider calls. TypeScript and production build are required in the release packaging step. Browser/phone interaction testing remains deferred.

## Limits and next review
Production AI still awaits Jose’s server-secret activation and real photo accuracy testing. Existing manual findings work without AI. No automatic audio/video/Matterport examination, Xactimate quantities, pricing, coverage decisions or settlement approval are introduced. Sharing revocation still controls original/finding access. Next chronological review area: evidence-linked building and contents drafts.
