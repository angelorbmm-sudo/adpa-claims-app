# Evidence-linked building and contents draft review — 2026-10-13

## Changes
Draft edits, submission, handoff review and dismissal require the draft revision the actor opened. The revision is the full retained history count, independent of source-redacted history shown in a projection. A refreshed job version cannot authorize overwriting a newer draft correction or decision. Missing revision fails closed; older open clients must refresh.

Each selected additional original requires its exact source proof: evidence ID, SHA-256, original creation timestamp and revision. The proof set must match the selected IDs exactly, and every original must still be current and authorized for the selected role. A replacement original after a job refresh cannot silently support old edits. Existing primary/response proofs, consent, quantity basis and immutable history protections remain in force.

The editor captures the opened draft revision and selected supporting-file proofs. Newer revisions or changed/withdrawn sources disable saving while retaining local edits. Copy unsaved draft notes provides a clearly labeled reference for manual reconciliation. Close/discard sits outside the disabled form, so a paused or disappeared draft does not trap the editor. Reopening the current draft is deliberate. Company/job context changes create a fresh editor.

Authorized drafts are searchable by description, kind, building/floor/room, physical-item label and inventory tag, with a result count and empty-filter guidance. Physical references appear on draft cards. Existing role filters remain.

## Validation
422 automated tests passed, including refreshed-job stale overwrite attempts across draft actions, exact supporting-original proof sets, changed source revision after selection, missing revision, and revision counts independent of source-redacted history. Existing tests cover duplicate physical contents drafts, current source consent, quantity/source/unit/locator requirements, corrections, ADPA engagement and downstream transfer. TypeScript and production build must pass during packaging. Live browser/phone testing remains deferred.

## Boundaries
Drafts retain unknown measurements and identity. They do not automatically add final inventory counts, prices, estimate charges or Xactimate entries. The existing separate transfer workflow requires reviewed drafts, connected claim, file sharing, destination mapping and ADPA acceptance. No new provider delivery, automatic pricing or audio/video/Matterport examination is introduced. Production AI and provider integrations await Jose.

The existing parent save handler can still report a refresh error after a successful mutation; job and draft revision guards prevent stale retries from overwriting the committed record. General network-response idempotency and platform-wide refresh UX are separate follow-up work.

Next chronological review area: Missing Evidence / Missing Information, focusing on the source-linked request workflow (the consolidated checklist has already received a prior cleanup).
