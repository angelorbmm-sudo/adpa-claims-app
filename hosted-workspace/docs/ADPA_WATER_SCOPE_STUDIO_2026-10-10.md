# Water Scope Studio — October 10, 2026

## Delivered

`/water` adds a water-job workflow to the existing authenticated hosted ADPA workspace. Three intake paths record homeowner, company-assisted or ADPA introductions. Homeowner invitations are verified-email-bound and require acceptance. Registration and a representation request are separate from an executed representation agreement. Referral company/contact, reported source control, loss/discovery dates and next action are recorded without assuming coverage.

Room measurements require a source and basis. Immutable field observations capture readings, instrument, units, baseline, location and timestamp. Mitigation and reconstruction draft lines have separate subtotals, explicit quantities and prices, necessity explanations, original-file citations and carrier comparison fields. Unknown amounts stay unknown. Matching physical work keys across phases are flagged; all overlapping active lines are excluded from draft subtotals pending reconciliation. No totals update claim demands, financial ledgers or payment approvals.

Named participants: policyholder, contractor, mitigation company, restoration company and estimator. Accepted contractors contribute reconstruction; mitigation firms contribute mitigation; restoration companies and estimators work across phases. Contributors can edit only their own rooms/lines. Only the ADPA pilot owner can mark an ADPA draft accepted. No role grants public-adjuster authority, settlement approval or release permission. A coordinator who creates their own job does not become an ADPA reviewer. Production assignment/transfer of externally created jobs to ADPA remains a separate onboarding decision.

Owners choose shared originals. Company construction/media uploads are shared to this job. Homeowner uploads remain private to the uploader and owner until explicitly shared. Downloads are authorized on each request and use private no-store headers. Revocation removes access. Shared originals are visible to all accepted job participants; finer per-participant sharing is not provided in this version.

Susie review adapter reads selected originals in 1–6 file / 15 MB batches. It produces cited findings, policy-provision review leads, conflicts, missing evidence and unreviewed scope suggestions. Output is validated against selected evidence and known room IDs. Quantities are never inferred from photos in the instructions; human source verification is required. Adopting a suggestion creates a draft only. Material edits stale analysis and source/room/line edits stale human reviews. All files appear in the evidence list; manual review/conversion triage remains available for each file. This is not automatic background analysis of every upload.

Draft lines and warnings appear in existing internal construction-package sections and preparation checks. Pending water scopes and dated next steps appear in the morning dashboard. Existing approvals/release controls are preserved. Print / Save as PDF provides an internal draft copy; direct Xactimate integration is not implemented.

## Activation and limits

The Site remains owner-private. Named job invitations do not bypass Site access; external participants need a separate supported Site grant before they can open the portal. Invitations are not emailed automatically. No sharing audience or external access was changed during this build.

The AI adapter needs server `OPENAI_API_KEY` and `OPENAI_WATER_MODEL` (or existing `OPENAI_MODEL`). No key was provisioned and no billable live AI run was performed. Use the OpenAI Developers plugin API-key workflow to activate it; never place secrets in client code.

Stored audio/video require transcripts or extracted frames for AI review; Word/Excel require PDF/text conversions. Upload cap remains 30 MB per file. Automatic malware scanning, direct Xactimate export, e-signature and banking integration are not activated. The homeowner progress panel reports saved workflow facts, not bank/carrier verification or executed representation.

## Verification

75 automated tests passed, including real in-memory SQL/API checks of ownership, pending acceptance, role restrictions, revocation, private-file access, uploader privacy, uploads, version guards, source binding, stale reviews, overlap exclusion, preserved financial/approval data and structured AI validation using synthetic responses. TypeScript and production build passed. Browser/device visual QA was unavailable; no live provider analysis was tested.

## Source lineage

Hosted base: 06d47f73207ab8387d6f12383f03b00cd66dadba. Hosted framework differs from the recovered private GitHub main React/Vite framework. Save the change bundle under `hosted-workspace` on a feature branch; retain main and prior pricing/morning bundles.

## Reference sources

- https://iicrc.org/s500/ — scope and components of the professional water-damage restoration standard. Full licensed standard text is not copied or embedded.
- https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home — moisture/mold guidance. The UI links to the source; no diagnostic thresholds or insurance-entitlement rules are inferred.
