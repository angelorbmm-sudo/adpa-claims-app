# Module reviews 4-7 - Intake, representation/signing, policy and evidence

## Claim intake and property
- Added `/intake` to review/correct a saved claim's canonical policyholder, property, carrier, policy number, carrier claim number, loss date and reported loss. Dashboard cards link to it; new-claim creation includes the optional carrier claim number.
- The claim API normalizes canonical profile name/address to the actual claim record and trims typed intake fields. Legacy null optional fields remain unknown rather than blocking unrelated saves.
- Creation guards exact normalized carrier+claim-number duplicates within the same owner, atomically; it does not match carrier aliases, merge claims, infer ownership or prevent multiple losses with unknown claim numbers. Updates keep existing versions and protected workflow write checks.
- Missing/invalid intake details get explicit guidance without guessed dates/numbers or blanket claim-ready approval. Unknown values can be recorded incrementally. Unsaved editing and account ownership remain protected.

## Representation and signing
- Authority context requires the original policy PDF and a representation PDF or supported image original. This validates source type, not its legal sufficiency/authenticity. Missing/unsupported control sources also warn in package review.
- Expanded Signing center can retry/refresh while retaining an unsaved preparation draft. A committed signing action followed by a failed refresh is reported as saved and requires refresh before another action, rather than inviting a duplicate preparation/send.
- Claim representation context, company service signatures and final settlement/release approval remain independent. DocuSign activation and real identity/provider/browser testing remain Jose's work; no envelope or invitation was sent by this build.

## Policy review
- New saved reviews bind the original's id/name/MIME/size/created metadata. Removed/changed/legacy-unbound originals hold the review and prevent applying an earlier saved limit until rechecked.
- Source holds also appear in downstream package warnings. This does not remove previously applied bucket limits automatically; reconcile those values after re-review.
- Unsaved edits are protected during navigation, claim/coverage changes and refresh. Applying a saved limit is disabled while edits are unsaved. History and existing requested/payment figures are preserved.
- Binding is to file identity/metadata, not a new independent PDF byte/content audit. Checked source still means human review; AI policy extraction and legal/coverage/deadline judgments are not activated.

## Evidence uploads and playback
- Each file gets an explicit uploaded/already-present/failed result. A failed file does not stop independent later files. Partial success remains visible and unsuccessful batches keep the original selection for safe deduplicated retry.
- Expanded extension fallback covers supported photos, CSV/TSV, MP3/M4A and existing documents/video; CSV/TSV are selectable. Audio originals have in-workspace playback alongside existing photos/video and authenticated original downloads.
- Concurrent exact uploads return an idempotent duplicate result without overwriting the first original's metadata. Binary content hashes deduplicate exact bytes; semantic duplicates remain a separate review problem.
- Storing/playing evidence does not transcribe, analyze, price, authorize sharing or approve it. Large media processing, Matterport and automated audio/video analysis remain pending.

## Verification and limits
408 synthetic domain/API regression checks pass. New cases cover canonical intake, null/unknown fields, exact duplicate creation, owner/version access, representation source types, removed/changed policy originals, package warnings and concurrent evidence uploads. TypeScript, source JavaScript syntax and production build checked before publication. The retained claim workspace is regenerated from source so the new upload behavior is in the deployed build.

Browser/phone QA and real signatures, AI accuracy, outbound delivery and banking acceptance remain deferred. No real claim/company records or live messages/funds changed during development. Site audience remains owner-private. Source and GitHub backups preserve existing unrelated modules.
