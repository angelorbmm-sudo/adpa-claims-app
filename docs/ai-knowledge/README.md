# ADPA AI Knowledge Ingestion — Developer Handoff

Status: **Implementation proposal, not deployed or trained**. Created October 17, 2026.

## Purpose
Build a source-cited retrieval system for four coordinated ADPA specialists:
1. Xactimate and construction estimating assistant
2. Licensed-public-adjuster-supervised claim and negotiation assistant
3. Contents inventory and replacement-price research assistant
4. Policy-specific RCV/ACV/depreciation/claim ledger calculator

All share a claim ID, evidence references, policy and endorsement version, state jurisdiction, access controls, and human approval workflow. Do not train on unreviewed transcript statements as legal or estimating authority.

## Source inventory
YouTube channel: https://youtube.com/@insurancerestorationtraining
Channel ID: UCmCjiAzy5bF7iBrqCRBUB0A
Composio/Supadata inventory: 201 videos, 63 Shorts, 2 live = 266.
Recovery checkpoint: 45 timestamped JSON transcripts, 37 English, 6 Arabic, 2 Bengali. One age-restricted video blocked. **Actual JSON transcript files are in a Composio remote workbench and are NOT in this GitHub repository or Google Drive yet.**
Remote extraction path: /mnt/files/adpa_corpus/
Remote archive: /mnt/files/adpa_corpus_checkpoint.zip
Google Drive technical handoff: https://docs.google.com/document/d/18JbVOwhKhpO8QSkPLgHm35EoV1NU4YmkcwQPclWOVH8/edit
Google Drive master folder: https://drive.google.com/drive/folders/1f1xQdLVKyWNw6643hKeRjJxx0W3qfLVq

## Required ingest contract
Per source: source_id, video_id, canonical_url, title, publisher, published_at, transcript_language, segments [{start_ms,duration_ms,text}], retrieval_time, sha256, review_status, rights_status, tags.
Deduplicate by video ID and checksum; reject empty transcripts. Preserve original captions, separate any translations, and flag non-English or inaccurate caption tracks. Source retrieval must return video URL and timestamps.

## Architecture and guardrails
- Store media/transcripts in approved persistent object storage; GitHub should hold ingestion code, schemas, manifests, tests and sanitized samples, not the entire raw copyrighted corpus by default.
- Retrieval-augmented generation with domain-specific collections and evidence-grounded responses. Human experts review curriculum content.
- Estimator: traceable line items, measurements, regional price list/date, material/labor and code assumptions, contractor review. Master Xactimate fundamentals before applying Peter Rooney's methods.
- PA: policy language and effective-date verification, state licensing/compliance gate, licensed PA review of representation and negotiation.
- Contents: inventory room, item description, condition, age, quantity, receipts, photos, replacement comps and source/date.
- Valuation: per-item RCV and ACV, depreciation assumptions and caps, deductible rules, prior payments, recoverable depreciation; test ledger totals. Never guess policy-specific formulas.
- Security: no customer PII in training corpora; per-claim authorization, encryption, audit logs, retention policy, approval gates.

## Delivery checklist
- [x] Identify source channel and enumerate 266 video IDs
- [x] Recover and checksum a first batch of 45 transcript files in Composio workbench
- [ ] Transfer actual files to permanent controlled storage and verify access and checksums
- [ ] Correct/flag 8 non-English caption tracks
- [ ] Process remaining accessible videos, Shorts, live streams and errors
- [ ] Build ingestion pipeline and retrieval index
- [ ] Integrate specialist workflows into ADPA UI/API
- [ ] Unit/integration/evaluation tests and expert sign-off
- [ ] José reviews and merges after testing

**No app functionality or corpus upload is claimed by this document.**

## October 17 English-only corpus update (verified)
The owner directed that only English transcripts be used. A new corpus was extracted and uploaded to private Google Drive: **235 English transcript JSON files**, 266 discovered source videos, 31 unavailable/excluded. Includes timestamped segments, channel inventory and SHA256 manifest.

- Permanent Drive ZIP: https://drive.google.com/file/d/1GF9EO6RXb4kMqBfNZbnM3FdKpQOTwrBo/view
- Drive file ID: `1GF9EO6RXb4kMqBfNZbnM3FdKpQOTwrBo`
- Stored size: `3,471,843` bytes; MIME `application/zip`
- Folder: `1PBie5XdpSzlYuiWqPVUrt8CzsYcMLgtP` (José Technical Development Packages)
- Verified owner-only Drive metadata; not publicly shared. José may need explicit access granted.
- Earlier 45-transcript checkpoint superseded by this English-only archive; do not ingest non-English tracks from earlier checkpoint.

**Next technical action:** ingest only the verified English JSON files from controlled Drive/object storage into the ADPA retrieval index, then implement and test the four AI specialist workflows. This PR is documentation only; app ingestion and deployment remain unimplemented.
