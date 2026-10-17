# ADPA English training ingestion — developer runbook

**Status:** Ingestion/normalization utility committed to draft PR #4; not connected to production ADPA app.

## Private source files
- 235 English transcripts: https://drive.google.com/file/d/1GF9EO6RXb4kMqBfNZbnM3FdKpQOTwrBo/view
- 14 additional English transcripts including podcasts: https://drive.google.com/file/d/1Cfl1QT33A2eG4fF4-yuipp8G-NYk-n2J/view
- Combined 249 distinct English transcript IDs. Do not ingest the earlier mixed-language checkpoint.
- Both archives are owner-private. Obtain authorized Drive access before downloading; do not commit transcripts into this public repository.

## Run locally
```bash
mkdir -p /tmp/adpa/source /tmp/adpa/normalized
unzip ADPA_English_YouTube_Training_Corpus_235_2026-10-17.zip 'transcripts/*' -d /tmp/adpa/source
unzip ADPA_Additional_English_Podcast_Xactimate_14_2026-10-17.zip 'transcripts/*' -d /tmp/adpa/source
python tools/ai_knowledge/ingest_transcripts.py /tmp/adpa/source/transcripts /tmp/adpa/normalized
PYTHONPATH=tools/ai_knowledge python -m unittest discover -s tools/ai_knowledge -p 'test_*.py'
```

Expected: 249 accepted transcripts, zero rejected, assuming the published archive schema is unchanged. Confirm actual results in the development environment; this has not yet been run against the complete archive.

## Before deployment
- Verify original source file SHA256 hashes against archive manifests.
- Apply copyright/license review and allow-listing before retrieval use; video transcripts are not legal or pricing authority.
- Build chunking and searchable index with source ID, timestamps, provenance, and specialist tags.
- Enforce claim-specific access control and avoid sending claim PII into the public knowledge corpus.
- Validate answers with construction, public adjusting, contents, and valuation SMEs.
- Add integration and regression tests, monitoring, and rollback plan.
- Merge PR only after José reviews code and confirms environment compatibility.
