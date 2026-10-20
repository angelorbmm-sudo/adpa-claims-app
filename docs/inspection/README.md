# Inspection to Xactimate scope — first working increment

The inspector captures photos/video, measures the space, narrates materials and damage, then reviews repair-operation candidates. Measurements and observations belong to one room record. Reviewed quantities feed the existing Estimate Comparison module. This is the first working increment of Angelo's integrated capture-to-estimate requirement, not a complete automated Xactimate estimator or a production release.

## Implemented

- Claim navigation: **Build the claim → Inspection & Scope**.
- Multiple rooms, coverage tags, feet-based dimensions, wall opening deductions, rectangular sketch, floor/ceiling/net wall/perimeter calculations; custom quantities for partial damage and irregular geometry.
- Photo/video camera inputs, media file selection, microphone recording, optional browser speech dictation, editable reviewed transcript. Speech support depends on the browser; dictation may use its speech provider. Audio files are evidence, not automatically transcribed.
- Original bytes in IndexedDB, scoped by claim and evidence ID, SHA-256 fingerprint, previews and downloads, evidence metadata in the existing claim documents list. Re-selecting the same original restores it by fingerprint.
- Normalized scan JSON import with unit conversion, provider and capture time. Imported dimensions remain unverified. See `normalized-scan-example.json`. This format is an ADPA adapter contract, not raw Apple RoomPlan/Matterport output. Only rectangular room dimensions are implemented.
- Authenticated, organization-scoped server analysis endpoint. A configured OpenAI vision model receives room notes plus resized photos and three sampled video frames per clip. Output is schema validated and linked to allowed evidence IDs. API credentials stay on the server; no automatic provider call occurs without the inspector invoking it.
- AI observation/material/repair candidates and missing-information questions. No proprietary item codes/prices are invented. Candidates require material, repair rationale, source links, valid quantity/units, verified measurement source, a named scope reviewer, and per-line review before transfer.
- Transfer creates unpriced, Needs review comparison lines with evidence IDs, measurement snapshot, reviewer and timestamp. Repeated transfers replace that room's working lines only, require explicit confirmation, and reset pricing/review. Removed operations disappear from the working comparison after confirmed replacement. Existing manual and other-room lines remain intact. Saved inspection changes flag old transferred lines for review; claim-package staleness uses the existing application guard.

## Configure José's development environment

1. Use the repository's Node 22 environment, `npm ci`, `npm test`, and `npm run build`.
2. Run the existing authenticated PostgreSQL API and set `VITE_API_BASE_URL` to its origin.
3. Set **server-only** `OPENAI_API_KEY` and `INSPECTION_AI_MODEL` to an account-enabled model supporting image input and Responses structured output. No default model is silently chosen. No real key was available during this implementation; provider tests use an injected mock.
4. `GET /api/inspection/status` reports whether both variables exist; it does not prove provider credentials or model access work. `POST /api/inspection/:claimId/analyze` accepts a saved `roomId` and up to 12 JPEG data-URL frames referencing that room's evidence. The server reads saved notes, so save the room before analysis (the UI does this).
5. Select a room, enter dimensions/source, capture evidence and enter/dictate notes. Invoke AI when configured, edit the proposals, enter affected quantities, review each operation, and transfer. Open Estimate Comparison to inspect the working lines.

The server limits analysis payloads to 12 MB, 12 frames, JPEG data URLs, a 60-second provider timeout, one concurrent request per user and a 15-second cooldown. These in-memory limits are development controls; use shared rate/budget limits for multiple server replicas. Analysis results and source metadata are audited without data URLs. Requests use `store: false`; organizational retention and provider policy still need deployment review.

## Required integrations for the full vision

1. **Native LiDAR capture:** a supported iPhone/iPad companion/bridge using RoomPlan/ARKit (or another licensed scanner), delivering actual geometry, openings, confidence and provenance to ADPA. A browser camera input does not expose LiDAR depth. Add polygonal/multistory geometry, individual wall surfaces, slopes, openings and roof/exterior adapters; never approximate complex jobs as full rectangular rooms without field review.
2. **Secure original-media storage:** the current evidence subsystem stores metadata, and this module adds original bytes only in this browser. Bytes are not uploaded to the API or synchronized across devices. Clearing browser data loses them. Connect the existing signed-upload/quarantine pipeline, integrity verification, and secure download before production. Current AI inputs are client-provided derivatives: do not treat them as server-verified originals until that pipeline exists.
3. **Xactimate integration:** validate licensed catalog/price-list access, regional pricing, operation mapping, supported sketch/estimate import/export, assemblies, related work, deductions, minimums, taxes and estimate versions. There is no SKX/ESX writer or live Xactimate connection in this increment. New comparison lines intentionally say Pricing pending.
4. **Knowledge retrieval:** ingest the authorized Xactimate training and Peter's reviewed examples into server-side retrieval with citations and versioned rules. Their transcripts and scope corpus have not been downloaded or represented as loaded by this change. Prerequisite: Xactimate proficiency, then Peter's specialized judgment. Prompting a model is not equivalent to learning that corpus.
5. **Quality validation:** Peter's measured real rooms and scopes establish acceptable quantity accuracy and scope completeness across drywall/plaster, insulation, trim, paint, flooring, mitigation, contents and other trades. Track visible vs reported vs concealed conditions, uncertain material identification and required field checks. Do not claim a full scope from sampled video alone.
6. **HomeBack I/II:** reuse the versioned inspection records and media APIs for pre-loss baseline, loss inspection, demolition, reconstruction and completion snapshots with authorized sharing. This change touches ADPA only; no HomeBack production app has been changed.

## Verification and limitations

Automated tests cover geometry/deductions, metric conversion, malformed scans, transfer gates, unit validation, provenance, idempotent room replacement, schema-validated AI output, invented evidence rejection, provider failures, permission denial, tenant scoping, unknown sources, auditing and repeated-request throttling. Provider tests are mocked. Live device LiDAR, microphone permissions, browser speech-provider behavior and real Xactimate integration require hardware/account testing.

Official API references used during implementation:
- https://developers.openai.com/api/docs/guides/images-vision
- https://developers.openai.com/api/docs/guides/structured-outputs

Validation on this branch: 97 automated tests passed; production build passed. A headless Chromium browser check exercised room creation, measurements, photo persistence across reload, source-linked scope review, comparison transfer, and stale-source warnings. The 390px mobile viewport had no horizontal overflow and no browser JavaScript errors were recorded. Camera/microphone hardware and live provider calls were not tested.
