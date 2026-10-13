# ADPA adjuster contact and inventory email handoff

## Completed workflow
- Owner-only contact center in both Evidence & Pricing and Contents Care, beside inventory exports.
- Scan strings throughout saved claim state, including communication transcripts and contact/profile fields. Generated contact/email records and export history are excluded from scanning themselves.
- Scan private uploaded text/plain and RFC822 .eml originals. PostalMime decodes MIME headers and encoded bodies. HTML is reduced to plain evidence text without rendering or network retrieval. Embedded attachments require separate document extraction; sender/recipient addresses remain unverified leads.
- Preserve all possible contacts, including forwarded and former adjusters. Likely adjuster leads display first; no silent current-adjuster selection, inferred name or auto-send.
- Source reference, locator, excerpt, original metadata and SHA-256 digest support each file lead. Claim-text leads retain their exact source path/text. Contact scans report files skipped because of format, size or availability.
- Confirm name, phone, current assignment basis and original source after explicit review. Email cannot be freely substituted: record a separate source-backed lead if it differs.
- Active assignment becomes stale when correspondence, carrier/claim number or the evidence list/metadata changes. Recheck the current assignment against the correct claim.
- Original file bytes are rechecked at confirmation, email preparation and draft download. Claim version and evidence metadata are guarded in the final database update.
- Generate a neutral editable inventory-submission email. Claim number is mandatory in the subject. No legal/coverage/payment promises are generated.
- Save a reviewed draft tied to the exact confirmed recipient and current reviewed inventory export. Both PDF/XLSX private bytes are hashed at preparation and rechecked at download.
- Download an RFC822 .eml with both actual attachments, or copy wording and manually attach inventory exports. X-Unsent: 1 marks the downloaded message as a draft; email-client opening behavior varies, so review recipient/from/attachments before sending.
- Saved draft history truthfully says Prepared — not sent. No delivery receipt, sent communication or automatic email is recorded. Evidence originals remain references in the PDF/workbook rather than bundled attachments.
- Changed inventory/claim identity/claim number/contact, missing files or altered export bytes block current draft download; create a new reviewed draft.
- Ordinary claim writes cannot forge contact confirmations or email draft history. No new migrations.

## AI activation
- Strict structured-output OpenAI contact extraction adapter for selected PDF/JPEG/PNG/WebP/text originals: up to 3 files / 12 MB, 10 batches per claim per hour.
- Uses existing server OPENAI_API_KEY and OPENAI_MODEL (default gpt-4.1). Documents/filenames are untrusted evidence. No tools, sending or assignment decisions. Exact cited email must appear in the extracted quote and source must be in the batch. Human original review remains required, including all AI-inferred names/roles/locators.
- Production currently lacks AI credentials. The UI explicitly reports this. Manual review and text/.eml scanning work without AI keys.
- Binary DOCX/XLSX, audio/video and Matterport are not automatically parsed by this feature. Supply a text transcript/conversion, use a supported AI batch once activated, or manually cite and check the original. Do not claim every uploaded file was analyzed.

## Email activation
Automatic app delivery remains unconfigured. No external messages were sent during development. José must activate an authenticated outbound service and add a durable dispatch/reconciliation flow before a send button is offered. A later sending integration must use the exact reviewed draft/recipient and immutable attachment hashes, explicit final user authorization, idempotent send, provider acceptance/delivery distinction and an auditable receipt. ChatGPT's connected mailbox is not automatically an application server integration.

## Validation
329 automated tests passed, including old/current-contact ambiguity, decoded .eml, exact PDF/XLSX attachment bytes, altered attachment rejection, stale correspondence, ownership/origin/version guards, source digest mismatch, missing AI activation, structured AI validation and header injection. TypeScript and production build checks required before deployment. No managed browser capability was available; live browser/phone walkthrough remains a separate verification step. Only synthetic test claims were used; existing real claims were not changed or exported.
