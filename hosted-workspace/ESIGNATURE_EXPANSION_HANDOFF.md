# Expanded e-signature workflows — José activation handoff

## Implemented now

Company clients have a **Signing center** alongside their existing service-contract workflow. The platform supports every company industry using company-scoped agreements, while the ADPA representation type is restricted to the ADPA owner.

- Prepare a reviewed, unsent request using up to five existing company/client PDFs, 20 MB total.
- Include up to eight distinct signers with recorded contact/authority basis. Same order numbers permit parallel signing; differing orders create a sequence.
- Place signature, initials, automatic signing-date, editable text and acknowledgment checkbox fields on specific pages. Each signer must have a required signature. Required checkboxes use DocuSign validation groups and start unchecked.
- Save a private copy of the exact prepared PDF originals with digest, revision and source metadata. Saved requests are immutable drafts: cancel and prepare a replacement to change terms or recipients.
- Create separate service agreements, ADPA representation paperwork, amendments, change orders, contents disposition approvals, completion acknowledgments and other agreements. Follow-on approval types require a completed parent agreement; original signed contracts remain intact.
- Configure provider reminder delay/frequency and request expiration. No reminders are sent before activation.
- Send exactly once through the selected company account after explicit review. Sending is reserved before contacting DocuSign; uncertain outcomes remain **Unknown** and require a matching provider envelope receipt, never an automatic resend.
- Verify company/client/request bindings, signer identities/order, document IDs/names, planned field placement and required acknowledgment rules against provider records. Completion requires every signer, a valid signed PDF and a valid certificate. Only the first completed Service agreement updates the existing client scheduling prerequisites.
- Void a pending sent request through the provider, or cancel an unsent draft locally, with history and reason. Follow-on signatures do not automatically approve scope, payment or claim settlement.
- Retain completion PDFs and certificates in company/client storage. Download access is company-manager or named-signer scoped, not public and not granted to every job participant.
- **My signatures** is embedded in the policyholder dashboard, including before an ADPA claim invitation exists. It also has `/signing` for named company representatives and other signers. Account email must match the intended signer; first signing-session access binds that signer to the authenticated user ID. Current provider signing turn is checked before opening the secure session.
- The secure DocuSign signing view opens within the dashboard, with a new-tab fallback. A return URL or button click never marks completion; provider confirmation is required.
- Visible inboxes periodically check pending provider status after activation. Provider state changes appear in request history. A signed HMAC Connect listener handles background updates when configured; duplicate final events do not duplicate completion history.

## What José must activate and validate

1. Configure per-company DocuSign account ID, approved API base URI and API authorization through the existing secure `ADPA_COMPANY_CHANNELS_JSON` server configuration. API authorization renewal/OAuth and sender/account permissions remain provider activation work; no keys belong in client records.
2. Test in the DocuSign demo account before production: multiple PDFs, sequential/parallel signer order, every field type and placement, unchecked required acknowledgments, completed-document retrieval, certificate retention, declined/voided/expired cases and unknown-outcome reconciliation.
3. Validate hybrid embedded/remote signing and automatic reminder delivery for the selected account plan and settings. Provider configuration in source is not proof of delivery or contractual availability.
4. Configure DocuSign Connect JSON SIM notifications with HMAC. Add the selected HMAC keys to the company's `signature.connectHmacKeys` array. Listener: `/api/signing-webhook?companyId=<actual company ID>`. It verifies raw-body HMAC, provider account and current provider records; event payload status alone is never trusted.
5. The Site is still owner-private. Provide a separately authenticated server-to-server route for Connect and appropriate actual user access before live multi-user use. Do not publish the whole platform publicly merely to make a webhook reachable.
6. Test iframe/browser support and the signing return URL on iPhone, desktop and with cookies restricted. Live provider/signing/device validation is deferred; current tests use synthetic provider responses.
7. Keep existing claim-package licensed approval, stronger identity/step-up and settlement-release controls separate. This company/recipient signing feature does not activate the separate final-release gate or change representation permissions.
8. Review approved agreement language and correct signer authority for each business and use case. There is no automatic drafting of legal terms, PDF text merging, estimate approval or alteration of an already signed agreement. Review provider-side corrections against prepared originals; document snapshots, manifests and placement checks do not constitute a PDF content-equivalence analysis of externally corrected envelopes.

## Source and checks

Modules: `lib/signing.ts`, `lib/signing-provider.ts`, `/api/signing`, `/api/signing-document`, `/api/signing-webhook`, `components/signing-center.tsx`, `components/signing-inbox.tsx` and `/signing`. Existing clients and signed service contracts are preserved; expanded records use the existing versioned client state, so no new database migration is required.

263 automated tests pass, including expanded offline preparation, strict inputs, roles and company isolation, provider payload fields/reminders, exact signer/field/document validation, completion evidence, amendments, named recipient/session binding, file access, uncertain outcomes, revocation and HMAC events. TypeScript and production build are required before publication. Browser and real provider QA are not represented as completed.

Primary provider references used:
- https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/
- https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopeviews/createrecipient/
- https://www.docusign.com/blog/developers/the-trenches-hybrid-captiveremote-signing-embeddedrecipientstarturl
- https://www.docusign.com/blog/developers/dsdev-common-api-tasks-add-reminders-and-expiration-to-an-envelope
- https://www.docusign.com/blog/developers/converting-pdf-form-checkboxes-why-you-need-tab-groups
- https://developers.docusign.com/platform/webhooks/connect/validate/
