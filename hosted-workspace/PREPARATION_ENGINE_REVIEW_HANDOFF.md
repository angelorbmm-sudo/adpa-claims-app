# AI claim preparation engine review — 2026-10-13

The supervised preparation screen remains at `/preparation?id=<claim-id>`. Record checks and the historical review queue operate without an AI key. Actual document analysis continues to require Jose's server connection; this review does not fabricate activation or send any claim messages.

Preparation fingerprints now bind claim identity, material saved state, revision and the complete source metadata including MIME and object key. Review writes use a final exact claim/state and evidence manifest guard, closing the earlier count/latest-created-only race. The queue remains independent of claim amounts, receipt allocations and approvals.

Analyzed originals are size-checked, SHA-256 hashed and validated against content-addressed upload identifiers. Runs retain original fingerprints in the immutable source snapshot. Confirmation rechecks those bytes; legacy AI runs without retained proofs must be analyzed again. Historical dismissal remains available with rationale.

Text/email citation quotes must occur in the submitted UTF-8 source after whitespace/Unicode normalization. Image/text citations cannot invent PDF page numbers. PDF/image quotes and physical pages still require human original-file verification. Duplicate inputs, unknown/invalid byte counts and corrupted source bytes are rejected before analysis. Inventory context retains quantities, units and count bases; the model is explicitly told not to derive physical counts from receipt dollars or include voided records in active totals.

Retries cannot reuse a request ID for a different mode, batch or source version. The client retains the same idempotency key after an unconfirmed network result. Every review decision requires rationale. Review forms capture the opened run revision, retain notes on rejection, guard navigation and allow copying/clearing drafts. A refreshed newer review requires explicit inspection before using its revision. Synchronous busy guards and claim-response checks prevent duplicate submission and cross-claim response application.

Confirmed writes clear only the submitted review before refreshing. A failed refresh is reported as saved-with-refresh-unavailable rather than a failed save. Internal downloads retain uncertainty, review history and analyzed original fingerprints. No automatic match, financial change, coverage decision or release is created.

Validation target: 572 automated tests, including 12 new preparation integrity/client regressions; TypeScript; production build. Mocked AI tests verify the request/response and run-to-review path, not live provider activation. Browser/mobile and real-workflow walkthroughs remain pending.
