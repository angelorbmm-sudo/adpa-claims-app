# Shared evidence inbox — October 13, 2026

The Shared evidence tab is now labeled Evidence inbox. Approved company managers and the accepted policyholder can capture up to ten originals per batch, with a 30 MB maximum per file. ADPA can organize originals after the separate representation agreement, homeowner connection and explicit file consent are current. Company My jobs and policyholder Shared evidence link to the same job inbox.

## Workflow

1. Add a building/floor/room or exterior/business area.
2. Add physical building-component or contents-item references with their original room and optional inventory reference.
3. Select a room, Building damage / Contents / Both, and existing item references before uploading a batch; unassigned evidence can be organized later.
4. Originals start with the contributing company and policyholder, or just the policyholder for a policyholder upload. The policyholder individually authorizes each recipient and ADPA.
5. Each reviewer role records its own associations and status: Not yet examined, Needs clarification, or Reviewed. Reviewed requires the actual whole-file/selected-portion scope, source locator and finding. A review by one company does not imply another company or ADPA reviewed it.
6. Use authorized original downloads and existing inspection/pricing imports. Homeowner originals can be cited in company inspections and imported into the separately retained ADPA claim after consent and digest verification.

## Integrity and limits

- Upload alone does not analyze, approve, price or create inventory quantities. Item references identify a physical item; they are not a new priced inventory line.
- File metadata retains source uploader, revision, created time and SHA-256 digest. Tags retain reviewer role and change history. Missing/changed metadata marks earlier reviews stale; companies lose access after consent revocation.
- Current file permissions govern shared tags and contents references. Room names are common to approved job participants: do not put sensitive personal facts in area names. Review notes are shared job findings, not private negotiating strategy.
- Same-contributor SHA-256 duplicates reuse the existing original. Each batch lists successful, duplicate and failed files. Concurrent job changes reject stale submissions.
- GET availability reflects current metadata; downloads and review saves also check the original storage object. GET does not perform hundreds of storage checks. Failed concurrency after storage upload may leave a private unreferenced object requiring a future cleanup job; it does not add an inbox entry.
- Supported originals: JPEG/PNG/WebP, PDF, MP4/MOV, MP3/M4A, TXT, DOCX and XLSX. File headers are not a malware scanner; enterprise scanning and larger resumable media uploads remain Jose integration work.
- Native Matterport models/OBJ/point clouds are not accepted. Supported image/PDF exports can be uploaded.
- Audio/video transcription, automatic timestamped examination, native Matterport ingestion and automatic replacement sourcing for every file remain subsequent tasks. Do not describe uploaded files as AI-examined.
- Existing owner-private deployment audience is preserved. Live phone/provider walkthrough and live browser screenshot QA remain deferred; supplied visual examples are labeled mockups.

## Validation

269 automated tests passed, including room/reference consent, per-role partial review, stale originals, homeowner uploads and ADPA imports, duplicates, unauthorized actors and invalid associations. TypeScript and production build are checked for the final published source.
