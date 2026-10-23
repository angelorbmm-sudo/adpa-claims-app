# José: implement receipt scanning in the target app

## What the user gets

In Purchase organizer: upload original → Read receipt → review/correct suggestions → match existing inventory or supply a room for a new item → confirm selected purchase lines. The original is preserved privately. Purchases are never silently created by OCR. New inventory replacement prices remain blank, and existing inventory quantities/values are not changed.

This is on-device English OCR and conservative text parsing, not a live AI/catalog integration. It needs **no OpenAI API key**. It infers neither warranty terms nor return eligibility. Unclear text, handwriting, non-English/non-USD receipts, fractional quantities and complex layouts need manual review/conversion.

## File map

| File | Responsibility |
| --- | --- |
| `lib/lifeworth-receipt-scan.ts` | Input schemas, original metadata/draft types, file signatures, text suggestions, duplicate hints, atomic domain confirmation. |
| `lib/lifeworth-receipt-ocr.ts` | Browser-only lazy loading, image/PDF reading, OCR progress, page/pixel bounds, worker cleanup. |
| `app/api/lifeworth/receipts/route.ts` | Trusted owner, upload/download, integrity checks, state versions and persistence. |
| `app/lifeworth/receipt-scanner.tsx` | File selection, original view, extraction/correction, line selection, inventory matching, human confirmation. |
| `lib/lifeworth.ts` | Optional `receiptScans`, receipt `sourceScanId`/`sourceLine` defaults, link/property-delete guards. |
| `app/lifeworth/workspace.tsx` and CSS | Parent version/state handling and Purchase Organizer placement/styles. |
| `scripts/prepare-receipt-scanner.mjs` | Build same-origin reader resources from installed packages. |
| `scripts/test.mjs`, `tests/lifeworth.test.mjs` | Standalone domain/API tests, including original uploads and confirmed purchases. |
| `scripts/test-scanner-engines.mjs` | Reproducible real-engine checks using only locally generated synthetic images/PDFs. |

## Dependencies and build

Runtime OCR/PDF dependencies are pinned in this reference package: `tesseract.js` 7.0.0, `@tesseract.js-data/eng` 1.0.0 and `pdfjs-dist` 6.4.299. The engine test additionally uses `@napi-rs/canvas` 1.0.11 and `pdf-lib` 1.17.1. Node >=22.13 is required. React/lucide-react, framework routing and authentication come from the target app.

From this directory:

```sh
npm install
npm test
npm run test:engines
npm run prepare:scanner
```

The target dev/build commands must run `node scripts/prepare-receipt-scanner.mjs` from the target app root before the framework command, and include its `public/receipt-scanner/` output in deployed static assets. Adapt paths if this reference remains nested. Do not commit node_modules or generated scanner resources. Preserve license/notice files. The private hosted source locks dependencies with pnpm; this reference package pins direct versions and must be integrated into the target app's own dependency lockfile.

The hosted package policy explicitly disables Tesseract's optional donation postinstall script (`allowBuilds.tesseract.js: false`); no install-time compilation is required for these OCR assets.

All resources load from `/receipt-scanner/` at the target origin: worker, English traineddata, three LSTM core variants, PDF module/worker, fonts, cmaps and wasm files. Do not allow an unnoticed CDN fallback. Tesseract's local ESM build exports its API as `default`; the browser adapter uses `(module.default || module).createWorker`. PDF.js 6 cleanup uses the **loading task's** `destroy()`, not the document proxy. Keep the tested versions aligned.

## Storage and identity

- Reuse the target's authenticated **server** principal for every request. Do not trust client-supplied owner IDs or treat household/company labels as authorization.
- Original bytes live in the private object store. The hosted key is derived from owner, property and SHA-256 digest, never supplied by the browser. Use an equivalent private key and conditional/immutable creation in the target storage.
- Metadata, unconfirmed draft and confirmation IDs live in optional account JSON `receiptScans`; older accounts omit it safely. No new D1 migration was needed. Adapt PostgreSQL JSON storage without dropping unfamiliar state fields.
- Preserve the account version and conditional atomic update. Confirmation may create several items and receipts but writes the complete final state only once. In normalized tables, use a single transaction and equivalent owner/version guard. Failures must not partially create purchases.
- Originals are size/signature checked and hash-verified before draft/confirmation and download. A SHA-256 digest proves byte consistency, not that a receipt is genuine.
- Limits: 8 MB/original, 100 uploaded originals/account, 3 PDF pages/scan, 50 candidate lines, 40,000 draft-text characters, plus account/record limits. Large photo/page pixel counts are bounded in the browser.
- The current increment has no original-deletion UI. Original retention prevents deleting a linked property. Do not add cleanup that deletes an original another concurrent save may reference.

## API contract

### POST `/api/lifeworth/receipts?propertyId=<id>` — upload

Send raw supported file bytes with `Content-Type`, URL-encoded `X-Filename` and integer `X-LifeWorth-Version`. Require the request's `Origin` to match. Verify the property belongs to the authenticated account. Stream and cap the body, validate the signature, compute digest, deduplicate within the property and conditionally store the original. Persist metadata through the account version guard. Return `{saved, state, version}`; repeat exact bytes return `{duplicate:true, scanId, state, version}` without incrementing the version.

### GET `/api/lifeworth/receipts?propertyId=<id>&scanId=<id>` — original

Require the authenticated owner, match both IDs, and verify size/digest before serving. Preserve `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`, content disposition and restrictive content policy. Never return public object-store URLs or embed credentials in links. The hosted app uses its HTTPS original endpoint in item/receipt source links.

### POST `/api/lifeworth/receipts` — draft JSON

`{action:"draft", version, scanId, method, text}`. Method is `Browser OCR`, `PDF text` or `Owner-entered text`. It is client-reported provenance, not independent authentication. Verify the original, then parse untrusted plain text and issue a fresh server draft ID. Store suggestions, warnings and text. Reject a confirmed original. Do not create purchases or execute receipt text.

### POST `/api/lifeworth/receipts` — confirm JSON

Require `action:"confirm"`, expected `version`, `scanId`, current `draftId`, retailer, real purchase date, receipt/order reference, `currency:"USD"`, `reviewedOriginal:true`, nonempty review/reconciliation notes, duplicate acknowledgment when needed, and selected line mappings. Each mapping references a distinct current candidate and supplies corrected description, integer quantity and paid **line total**, then either an existing authorized contents/equipment `itemId` or a room/type/model for a new item.

Verify original bytes and current draft again. Show/check potential duplicate supplier/reference or date/amount records. Existing exact receipt-line validation still blocks duplicate lines. Validate every selected line before persistence; create new unpriced/unconfirmed items only when requested. Link reviewed purchases to originals and draft source-text lines. Persist confirmation IDs/timestamp and prevent a second confirmation. No orders, payments, refunds or claim submissions occur.

Same-origin/authentication guards apply to every write. Stale account/draft/original checks return an actionable error with no partial purchase write. The client must preserve failed review inputs and offer reload/retry. OCR errors must leave the original available and allow manual text/purchase entry.

## Staging tests before target release

Run the 43 standalone tests and all three engine checks, plus adapter/transaction tests in the target database. Then verify the actual built browser UI on desktop and mobile, including same-origin static asset loading, first model download, photo and both PDF paths, page/pixel limits, progress/errors, encrypted PDFs, poor receipts, manual corrections, matching, line-total review, duplicate warnings, stale sessions and retry after a successful-but-interrupted response. Confirm no outside AI/CDN call and no automatic purchase/valuation change. Test original download after reload and with an unrelated account.

The private hosted application passed 780 tests, TypeScript and production build checks. Browser visual/end-to-end and mobile acceptance are still unverified because preview refused the connection. These engine/API results do not establish browser parity or mean the root GitHub app has been integrated.
