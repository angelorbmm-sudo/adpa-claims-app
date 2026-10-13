# Inspection questions and ADPA answers review — 2026-10-13

## Changes
Answer and resolution actions require the exact question revision opened by the actor and an explicit source-review confirmation. Revision derives from the immutable answer count plus resolution status. A refreshed job version cannot silently authorize an older answer or company resolution draft after ADPA adds a newer answer. Missing revision/confirmation fails closed; older open clients must refresh.

ADPA answers append without overwriting earlier guidance. Company resolution stores the reviewed answer count, linking the decision to the current thread. Legacy resolutions without that linkage remain marked unknown rather than inventing a reviewed answer count. Only connected ADPA can answer; only the originating company’s approved manager can resolve after an answer. Existing ordinary-task completion cannot bypass this workflow.

Before sending, answering or resolving, every inspection source is checked for current permission, metadata, storage availability, actual byte length and SHA-256. Company-asset guards include revision. Existing exact claim/engagement, participant versions, corrected-inspection pause and explicit ADPA sharing rules remain enforced.

The UI labels Latest ADPA answer and Earlier ADPA answer. Answer and resolution forms begin unchecked, reset confirmation after text edits and require deliberate review of current originals and the latest thread. Draft notes retain their opened revision; thread changes disable saving while preserving notes. Global Copy/Clear unsaved question notes controls remain available when a form pauses or disappears. Inspection draft notes remain separate. The latest answer count is shown on new company resolutions.

## Validation
438 automated tests passed, including outdated resolution after a newer answer despite job refresh, outdated ADPA draft, missing revision/confirmation, missing/corrupt source bytes across send/answer/resolve and other-company thread isolation. Existing suites cover corrected inspections, withdrawn sharing, changed engagement, immutable answer history, morning-queue integration and generic completion bypass. TypeScript and production build must pass during packaging. Live browser/phone walkthrough is deferred.

## Boundaries
Questions and answers are shared factual guidance, not insurance coverage, prices, safety clearance, work authorization or settlement approval. No automatic email/SMS or new claim-side scope/financial records are created. Private claim strategy remains in separate ADPA records. Production provider/AI activation and Peter’s estimating input remain pending. General network-response idempotency and the existing parent refresh-after-save UX remain separate follow-up work; revision guards prevent stale retries.

Next chronological review: water mitigation workspace and company dashboard, using Arman’s documentation requirements and current source-linked records.
