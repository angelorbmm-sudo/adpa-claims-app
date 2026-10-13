# Consolidated inventory PDF and Excel exports — October 13, 2026

## Delivered

Inventory package - PDF & Excel workbook appears in Evidence & Pricing and Contents Care Studio. It includes every saved original-claim inventory row and contents-care item, up to 2500 rows. Original requested values are preserved separately as unverified data. They are never treated as current approved replacement proposals.

The preview separates current ADPA-approved proposal rows from incomplete/held and excluded rows. Approved amounts retain the selected seller/quote, observed date, exact/LKQ comparison, tax/shipping and exclusions. Supporting original filenames, IDs, locators and source URLs are included. Possible duplicate tags and overlapping original/contents descriptions are held until reviewed. A reasoned exclusion leaves the row visible and removes it from counted totals; it does not delete the underlying inventory.

Generation requires an explicit ADPA review note and acknowledgment of inventory, holds, duplicates, pricing and shareable notes. It saves an immutable branded PDF and actual .xlsx workbook to private storage. The workbook contains Summary, Inventory, Sources and Valuation basis sheets with frozen header rows, numeric dollar values and blank unknowns. It uses inline strings, never executable formulas. Generated snapshots do not change requested amounts, inventory counts, price approvals, limits or payments. Nothing is emailed automatically.

The PDF has a claim cover/summary, paginated inventory schedule, selected proposal details, flags, supported item depreciation and source references. Inventory and price unknowns remain Unpriced/Pending/Not established, not zero. Original images and documents are referenced, not embedded or bundled. Evidence URLs require authorized app access: attach original files separately when sending to an adjuster outside the app.

## Depreciation / ACV

No ages, schedules, rates or salvage assumptions are inferred. An item valuation requires a current approved replacement proposal, a checked included Contents settlement provision (RCV or ACV) with policy PDF/page/excerpt, an actual item-fact original and locator, and an ADPA-reviewed depreciation amount/basis. Amount may not exceed the proposal. ACV is arithmetic proposal amount minus reviewed depreciation, subject to the policy review's recorded conditions/recoverability. It remains a proposal, not a carrier payment or determination of coverage.

Item, proposal, original or policy changes stale the valuation; its amounts are omitted until rereviewed. Depreciation and ACV totals explicitly cover only the current supported subset. When no rows qualify they are Not established / blank. They are not whole-inventory ACV totals. Row disposition still Needs review, missing originals, duplicates or other holds exclude the row from counted totals.

## Storage, authorization and limits

Only the configured ADPA owner can review/generate/download these full-claim exports. Same-origin requests, claim version and a complete evidence metadata snapshot guard saves. JSON-based SQL metadata validation avoids a parameter explosion on larger inventories. Ordinary claim writes cannot forge/delete export reviews, exclusion decisions, valuations or artifact history.

Generated binaries are separate from claim evidence so they do not recursively enter pricing triage. Up to 20 saved snapshot pairs/claim are retained in contentsExportHistory with IDs, private storage keys, source version, fingerprint, reviewer, time, note and summary. Historical downloads stay available to the claim owner, with a stale flag after source facts change. Failed concurrency may leave private unreferenced binaries, but does not record an export snapshot. Later cleanup is integration work.

No migrations or email provider configuration are needed. pdf-lib and fontkit generate PDFs in the Worker with a licensed DejaVu font subset (license included). Font is already subset before embedding; runtime subset is disabled to preserve glyphs. Supported Latin/Greek/Cyrillic/Armenian glyphs are preserved; unsupported PDF characters cause an explicit error instead of disappearing. XLSX preserves valid Unicode and rejects invalid XML controls. This is the existing owner-private demo audience.

## Validation

320 automated tests passed, including all-inventory aggregation, held/unknown totals, overlap exclusions, policy/fact-backed depreciation, stale valuations, immutable PDF/XLSX downloads, ownership and stale-write controls, formula-injection prevention, Unicode and policy-source freshness.

A synthetic sample was generated through the actual PDF/XLSX renderers. All three PDF pages were rendered and visually inspected after fixing font glyphs/cover spacing; the workbook was opened with openpyxl, sheet names/numeric cells checked, and confirmed to contain zero formula cells. TypeScript and production build checked before publishing. Live browser and provider QA remain deferred. Sample files use invented data and are not a real client package.
