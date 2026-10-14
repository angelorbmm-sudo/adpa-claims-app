# Claim-package assembly

- `/packages?id=<claim>` assembles selected saved coverage/policy, contents, construction, ALE, payment and supplement projections; selected source-review notes and original evidence files are captured in an immutable owner-scoped `claim_packages` snapshot.
- Drafts do not modify claim values, approvals, signatures, communications or authority. No send endpoint, AI request, combined demand or entitlement calculation exists.
- Every included section requires a note and explicit source-review confirmation. Existing unreviewed record statuses remain visible. Notes are not a substitute for licensed review or release authorization.
- ZIP contains printable escaped HTML, a manifest, projected JSON records and up to 30 originals / 25 MB. Missing or invalid attachment bytes abort the entire download. Filenames are numbered and sanitized. HTML uses a restrictive CSP; no scripts or remote assets.
- Print / Save as PDF is a browser action; originals are not merged into that PDF. ZIP is assembled on demand from preserved snapshot plus immutable evidence; no public file sharing is added.
- SHA-256 fingerprint covers saved claim version and full evidence metadata. Changed claims or evidence mark old snapshots outdated in list, preview and downloads. Reports always remain internal drafts, including after source confirmation.
- At most 50 immutable snapshots per claim, bounded snapshot JSON; retry IDs prevent duplicate inserts. Prepared owner-scoped queries, same-origin writes and version-conditional insert protect persistence. Original communication bodies, internal approval state and audit histories are excluded from exports.

## Review update — October 14, 2026

New assembly/export schema 2 requires the opened material/evidence fingerprint, reads and fingerprints selected original bytes, checks the final object lease and inserts only while claim facts, complete evidence metadata and the package-count limit still match. Public lists and export manifests exclude private storage identity/provenance. ZIP verifies saved SHA-256 originals, including same-sized changes, before returning any bytes. Legacy snapshots are retained but require reassembly for current HTML/ZIP exports. Allowlisted workstream and agreement/pricing records exclude internal histories and review snapshots. Unconfirmed writes retain the same retry ID; confirmed writes remain reported as saved if preview refresh fails.
