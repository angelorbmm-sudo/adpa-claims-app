# Daily Field Visits — Arman’s first mitigation enhancement

## Purpose

Arman asked for faster field documentation and clearer communication. His October 11 answers prioritize source/affected-area documentation, material assessment, daily moisture and psychrometric conditions, evidence for equipment quantities and continued drying, and support for questioned charges. This release groups those records into one room-visit screen; it does not prescribe restoration decisions.

## Where to find it

- Mitigation company dashboard `/company`: open an assigned water job, then **Daily field visits**.
- ADPA water workspace `/water`: choose the saved job, then **Daily field visits**. A selected claim can open directly at `/water?id=<claim>&tab=daily`.
- Detailed restoration workspace `/mitigation`: the **Open daily field visit** button links to the selected claim’s water workspace.

## Field workflow

1. Choose an existing room. Read prior visits and legacy field observations.
2. Record the visit time in the device’s timezone, the recording professional, summary, and source basis. The server retains the explicit offset and the authenticated actor separately.
3. Add material moisture or ambient readings. Capture location, material, test point, instrument/method/scale, baseline basis, temperature and RH. A prior test point can populate identifiers, never the new measured values. Comparisons require matching point, location, material, instrument, method, and units; no drying-completion conclusion is inferred.
4. Record equipment that stayed, was added, moved, or removed; identify each group, count, capacity basis, location, observed performance, and necessity. These are dated change observations, not an automatically calculated equipment inventory, billed duration, or invoice.
5. Record the professional’s material decision: continue drying, remove, clean, or needs assessment. Capture salvageability, porosity, reported category/class, assessor, and item-specific basis. Unknowns remain unknown.
6. Upload photos/documents directly, then link each row to original evidence and a locator. Uploads persist separately from the visit, even when the unsaved visit is discarded. Company uploads retain the existing company-job permissions; owner/homeowner file privacy rules remain in effect.
7. Record the next action and save the room visit. Readings also create linked water field observations. All visit facts, observations, actor and audit references are saved in one version-guarded claim write.
8. Choose a saved visit, select permitted original attachments and an audience, and acknowledge review before preparing the update. Copy/download the text draft and use the authorized original download links. Nothing is sent and no AI call is made. The draft is derived from saved facts; there is no separate stored outbound message or automatic company-client match.

## History, permissions and downstream review

- Visits are append-only through this workflow. A correction names the prior room visit, includes a reason, and retains the original. A company contributor can correct their own accessible visit. Forked correction chains and future visit dates are rejected.
- Accepted company managers and assigned accepted technicians can record visits only in the projected company job. Every room and referenced file must be accessible. Another company receives no implicit visit grant.
- Withdrawing a referenced source or room hides the company projection of the visit. Revoking staff or assignment uses existing access checks. Owner review still retains claim history.
- Owner-water roles follow existing mitigation contribution permissions; policyholders and reconstruction-only contractors cannot record mitigation visits.
- Saved visits enter the internal mitigation package section. Material changes affect package fingerprints, AI source hashes, and company handoff context. Active visit evidence gaps contribute to readiness warnings and block a company handoff to ADPA. Corrections supersede the original for active evidence-gap checks while preserving history.
- Existing payment, fee, valuation and approval records are preserved. No equipment billing days, demanded amount, coverage outcome, release permission or safety certification is generated.

## Activation and verification limits

The Site remains owner-private. Arman’s independent use requires approved Site access and the correct accepted company/job assignment. Email/SMS delivery still requires configured company channels; native Xactimate exchange is not activated. Audio/video originals follow existing storage/conversion limits. No automatic malware scanner is connected.

Automated SQLite/API and domain checks cover atomic saving, actor stamping, versions/origins, company boundaries, source withdrawal, immutable corrections, matching reading scales, package/handoff changes, and preservation of financial/approval data. TypeScript and the production build are checked separately. Browser/device visual testing and a real contractor pilot have not been performed because the supported browser-control capability is unavailable in the managed environment.

## Implementation

`lib/daily-visits.ts`, `components/daily-field-visits.tsx` and CSS; integrations in Water, Company and Mitigation workspaces, `lib/water.ts`, `lib/company.ts`, company API dispatch, and internal claim-package projection. No database migration or client data seed was required. The original private GitHub main application remains separate; back up the cumulative hosted implementation on a feature branch under `hosted-workspace/`.
