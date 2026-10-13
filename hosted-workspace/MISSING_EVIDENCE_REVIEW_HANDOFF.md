# Source-linked missing-evidence request review — 2026-10-13

## Delivered
Response, review-start, review, cancellation and reopening actions require the request revision opened by the actor. Revision derives from the full response/review history, independent of source-redacted history. A refreshed job cannot authorize an older form against a newer workflow state. Missing revision fails closed; previously open clients must refresh.

A response submission requires the exact selected original proof (SHA-256, creation timestamp and revision). Changing an original after file selection cannot silently attach the replacement to old notes. Source and response byte length/digest are checked before response/review actions, along with existing current metadata, sharing, participation and version guards. Cancellation remains possible without reading withdrawn originals.

The review outcome starts unselected. The requester must choose Complete or More evidence needed and record a source-checked explanation. A requester can reopen a completed request with a reason, current source/response access and explicit source check. Reopening retains every response and prior decision and returns the item to Requested for its assignee. Other participants cannot reopen the requester’s decision. It does not reopen or approve an insurance claim.

Unsaved request/response notes capture their opened request revision and selected response proof. Changed versions disable submission and retain notes. Copy/clear controls remain available even when the original form disappears or pauses. Company/job context changes create a fresh checklist editor. Due/assignment/confirmation changes now count as unsaved; changing the due date clears confirmation. Due dates are labeled internal follow-ups rather than legal/carrier deadlines.

Review history is bounded at 100 entries/request within the existing response/job-state limits. Existing duplicate request, per-file sharing, ADPA engagement and source-revocation protections remain active. Linking a response does not share the file or grant participation.

## Validation
427 automated tests passed, including stale review after a refreshed job, missing revision, response original changes after selection, changed response bytes despite unchanged metadata, deliberate completion, requester-only reopening, retained history, returned assignee action and response-consent loss. Existing suites cover private notes, response correction, foreign participants, due dates and source-linked draft reuse. TypeScript and production build must pass during packaging. Live browser/phone walkthrough is deferred.

## Limits
No automatic email/text delivery, audio/video interpretation, claim-completeness certification, legal deadline inference, coverage determination, pricing or settlement approval is added. Production AI/provider activation awaits Jose. The existing parent mutation handler can still show a refresh error after a committed action; revision/version guards prevent stale retries. General network-response idempotency and platform-wide refresh UX remain separate follow-up work.

Next chronological review area: initial contractor inspection and its source-backed handoff, with Peter’s estimating input still pending.
