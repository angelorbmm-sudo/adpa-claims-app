# Company communication delivery adapters — canonical area 51

Completed 2026-10-14. Canonical code review coverage is 51/52; area 52 Permissions/persistence/version history is the remaining dedicated pass. This is review coverage, not launch readiness.

Outgoing email receipts are checked against the exact provider ID, one recipient, configured sender, saved subject/body and opaque SHA-256 company/message tags. Missing or mismatched evidence cannot promote a record to delivered. SMS receipts require the exact SID, original company account/messaging service, recipient and recorded outbound body. Account/service snapshots and outbound body are retained with the reservation. Unknown provider statuses are rejected. Known nonfinal events cannot downgrade an already verified delivered message; explicit delivery failures remain visible.

Email attachments and service agreement templates must match their retained size and SHA-256 digest before reservation. Templates also require the PDF header. Selected asset ownership, name/MIME/size/digest/key/revision and client binding are checked atomically with client and company state/version. Immediately before provider dispatch, company access/state and the exact reserved client are rechecked. Receipt commits compare exact reserved state and version so concurrent notes remain intact. If a receipt cannot be saved, the reservation remains for provider reconciliation and is never automatically replayed.

Unsupported channels, email subject control characters and text attachments are rejected by the adapter. Existing recorded consent, company-scoped configuration, allowed provider hosts, idempotency, uncertain-outcome reservation, signing recipient/custom-field/account checks and retained signed PDF/certificate gates remain in place.

Legacy email receipts without the new company/message tags and legacy SMS reservations lacking the original account/service/body proof cannot be newly verified by the stricter adapter. Preserve those records and investigate with the original provider account; do not blindly resend. Existing statuses are not silently changed by this review.

Validation: all 737 automated tests passed; TypeScript and production build passed. Seven new regressions cover exact email receipt fields/tags, SMS account/service/body, attachment/template byte changes, asset races at reservation, receipt commits preserving concurrent notes, invalid outbound channels/headers/attachments and monotonic delivered status. Synthetic fixtures now use truthful original size/digest and documented provider response fields. All provider calls in tests are mocked; no real emails, texts or contracts were dispatched.

API references checked: https://resend.com/docs/api-reference/emails/retrieve-email and https://www.twilio.com/docs/messaging/api/message-resource. These support receipt fields; they do not prove a real configured account or live delivery.

Browser/iPhone, native email-client, real multi-user/provider walkthroughs and José’s channel activation remain pending. Specialist review, security/recovery/performance validation and controlled pilot remain separate release gates.
