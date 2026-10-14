# Package approval connection and release handoff review — 2026-10-14

Area 47 reviewed. Ledger: 34 of 52 areas reviewed, 18 remaining. Next: carrier submission and follow-up handoff review.

## Completed

- Connecting a saved assembly requires its exact opened snapshot SHA-256 and saved source fingerprint. Server ownership, claim association, source currency and current attachment checks are independent of the browser's display state.
- Current schema-2 package originals are reread, metadata/source identity checked and SHA-256 matched to their saved assembly proofs. Missing, changed or legacy originals make the assembly unavailable for connection and further operational/licensed/client review. Source errors are visible as blockers.
- Verified attachment leases participate in the authority API's final object recheck. The existing atomic metadata/snapshot guard now also checks exact claim state, name and address, protecting against edits made without increasing the row revision.
- Requested and active assemblies are prioritized for the bounded 60 MB original-verification budget; repeated evidence is read once per request. Public assembly choices contain only IDs, fingerprints, stale status and source errors; private storage keys, raw snapshots and object leases are not returned.
- Approval disclosure entries remain intact on errors and status refreshes, with explicit discard and navigation protection. Parent package selection/assembly/preview changes are held while disclosures are unrecorded or a connection is pending. Synchronous busy guards and selection checks prevent overlapping requests and cross-selection response application.
- Confirmed connections clear only submitted disclosures. Failure to refresh the parent afterward is reported as a saved connection with a refresh problem. Rejected actions retain disclosure entries and do not trigger a saved callback.
- Existing review ordering, holds, supersession, withdrawal and release denial remain intact. The bridge records a connection for review; it does not authorize or send a carrier submission.

## Verification

604 automated tests passed, including eight new bridge checks for exact opened hashes, changed and missing originals, final R2 lease races, same-version claim changes, private-data exclusion, legacy snapshots and saved-versus-refresh-failed outcomes. TypeScript passed. Production build is included in publication packaging.

## Remaining verification

Browser/mobile walkthrough remains pending because the supported browser QA capability is unavailable here. Independent licensed/client signer verification, provider e-signing and secure release integrations remain pending. Release remains blocked. No outbound message, signature request or money transfer was sent. The app stays owner-private.
