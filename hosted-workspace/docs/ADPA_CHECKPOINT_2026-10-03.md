# ADPA resume checkpoint — October 3, 2026

Paused at Angelo’s request at approximately 4:18 a.m. Pacific. Resume only when Angelo returns; no background work or reminder was requested.

## Project

- ADPA Claims Workspace: https://adpa-claims-workspace.angelo-rbmm.chatgpt.site
- Project ID: appgprj_6abfdafe78488191809d1b9b6efe0b5d
- Checkout: /workspace/sites/adpa-claims
- Last successfully published app commit: 9a41f69df3ecc7ac54ec2e67c9b241e6318289f0
- Successful deployment: appgdep_6ac0e417b0448191b36faf4804959bdd
- Published version: appgprj_6abfdafe78488191809d1b9b6efe0b5d~appgver_1ca44a75b8a48191a4550f22a3d6416b
- Preserve owner-private access. Do not create a replacement Site. Source code is in the Site’s durable Git repository.

## Finished and published

1. Payment accounting and ALE expense/reimbursement ledgers, preserving coverage separation and issued versus received amounts.
2. Construction scope comparison: PDF/CSV extraction, immutable source revisions, one-to-many reviewed line matching, page/source links, duplicate prevention and reviewed supplement drafts. Entry point: /construction.
3. Authority records and review controls: operational review; external licensed/client review evidence; jurisdiction, entity and representation sources; participant assignments; holds; immutable package/review/action history; source/claim-change staleness; package supersession and withdrawal; server-side tamper and release controls. Entry point: /approvals.

## Important current limitation

Verified staff/client sign-in, e-signature and step-up authentication are NOT connected. Recorded external licensed/client review evidence is NOT an authenticated approval. The release endpoint fails closed and release buttons remain disabled. State-policy, engagement and license records are recorded evidence pending independent verification. Do not describe the full production authority/settlement workflow as complete. No carrier transmission, settlement acceptance, e-sign invitation or money transfer was added.

## Source estimates

- Colleen contractor: Sierra Renovations, estimator Devin Irving, revision printed January 16, 2026; forwarded by Peter Rooney February 9. 144 priced lines totaling $34,884.31; document RCV includes separate fees. Do not attribute authorship to Peter.
- Colleen carrier: Liberty/Safeco Revision3, Alaina Vierra, June 16, 2026; forwarded by Doug Lindsey June 18. 207 priced lines totaling $51,438.30.
- Bernards contractor: Peter Rooney/Tektone, printed June 15, 2026. 570 extracted scope rows; priced rows total $365,355.31, with unpriced code items flagged.
- Sources load into the owner’s existing matching claim, or create a factual construction claim, when the user chooses the respective /construction button. Publishing alone does not automatically insert them. Different dates, scope and fees prevent interpreting headline differences as benefits owed.

## Code landmarks

- app/workspace-html.ts: active compiled claim workspace. Preserve existing modules.
- source/construction-* and source/scope-engine.mjs; source/scope-library.json; scripts/sync-construction.py.
- source/authority-*; scripts/sync-authority.py; db/authority.ts; app/api/authority/route.ts; app/approvals/page.tsx.
- app/api/claims/route.ts protects authoritative review records from ordinary claim saves; app/api/import/route.ts prevents imports creating authoritative approval records.
- Existing claims are owner-scoped D1 JSON records; evidence originals are in R2. No database migration was required.
- Avoid regenerating the full workspace using the older scripts/port-workspace.py: it can erase newer receipt/valuation modules. Use targeted synchronization scripts.

## Verification completed

Authority checks passed for stage order, state/entity/assignment constraints, exact sources and versions, immutable history, staleness, supersession, holds, withdrawal, signer-authentication pending state, release denial audit, tampering through claim saves/imports, origin/auth/role rejection and concurrency. UI checks passed for navigation, immediate save/version synchronization, checklist stages, dirty-claim guard and reopen. Construction comparison, accounting/ALE, receipts, Gia claim and policy patch regressions passed. TypeScript and the native production build passed; the deployment succeeded October 3 at 11:16:47 UTC. Verification scripts are preserved under verification/.

## Resume

Open this same Site and review any feedback from Angelo before choosing the next work. The next dependency for regulated approvals and release is verified signer identity, e-signature and step-up integration plus independent authority verification. The original backlog then continues with supervised AI in shadow mode, controlled routing/delivery and pilot expansion. Do not start any of those without Angelo’s next instruction.

## October 3 morning update — in-person signing

Added the client authorization option “Signing in person with ADPA representative.” It skips a separate online client identity check and requires the client’s typed full name, electronic-signature consent, complete disclosure checklist and a signed-in witness attestation. The server records the witness account, client signature, date/time, exact package/document snapshot and SHA-256 record fingerprint in immutable review history. No ID upload is requested. Existing pilot access permits only Angelo’s owner account to record; other representatives have not been granted claim access.

In-person witnessing does not mark the client as independently authenticated or bypass licensed approval, authority verification, package staleness, holds or release restrictions. Remote evidence mode remains available. Backend and interface tests cover missing consent/witness, wrong signer name, unauthorized accounts, exact package binding, persistence, changing modes and clearing signature fields. Existing receipts and construction checks pass. The accounting regression script could not run because its older scratch fixture is absent; accounting source was not changed.
