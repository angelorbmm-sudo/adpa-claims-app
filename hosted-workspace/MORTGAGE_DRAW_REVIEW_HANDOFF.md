# Mortgage and draws review — 2026-10-13

Module 39 cleanup completed.

- The draw summary includes only current source-backed, nonvoided draw-only release amounts. Duplicate normalized servicer/release references hold every overlapping release out; cumulative statements remain unresolved rather than additive totals.
- Requested, approved, released and reported-held figures remain separate. Approval and release statuses alone do not establish amounts. Confirmed zero remains distinct from unknown. No held balance is reduced automatically and no payment ledger or contents value changes.
- Recorded requests, servicer approvals and actual releases have their own reviewed evidence, locators and metadata snapshots. Actual release requires a date, reference, servicer, payee and draw-only amount basis. Differences above a related recorded figure require an explanation.
- Servicer-held balances and monitored/non-monitored decisions need current statement/instruction support and as-of dates. No universal servicing threshold is inferred. Unsupported no-mortgage/positive-held combinations are rejected.
- Open servicing/draw records retain reviewers, next actions and follow-up dates. Corrections append history; voiding retains a reason. Server audit records preserve actor/time and before/after mortgage/draw facts without accepting caller-forged audits.
- Mortgage/draw forms have Copy, clear/cancel and record-replacement protection. Unrecorded entries pause claim saving. The shared native asynchronous recovery handlers capture their form before awaiting work so reset remains valid after event dispatch. New history entries omit recursively copied prior history.
- Internal packages now retain mortgage review and draw records. Preparation and authority review show unresolved servicing/release gaps. These records describe manual evidence review; no bank connection, transaction or actual receipt is inferred.

Validation: preparation suite, TypeScript, served-script syntax and production build. Live browser/mobile and banker/Angelo walkthroughs remain pending; Jose integrations are separate.

Ledger: 26 of 52 reviewed; 26 remain. Next workflow: agreement library and signature packets.
