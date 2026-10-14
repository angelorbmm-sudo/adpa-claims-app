# Receipt matching and depreciation recovery review — 2026-10-13

The claim workspace links to `/receipts?id=<claim-id>`. Each purchase receipt retains original evidence, a page/record locator, vendor, purchase date, known or unknown total, and separately documented split allocations to existing Contents inventory items. Allocation dollars do not update inventory values, convert physical units, authorize payment, or establish a recoverable amount.

Human review binds the current receipt facts, original metadata, claim identity and linked inventory facts. Missing originals, unknown amounts, invalid calendar dates, duplicate receipt originals, duplicated item targets and allocations exceeding the receipt total block review. Incomplete records can remain saved drafts. Changed facts make earlier reviews stale. Corrections require a reason and retain prior facts with server-stamped actor/time; voiding keeps the original and reason. Generic claim saving cannot overwrite receipt records or their audit/review state. The final version/owner/evidence metadata SQL guard rejects concurrent source changes.

Preparation, package and authority checks report unresolved receipt reviews. Packages identify active receipt rows as receipt match evidence. Existing Payment review remains responsible for separately documented policy conditions and issued depreciation checks. Unknown withheld depreciation now produces an unknown remaining figure and an open-review warning; issued allocations exceeding source withholding also remain unresolved.

Validation: 530 automated tests pass, TypeScript passes, and production build is required before publication. Nine added regression tests cover splits, unknown versus zero, duplicates and excess allocation, access and version guards, correction/void history, stale facts, concurrent source changes, package warnings and unknown depreciation.

Live browser/mobile and real-workflow walkthroughs with Angelo and Ana remain pending. Automated checks do not certify commercial readiness. No carrier email or payment is sent by this workflow.
