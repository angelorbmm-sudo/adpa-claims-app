# HomeBack / ADPA AI Knowledge Ingestion — José Technical Handoff v1.0
Date: 2026-10-17
Status: reference corpora staged; no production retrieval deployment.

## Purpose
Turn licensed/authorized YouTube videos, podcasts, training transcripts and expert scopes into source-grounded AI assistance for HomeBack and ADPA, not uncontrolled model fine-tuning. The raw archive belongs in private Drive; code, manifests and integration specifications belong in GitHub.

## Verified source packages
- 235 English transcripts: https://drive.google.com/file/d/1GF9EO6RXb4kMqBfNZbnM3FdKpQOTwrBo/view
- 14 supplemental English transcripts: https://drive.google.com/file/d/1Cfl1QT33A2eG4fF4-yuipp8G-NYk-n2J/view
- 249-source, 6,645 timestamped chunks: https://drive.google.com/file/d/1g-LpbDpAVmEiGR_yP-Au1I5F9C-YxxMR/view
- Fast approximate dedup prototype output, 6,642 retained chunks: https://drive.google.com/file/d/1osfaxUxTDAe0b2QQNzuadRuKtkCgyy4l/view
- Near-duplicate audit: https://drive.google.com/file/d/1K6U7rNs-jtpIYQ2Qci-HM8r5HNDZ6Wov/view
- Xactimate playlist recovery audit: https://drive.google.com/file/d/1ryxKnCe05u9PONfMbvZ1RpOJ9wBvqhwV/view
- Master recovery register (latest, includes later 294-source count; reconcile this with all manifests): https://docs.google.com/document/d/18JbVOwhKhpO8QSkPLgHm35EoV1NU4YmkcwQPclWOVH8/edit
- Source index: https://docs.google.com/document/d/15fYCWL1iYayZ_6JqwqwkEza7PeQEMLl-B9LZg--kQ8Y/edit

## Known training sources
- https://youtube.com/@insurancerestorationtraining
- https://youtu.be/IGsgn9YEpKk
- https://youtu.be/TzZS7T6Uzkc
- https://youtu.be/-WrdrhXOddQ
- https://youtu.be/CtKCUePLBQk
- https://youtu.be/F5pbm-Mzu-I
- https://youtube.com/playlist?list=PL0FRjZSbvBDwEc1H0lCOdX7-CGdO-oa3T
- Related podcast candidate https://iescertified.com/rfg-vs-dmo-the-practitioner-podcast/ (verify ownership and licensing before ingesting)
The full podcast catalog has NOT been reconciled; these are source pointers, not a claim that all episodes are captured.

## Repository handoff
Draft PR https://github.com/angelorbmm-sudo/adpa-claims-app/pull/4
Existing scripts and tests: tools/ai_knowledge/ingest_transcripts.py, test_ingest_transcripts.py, chunk_dedup.py, test_chunk_dedup.py, fast_chunk_dedup.py, test_fast_chunk_dedup.py; runbook docs/ai-knowledge/INGESTION_RUNBOOK.md. Verify files and run tests on José's environment.

## Data contract
source_id, title, author, source_url, channel, published_at, language, jurisdiction, content_track, rights_status, consent_status, transcript_status, segments[{start_ms,end_ms,text}], sha256, extracted_at, reviewed_by, review_status, version. Chunk metadata: chunk_id, source_ids, timestamp ranges, embedding_model_version, access_tier, citation_url.

## Implementation
1. Verify José has private Drive access; fetch archives; hash-check and count; reconcile current 294 claimed distinct transcripts against actual files. Do not add 235+14+45 blindly; some snapshots overlap.
2. Validate English language, timestamp monotonicity, UTF-8, source URL, transcript provenance and license/usage rights; quarantine failures.
3. Keep distinct retrieval namespaces: PA Academy; Xactimate/estimating; mitigation/restoration; roofing/construction; contents; RCV/ACV; Peter Rooney expert methods (only after baseline Xactimate proficiency).
4. Normalize into versioned chunks, preserve full source timestamps, run near-duplicate candidate review and dedup while retaining provenance.
5. Build private object storage + metadata DB + vector/full-text hybrid search; index with tenant/role restrictions. No raw customer claim files in generic training corpora.
6. Retrieval API accepts claim_id, task, role, jurisdiction, policy_date; returns ranked passages with citation and confidence/abstention. Separate source guidance from binding policy/contract/law. Human PA review for regulated claims work.
7. Susie orchestration: estimator, PA specialist, contents inventory, ACV/RCV calculator. AI can recommend but not approve coverage, deny claims or settle automatically. Carrier portal must NEVER access internal PA knowledge/strategy or private documents by default.
8. Run unit, security, retrieval relevance, factuality, citation, cross-tenant access, audit and licensed-expert evaluation suites in staging; keep feature flag OFF until approved.

## Acceptance
Publish a manifest of all distinct sources and rights, counts by namespace, hashes, excluded/unavailable list, ingestion run logs, test results, index version and rollback instructions. Demo 10 citation-grounded test questions in each specialist domain. Confirm readiness with Angelo before production rollout.

## Open dependencies
Private Drive sharing for José; transcript/podcast rights; 30 inaccessible Xactimate playlist entries; additional podcast URLs; expert review by Peter and licensed PA; confirm current 294-count provenance. No claim of a deployed knowledge engine.
