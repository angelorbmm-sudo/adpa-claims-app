# Integration checklist for the target app

## Server and storage

- Map the current authenticated server principal to the owner key. Deny unauthenticated reads/writes and cross-account IDs. Do not infer household/company sharing from participant labels or HomeBack/ADPA branding.
- Maintain the account row's state JSON, version and update time. Replace SQLite/D1 calls with PostgreSQL transactions/conditional updates that write only when the expected owner/version matches. A conflict returns 409 and retains the draft until the client reloads.
- Preserve record kinds `property`, `item`, `receipt`, `offer`, `rebuild`, `policy`, `assessment`, `itel`, `service`, `operation`, `divisionPlan`, `divisionItem` and actions `save`, `remove`, `task`, `snapshot`, `divisionResponse`.
- Keep optional snapshots/taskReviews and backward-compatible receipt fields. Division item snapshots, server-managed responses and response history are retained in the JSON; ordinary save inputs must not inject agreement state.
- Preserve origin validation, no-store/private responses, validation, source-link protocol restrictions, request/account/record/history limits, dependent-delete guards, audit and capacity checks.
- Newer UI components import both domain modules. `RecordKind` expands when the division schemas are included; adapt the target's exhaustive switches accordingly.

## UI and domain acceptance

1. Create two unrelated accounts and two properties. Confirm that reads, writes, exports, receipt links, material links and plan references stay within the authorized owner/property.
2. Save from two sessions at the same version. Confirm that the second write is rejected without overwriting the first.
3. Open an older account with no snapshots/taskReviews and receipts without warranty/return fields. Verify read/edit/defaults and round-trip preservation of unrelated data.
4. Create documentation gaps, add reviewed evidence or alternative-proof notes, and verify task status/owner labels without sending a message.
5. Link a receipt to an item. Record refunds and verify net spending remains separate from inventory replacement values. Reject duplicates, excessive returns/refunds and invalid dates.
6. In Purchase Organizer, check Pacific dates at today, day 30 and day 31; past and unconfirmed dates; missing purchase records; returned items; and safe HTTPS receipt/manual links. No automatic notifications should be implied.
7. Create a division plan with distinct labels, select a contents/equipment item, and allocate integer quantities. Reject duplicate selection, cross-property IDs, building materials and totals above inventory quantity.
8. Leave a proposed division value blank, then enter one with a date/source. Verify unknown-value counts and confirm that original replacement valuation and quantity remain unchanged.
9. Record A and B responses independently with source/date. Confirm one assent is not agreement, disagreement makes Disputed, and unassigned units remain Undecided.
10. Change allocation/value/notes, participant labels and relevant inventory details. Verify response history is retained, current responses are cleared and stale inventory proposals are excluded from totals until refreshed. Verify history limits reject further writes rather than dropping evidence.
11. Export the selected division plan and receipt CSV. Check quoting, newlines, formula neutralization, separate response provenance and no foreign-plan data. JSON export must retain response history.
12. Verify dependent deletion/movement guards and the explicit removal warning. Removing a proposal must retain the source inventory item.
13. Confirm Good/Better/Best circumstances and partner eligibility commitments; confirm ADPA's separate authority/data access.

## Before target deployment

- Run the 35 standalone tests plus the target app's build/type checks and any adapter tests needed for real PostgreSQL transactions.
- Perform browser/mobile/keyboard/accessibility and long-label QA in staging. Screenshots or illustrative concepts do not substitute for these checks.
- Validate private access and retention against a staging dataset before migrating existing records.
- Keep live commerce, OCR, reminders and participant authentication/signatures explicitly separate until those integrations are implemented and verified.

Merging the reference-code PR is a review handoff, not evidence that the target application is integrated or deployed.
