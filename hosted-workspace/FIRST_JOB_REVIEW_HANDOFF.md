# Start the first job review — 2026-10-14

Canonical area 8 completed. Ledger: 43 of 52 canonical areas covered; 9 dedicated reviews remain. Next: area 11 Shared recovery job and company participation.

## Changes

- Agreement preparation requires a retained company PDF with valid size, PDF header and SHA-256 digest. The original is read and verified again before the guarded write. Existing exact client/company/template metadata checks remain, using the original client serialization rather than a reserialized approximation.
- The older first-job preparer cannot bypass an existing active service agreement in Signing center. Preparation still creates no signature, delivery or work authority.
- Repeated preparation retains before/after template revision/digest and recipient facts with actor/time. History is visible in the guide. Explicit 300-preparation and 500 KB client limits reject additional writes while preserving prior data; client audit retention remains intact.
- Confirmed intake creation, agreement preparation and invitation workspace creation remain reported as saved after refresh failure. Created client IDs are retained immediately, avoiding a duplicate-create retry. Rejected writes preserve entries and duplicate-client references.
- Status-only refreshes preserve local guide entries and the version originally opened. They cannot silently adopt a newer saved-guide revision and overwrite another device's progress. Explicit reload/discard adopts saved progress; stale conditional writes still fail.
- Client changes and navigation guard unsaved entries. Synchronous mutation locking and disabled form controls prevent overlapping actions/edits. Refresh resets agreement review confirmation, while progress save remains explicit.

## Validation

670 automated tests passed, including six new regressions for missing/tampered/non-PDF templates, originals changed between verification reads, existing Signing-center service agreements, retained preparations/history limits, confirmed-save refresh failures and cross-device progress conflicts. Existing company/client isolation, readiness, template/client race and audit-retention checks pass. Synthetic fixtures now contain real PDF-header bytes and matching digests. TypeScript passed; production build runs during packaging.

## Pending

Browser/iPhone and real provider/multi-user walkthroughs remain pending because supported browser QA is unavailable. Templates still require human content/form approval, and actual signature delivery, homeowner account access and participation approval remain separate checks. No real invitation, message or signature request was sent. Owner-private access is preserved. Preparing an agreement does not prove legal sufficiency or completed contracting.
