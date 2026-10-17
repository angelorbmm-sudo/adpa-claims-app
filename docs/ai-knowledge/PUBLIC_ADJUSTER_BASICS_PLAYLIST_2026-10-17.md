# Public Adjuster Basics — playlist ingestion register (2026-10-17)

**Source:** https://www.youtube.com/playlist?list=PL5E_vmB-IgXy8N1jwYzHgfYwECs2lXWB4

**Category:** Public Adjusters (separate from Xactimate/Peter Rooney estimating).

## Verified inventory

- Playlist metadata: 100 entries, **77 unique YouTube IDs**, 23 repeated playlist entries.
- Compared against prior 252-source English archive: 1 source already archived (iI5R5cHM3ws).
- Attempted retrieval of 76 previously unarchived IDs.
- **42 new English timestamped transcripts saved**, 34 IDs still missing (31 encountered IP-blocking and 3 had no English transcript found at time of attempted retrieval).
- Total known archived English sources after this batch: **294 unique IDs** (252 previous + 42 new). This does **not** establish complete coverage of all earlier podcasts or this playlist.

## Durable handoff

Private Google Drive package (verified 459,300 bytes):
https://drive.google.com/file/d/1lQnA7XxHxWTdza3f2PaDbp5R_hQsNqyl/view

Contains:
1. `ADPA_Public_Adjuster_Basics_English_2026-10-17.zip` — 42 JSON transcript files with video IDs, English language labels, and millisecond offsets.
2. `ADPA_Public_Adjuster_Basics_Inventory_2026-10-17.csv` — one row per unique video ID, title, status, and source URL; authoritative retry list for 34 missing IDs.
3. `playlist_metadata.json` — original playlist metadata, including repeated entries.

## Developer checklist

1. Obtain authorized access to the owner-private Drive archive. Do not commit full transcripts or any customer data to the public repository.
2. Extract and verify archive integrity, English-only status, source IDs and timestamped segments. Cross-check with previous 252-source archives to avoid video-ID duplicates.
3. Add the 42 new files to the **Public Adjusters** knowledge namespace, not the Xactimate estimator namespace.
4. Rebuild chunks and similarity/deduplication checks across all 294 known archived sources. The prior 6,645-chunk index covers only the older 249 sources and is stale.
5. Retain source URLs, timestamps and training provenance. Public adjuster training videos are *educational sources*, not authority for policy wording, state regulations or claim-specific decisions. Route legal and coverage conclusions to approved authoritative references and licensed review.
6. Reattempt 34 missing videos through permitted caption sources or authorized exports; record retry outcomes and don't mark blocked videos as ingested.
7. Run unit tests, benchmark on full dataset, and perform domain-expert review before wiring into the ADPA production retrieval service.

**Status:** Archive and inventory completed for recovered items; 34 sources outstanding. GitHub document only, not an implemented or deployed retrieval index.
