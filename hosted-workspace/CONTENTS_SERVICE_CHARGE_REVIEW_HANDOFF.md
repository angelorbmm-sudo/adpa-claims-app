# Contents service charges and corrections — 2026-10-13

Module 34 cleanup completed.

- Only Actual and Supplement service lines can enter the recorded subtotal. Unknown statuses and preliminary charges remain excluded.
- Duplicate invoice identities and physical work keys compare without surrounding whitespace or case differences. All conflicting active lines are held out.
- Multiple active replacements of the same voided original are flagged and excluded. A valid single replacement retains the original and its void reason; an unavailable/non-voided original blocks inclusion.
- Service references pointing to different inventory items require reconciliation. Each invoice displays its status, gaps and separate submitted/approved/issued/received figures.
- Companies cannot create or alter ADPA approval/issued figures, including recorded zero. They may preserve existing ADPA fields while correcting their own records; changing linked approval evidence requires ADPA. Voiding a company line requires a reason.
- The company Services form includes cleaning/custody/storage links, replacement links, void controls and payment source locators. Technician views omit service review details and invoice amounts.
- Open company records have Copy/Clear and navigation protection. Confirmed writes clear their draft before refreshing; a failed refresh is identified as a saved write, blocks additional writes/uploads and offers refresh without resending.

Regression checks cover statuses, normalized duplicates, replacement branches, work-key overlap, mismatched items, zero approval boundaries, preserved ADPA values, void reasons and technician privacy. TypeScript, full preparation tests and production build verify this release; live browser and Ana walkthrough remain deferred.

The subtotal remains unreconciled and is never a carrier demand, property valuation, payment balance or money authorization. No provider activation, payment transfer or Xactimate export was added. Existing audited ADPA record corrections retain their history.

Ledger: 21 of 52 review areas completed; 31 remain. Next: evidence-draft transfer.
