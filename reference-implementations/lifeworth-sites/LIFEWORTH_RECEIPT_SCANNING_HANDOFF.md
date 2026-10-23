# LifeWorth receipt upload, on-device scanning and reviewed purchase confirmation

Open LifeWorth → select property → Purchase organizer → Scan a purchase receipt.

## Workflow

1. Upload one PDF, JPEG, PNG or WebP receipt (maximum 8 MB). The server verifies the format signature and stores the original privately with a SHA-256 integrity digest. Repeated identical uploads in a property return the existing original. Each account retains up to 100 originals.
2. Read the uploaded original in the browser. English Tesseract.js OCR handles photos. PDF.js extracts text where available; image-only PDF pages render to canvas before OCR. At most three PDF pages are scanned; large image/page pixel counts are bounded. Workers, language data and PDF resources are served from this app's origin; no API key or external AI service is used.
3. Draft suggestions identify retailer, a recognized date/order reference, product lines, quantities and line totals where readable. Tax/payment/summary lines are kept out of candidate products. Parsing is deliberately conservative and format-limited: unknown details and ambiguous totals need human correction. Suggested quantity defaults to one unless a supported prefix is present and is explicitly flagged for review. Values are not authenticated facts.
4. Review/correct the extracted text or enter text from the original manually; rebuilding replaces the unconfirmed draft. The reported extraction method is client-supplied provenance, not independent authentication. Select purchase lines, correct amounts/quantities, and match existing contents/equipment inventory or supply a room/type for a new item.
5. Review the original and confirm USD, dates, matches and line totals; add required notes explaining tax/delivery/discount allocations, exclusions and differences from the recognized receipt total. Possible duplicate supplier/reference or date/amount matches require explicit acknowledgment. An exact duplicate receipt line remains blocked by existing validation.
6. Confirm once. All selected purchase receipts and any new inventory items save in one optimistic account update; a failure writes no partial purchases. Existing inventory details/quantity/replacement values remain unchanged. New items start with blank replacement values and await owner confirmation. Each receipt retains its uploaded original link, upload ID and draft source-text line. Return deadlines and warranties remain separate source-confirmed fields, not inferred from the receipt.

## Implementation and boundaries

- Optional `receiptScans` in LifeState stores original metadata, current unconfirmed draft and confirmation references. This reuses the existing owner-scoped account JSON; no schema migration is needed. Original binaries live under the existing private FILES binding.
- `/api/lifeworth/receipts`: authenticated upload/draft/confirmation POST and integrity-checked original GET. Same-origin and account-version guards apply. Requests are bounded; upload body reading is streaming and capped. Original downloads are private/no-store/nosniff with a restrictive content policy.
- `lib/lifeworth-receipt-scan.ts`: validation, conservative text parsing, duplicate hints and atomic domain confirmation. Untrusted receipt text is never executed or sent as instructions to a model.
- `lib/lifeworth-receipt-ocr.ts`: on-device reading; workers terminate after reading. Language cache writes are disabled. Large libraries load only when reading is requested.
- `scripts/prepare-receipt-scanner.mjs`: copies locked OCR/PDF dependencies into same-origin public assets during dev/build. Generated assets are ignored by Git but included in deployment. No CDN fallback is intentionally used. Tesseract's optional donation postinstall script is explicitly disabled by the package policy.
- Source receipt links use the app's HTTPS original endpoint. The original remains available after the review is confirmed. Properties retaining receipt originals cannot be deleted. No original deletion UI is added in this increment.
- JSON export includes metadata, text drafts, confirmation references and audit, not original binaries; each original can be opened/downloaded separately. No money moves, live shopping, claim submission, return processing, warranty verification or cross-account sharing occurs.
- OCR can misread quantities, dates and prices; layouts, non-English receipts, non-USD currencies, fractional quantities, handwritten receipts and PDFs with complex/encrypted content require manual review or supported conversions. This feature is not general-purpose AI product identification or a catalog matcher.

## Verification

780 automated tests passed, including eight new receipt upload/domain/API tests. TypeScript and production build passed. Tests cover owner/auth/origin guards, stale versions, byte-signature validation, repeat uploads, limits, exact source integrity, draft invalidation, duplicate hints/acknowledgment, source provenance, atomic confirmation, new unpriced items, existing-item preservation and no automatic execution of untrusted receipt text.

Real Tesseract and PDF.js engine checks recognized a synthetic receipt PNG, extracted a text PDF, and rendered/OCR-read an image-only PDF, including known product prices and the total. All test files were synthetic and local; no customer receipt was used and no live account was seeded.

The production build includes the OCR language, workers, core variants, PDF worker, fonts, cmaps and wasm assets. Browser visual and actual in-browser end-to-end verification remain unverified: the managed preview supervisor reports running, but the cloud browser receives ERR_CONNECTION_REFUSED. No bypass or substitute browser-control path was attempted. Mobile/device acceptance remains outstanding.

## José integration additions

Port the new receipt domain module, on-device reader, component and route along with LifeState/schema additions. Adapt original storage and transactional owner/version writes to the target host. Add the locked Tesseract.js, English traineddata and PDF.js dependencies; run the asset-preparation script as part of both dev/build and retain its licenses. Keep all resource URLs same-origin. Extend the standalone test runner to compile the receipt domain and mock authenticated upload route. The previous public GitHub handoff predates this increment; this document is saved with the private deployed source.
