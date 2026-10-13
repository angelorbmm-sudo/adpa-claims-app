# Initial contractor inspection review — 2026-10-13

## Changes
Each selected inspection original now requires its exact opened source proof: evidence ID, SHA-256, original creation timestamp and revision. The proof set must match selected source IDs exactly. Refreshing a job cannot silently attach a changed original to an older inspection draft. Storage presence, full-byte digest and byte length are checked before recording the inspection; guarded company-asset writes include upload revision. Missing proof fails closed, so older open clients need a page refresh.

Corrections remain append-only and can target only a company’s own latest record in a correction chain. A second branch from an already corrected observation is rejected even with a refreshed job version. Previous measured facts remain immutable. The correction form preserves the original observation time and precision in the device-local editor instead of substituting the current time. A reviewer may explicitly fix an incorrect observation time; the correction’s saved timestamp is separate.

Questions attached to superseded inspections are paused for handoff. Send/answer/resolve actions for those older records are blocked, and prior answers remain in retained history. The newer inspection can send its own question through existing engagement and per-file sharing gates. No old answer is silently applied to corrected facts.

Current records display first; All retained history reveals earlier authorized observations. Drafts capture source proofs and flag changed selections or competing corrections while retaining edits. Users can copy clearly labeled unsaved notes and clear the draft. Source selection excludes unavailable proof; a changed selection must be removed and deliberately reselected after examining the current original. Existing navigation protection now covers internal links as well as page unloads.

Current authorized inspection source links include source proof needed by the correction form. Withdrawn/unavailable originals remain omitted; actor IDs and private storage keys remain withheld. This supersedes the earlier handoff’s blanket statement that no fingerprints are returned: authorized current-source fingerprints are now explicitly supplied for version binding.

## Validation
433 automated tests passed, including exact selected source versions after a refreshed job, missing/duplicate/foreign proof sets, missing/corrupt source bytes, nonbranching correction chains, superseded-question handoff and observation-time precision. Existing tests cover measured/unmeasured facts, source consent, other companies’ correction rejection and ADPA engagement. TypeScript and production build must pass during packaging. Browser/phone walkthrough remains deferred.

## Boundaries
This module records reported observations and measurements; it does not infer area/volume, hidden damage, safety clearance, prices, coverage or Xactimate quantities. Peter’s estimating input and real field validation remain pending. No automatic external notifications are added. Existing parent refresh-after-save UX and general network-response idempotency remain separate follow-up work.

Next chronological review: inspection questions to ADPA, focusing on answer/resolution revision checks and request clarity.
