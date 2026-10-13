# Reviewed drafts to existing claim modules — October 13, 2026

## Delivered

The shared Evidence Inbox's Draft scope & contents items panel now includes Send reviewed drafts to ADPA's scope / contents workflow. The source creator selects a reviewed draft, explicitly confirms the connected claim/address and destination, and sends it. Contents drafts target Contents inventory; scope drafts target Mitigation scope or Reconstruction scope. Every source original must already be shared with ADPA under the current separate engagement.

Sending creates a Pending incoming item in the exact connected claim and a source-job receipt. No quantity, scope line, price or final inventory entry is inserted merely by sending. Duplicate sends of the same reviewed snapshot are idempotent. Unknown quantities may enter intake for review but block acceptance.

ADPA has an Incoming evidence drafts queue in the existing Water Scope Studio (both mitigation/reconstruction) and Contents Care Studio. Only the licensed firm's configured ADPA owner account can accept or return items. The queue identifies the originating company/role, actual destination, source quantities/specifications and a link to the source job.

On acceptance ADPA checks every source, confirms room mapping, a unique physical tag/work group, and the primary locator, and records a review note. A positive documented quantity, unit, basis and source locator are required. Contents count must be whole and EA/each. Scope units must match source units; no conversion is automatic. PDF quantity sources need a physical page locator.

- Contents acceptance creates a Contents Care inventory draft with disposition Needs review, no invented brand/model, no price and no cleaning/disposal approval.
- Scope acceptance creates a Water Scope Studio Draft line in the selected Mitigation/Reconstruction phase with price, price basis and necessity still blank. A new explicitly named room may be created with unknown dimensions, or an existing room is selected. Duplicate room names and existing physical work groups block acceptance.
- Retained originals and provenance are attached to the working item. draftTransferSources stores the exact source draft, originating role, all original IDs/locators, quantity-source mapping and identity/specifications. Full source identity remains available without guessing separate brand/model fields.
- Returning an incomplete item with a reason reopens the originating draft for correction and records both source and destination history.

## Authorization and integrity

Only the creating role sends its own reviewed draft. Source company membership, approved job participation, per-file consent, ADPA representation, draft fingerprint, job version and destination claim version are checked. Claim selection is resolved only from the verified shared-job ADPA engagement, never an arbitrary name or client-supplied claim ID. Other companies cannot accept an item into ADPA's claim.

Acceptance verifies actual SHA-256 source bytes and existing retained originals. Originals are retained under deterministic claim evidence IDs and existing imports are reused only with consistent provenance. Atomic D1 updates guard the destination claim, source receipt, evidence inserts, engagement record and loaded company/file versions. Failed concurrent changes insert no working item/receipt/evidence row; private unreferenced R2 copies may need later cleanup.

Pending items pause when consent, sources, draft snapshot or representation changes. Accepted working records and retained copies are part of the separately retained ADPA claim; later sharing revocation cannot recall those copies. This matches the existing explicit import warning.

## Boundaries

Destination studios currently belong to ADPA's claim workspace. This task does not create company specialist assignments, change assigned company fileIds/careIds/lineIds, or grant a contractor access to ADPA's complete claim. The existing separate assignment/sharing workflow can subsequently assign the imported working records. Generic contractors are not silently routed into mitigation-company permissions.

No carrier package release, settlement, payment, final price, Xactimate export, external email/text or AI service activation occurs. The intake queue is capped at 100 entries/claim; source and claim serialized state limits remain in force. Existing whole-count / price / restoration-readiness checks still apply to the resulting working records.

## Verification

304 automated tests pass, including contents and reconstruction acceptance, source-linked retention, unknown quantity return, units, duplicate tags, creator/ADPA roles, stale versions, revoked consent, altered bytes and atomic concurrency. TypeScript and production build checked for the published source. Live browser/phone QA remains deferred because supported browser tooling is unavailable here.
