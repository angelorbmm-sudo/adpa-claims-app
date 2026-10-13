# Contents inventory and treatment review — 2026-10-13

Module 32 cleanup completed for the company contents workflow and ADPA Contents Care Studio.

- Original reviews now bind filename, MIME type, size, category and creation date, not only upload date. Both company and ADPA original-review submissions carry the source key displayed to the reviewer; changed originals reject the old request. Legacy reviews without the new key require fresh review.
- Company contents projection includes the authorized claim number so a report carrying another claim number cannot pass readiness unnoticed.
- Each inventory item shows documentation gaps, a source-backed contractor recommendation, or current/stale ADPA evidence review. Linked cleaning gaps and project evidence requirements are included; recommendations do not become carrier approval.
- Physical tags compare without surrounding whitespace or letter-case differences. Every conflicting item is flagged, with no automatic merge or count change.
- A no-concern screening status requires its reviewer, original, locator and factual basis even before cleaning records are added.
- ADPA record forms provide Copy unsaved record; internal-link navigation also warns about unsaved edits.

Regression coverage: owner and company metadata changes, stale original-review rejection, claim-number mismatch, duplicate tag flags, item-linked cleaning gaps, ADPA review freshness, and unsupported screening. Full preparation suite, TypeScript and production build validate this release.

Manual source review does not hash or automatically interpret every media file. No treatment prescription, safety certification, replacement price, claim approval, external communication or Xactimate activation was added. Item valuations and service charges remain separate. Ana's specialist examples and live company/browser walkthrough are still pending.

Ledger: 19 of 52 review areas completed; 33 remain. Next: contents custody, pack-out, storage and return.
