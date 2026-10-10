# ADPA policyholder dashboard — implementation and pilot handoff

Route `/policyholder`. Integrated with the existing private Vinext Site and claim store. No migration or seeded client data. Existing React/Vite GitHub main app is not overwritten.

## Client experience

- Claim snapshot in plain language: current stage, what is happening, next milestone, next expected update, who/what ADPA is waiting on.
- Open client requests, requested dates, instructions, status and ADPA resolution notes. Clients can submit notes and source-linked evidence for review. Submission does not complete a request or authorize settlement.
- Separate carrier-approved, payment-issued and payment-received figures for explicitly reviewed non-overlapping groups, with original source, locator, factual basis and as-of date. Unknown remains blank; there is no combined demand, net settlement or amount-owed calculation. Changed/missing financial originals hide figures pending refresh.
- Property and contents progress as ADPA-reported updates; no automatic completion inferred from estimates, uploads or invoices.
- Assigned client-facing contacts with approved email/phone links.
- Shared originals plus the client's own uploads. Supported photos, PDFs, documents, audio and video up to 30 MB each. Upload preserves evidence; no automatic transcription, pricing or carrier submission is implied.
- Claim-workspace messages. A client's messages and task responses are private to that invitation and ADPA; ADPA replies are explicitly shared with all invited clients on this claim. No email/push alerts or live chat service implemented.
- Assigned policyholders who visit the main app are routed to this dashboard. Other existing users keep the prior homepage.
- Responsive navy/teal interface with keyboard focus, readable status feedback, empty states, busy/error handling, navigation/unload draft guards and multi-file upload results.

## ADPA owner controls

- Select a saved claim. Only the exact pilot ADPA owner can manage dashboard sharing for owner-held claims.
- Curate and explicitly publish client updates, financial groups, requests, work summaries, contacts and selected original files. Internal review note stays private; other internal claim records are not exported to client payloads.
- Header facts and update content are saved as published snapshots; internal changes do not silently become shared updates.
- Draft preview and publication review acknowledgment. Publication sends no email, creates no professional approval and releases no carrier package.
- Email-bound dashboard invitations, account pinning on acceptance and revocation. Re-invitation creates a new identity grant: old private client uploads/messages are not silently inherited.
- Requests with client responses keep original wording and remain in the record; complete or cancel them with a reason. Client messages/responses carry server-assigned authors/timestamps. Publication history and action audits are bounded.
- Original files remain in owner claim storage. Client uploads are available to ADPA and the uploading invitation, then only to others if ADPA explicitly shares them.
- Client submissions and unanswered messages enter the existing morning review queue. Client originals needing pricing triage also appear for owner review.

## Security and isolation

- Signed-in identity plus exact active claim invitation is required; URL knowledge grants no access.
- Pending invitations reveal no claim address, published content or documents. Clients cannot publish, invite, revoke, modify money ledgers, change estimates or grant approval authority.
- Owner and client API projections are explicit; client responses omit policy numbers, internal drafts, approval state, private notes, raw storage keys, other invitations and internal audit IDs.
- Document reads recheck active grant, acceptance and current selected-file/uploader visibility on every request. Unsharing or revocation withdraws future access immediately; copies already downloaded cannot be recalled.
- Uploads enforce source origin, accepted grant, current claim version, supported MIME and 30 MB limit. Immutable originals are SHA-deduplicated without exposing or granting access to matching private originals.
- D1 transactional insert/version update, optimistic concurrency and evidence count/latest-time CAS guard save/review races.
- General claim writes and imports cannot forge clientPortal access, publication or response fields.
- Portal communications/sharing do not alter valuation/payment/approval facts. Portal-only changes are excluded from existing package/authority material fingerprints because portal records are not package sections. Actual claim fact changes and new evidence still require ordinary review/reassembly; Preparation remains conservatively version bound.

## Remaining production/access work

- Existing owner-private Site audience is preserved. A dashboard invitation does not grant platform Site access. External policyholders need separately approved Site access before they can sign in. No clients were invited or emailed by this build.
- Shared update drafts are initially empty: Angelo must select a claim, curate real verified updates, publish, and invite the correct client. No invented settlement or payment numbers were published.
- Dashboard acknowledgment is not a representation contract, identity step-up, electronic signature, settlement authorization or payment release.
- Banking, DocuSign, Xactimate and automatic AI/audio/video pricing are unchanged and not activated by this dashboard.
- Browser/device visual QA is unavailable in the managed Sites environment without the permitted control-browser capability. No preview server or alternate browser path used. No live policyholder accounts or financial transactions tested.

## Verification

95 automated tests passed, including 13 dashboard tests covering grant/account binding, private projections, role rejection, source validation/staleness, request preservation, invitation-scoped data, package fingerprint separation, morning review integration, revocation, unsharing and uploads. TypeScript and production build results recorded in the delivery message. Private GitHub backup branch and hosted source commit accompany publication.
