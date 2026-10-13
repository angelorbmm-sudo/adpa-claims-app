# Inventory submission and follow-up tracking

## Finished scope
The owner-only tracker appears beside inventory export/contact review in Evidence & Pricing and Contents Care. Its next actions feed the existing morning dashboard through /api/morning. The pricing link opens the tracker panel directly.

### Sending records
- A saved/downloaded email is still only a prepared draft. It does not create a submission or carrier acknowledgment.
- Record an actual external send manually, with date/time, the sending basis, an optional private sent-copy/receipt original and an internal follow-up date.
- The submission binds the exact saved draft, recipient, claim number, subject, body, export ID, original package fingerprint and two attachment digests. The underlying private PDF/XLSX bytes are verified before recording.
- Historical reporting is allowed after later correspondence or receipt uploads have changed current records. Reporting an earlier send never changes its original recipient or package into current facts.
- Label is always Manually reported sent. No provider-confirmed acceptance/delivery is invented. Duplicate draft reports, future send times, send times before preparation, foreign drafts and changed attachments fail.
- Current Contact & inventory email views show the derived manual-report status without rewriting the immutable draft.

### Carrier response review
- Explicitly link a saved claim communication excerpt or private uploaded reply original to the chosen submission. Record actual received time, locator and exact quote; check claim/thread identity and the original, including forwarded-message context.
- Text and decoded .eml quotes must occur in the selected source. Other binary originals require manual source review, not automatic extraction.
- Preserve exact claim-text path/text or file metadata plus SHA-256 digest. Recheck sources when reviewing and preparing/downloading follow-ups.
- Text hints identify possible acknowledgment, missing information, dispute or ongoing review. They are explicitly unverified suggestions. They never automatically classify a carrier response or decide coverage/payment.
- Human review records response type, carrier position, requested documents/disputed item references, next action, waiting party and internal follow-up date. Revision history is retained.
- Latest carrier position follows actual received chronology, not the order a reviewer works on replies. Reviewing an older reply cannot replace a newer carrier position.
- New or changed replies require review and invalidate earlier manual plans. Missing/changed sources remain historical. Explicitly exclude mistakenly linked/superseded replies with a reason; the quote and history remain visible so broken historical sources cannot permanently trap the workflow.
- Free-text requested/disputed item references are reviewer records, not automated inventory line matching or financial revisions.

### Daily actions and follow-ups
- Status: Awaiting acknowledgment / ADPA needs to review reply / ADPA needs to respond / Awaiting carrier response / Follow-up due.
- Pacific calendar dates are used for morning attention. Follow-up dates are internal reminders; no statutory/policy deadline or carrier commitment is inferred.
- Reviewed response actions and due follow-ups feed existing morning attention/waiting lists. New source/reply facts invalidate prior dashboard waiting overrides through the action snapshot.
- Fill an editable claim-specific follow-up for review. Current assigned adjuster confirmation and exact historical claim number are required. Unreviewed/stale active replies block preparation. Verified-answer placeholders must be completed.
- Save an unsent follow-up draft; copy wording or download a .eml (no automatic attachments). Current assignment/response/plan changes block draft download. A later reminder becoming due does not, by itself, change the historical facts.
- Manually report actual follow-up sending, optionally with a sent copy, and schedule the next internal reminder. A historical follow-up report cannot overwrite a newer carrier reply or plan.
- Explicitly close/void/reopen tracking with a reason. Closing is an operational tracker decision, not a settlement, coverage acceptance or payment confirmation.
- No inventory, price, bucket, payment or fee amount is modified by any tracking operation.

## Activation and limitations
No external email was sent during implementation. Automatic inbox synchronization and provider sending/receipt verification remain José’s integration work. This release reviews records already saved/uploaded in ADPA. The connected ChatGPT mailbox is not automatically the application’s mailbox. Future integration must bind genuine provider receipts to exact reviewed drafts/attachments, distinguish acceptance from delivery, use idempotency/reconciliation, and retain explicit final sending authorization.

Tracker storage uses existing claim JSON with bounds: 50 submissions, 50 replies per submission, 30 review revisions per reply, 50 follow-up drafts and 200 recent audit entries. Existing source-size/claim-size limits apply; private source and export downloads retain their existing authorization. This bounded operational history is not advertised as an unlimited or certified legal archive.

## Files and validation
- lib/inventory-submissions.ts: strict inputs, source-state checks, chronology, status, hints and follow-up template.
- app/api/inventory-submissions/route.ts: private reads, explicit manual reporting/reply review/next actions, source digests, guarded writes and unsent .eml download.
- components/inventory-submissions.tsx / .css: responsive tracker and review forms.
- lib/morning.ts: linked morning actions.
- lib/adjuster-contact.ts: shared current-assignment check; derived tracker data excluded from rescanning itself.
- db/authority.ts: ordinary claim writes cannot forge submissions, follow-up drafts or tracker audits.
- No new migrations or runtime secrets.

344 automated tests passed, including ambiguous recipient handling from the prior module, byte-bound submitted packages, truthfully manual status, dates/confirmation/origin/version/ownership guards, source-backed reply review and dismissal, morning priorities, chronological carrier positions, stale drafts/plans, concurrent claim changes and historical follow-up reports. TypeScript passed. Production build must pass during packaging. No managed browser capability was available; live browser/phone walkthrough remains outstanding. Synthetic fixtures only; real claims were not altered or exported.
