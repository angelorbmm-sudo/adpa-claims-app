# P0-04 — Secure Evidence Vault / Evidence Custody

Date: 2026-10-06
Status: APPLICATION CUSTODY ARCHITECTURE COMPLETE; OBJECT-STORAGE ADAPTER/STAGING PROOF PENDING

## Objective
Move ADPA from browser-only evidence metadata toward a production evidence chain where originals live in private object storage and the database owns tenant/claim linkage, SHA-256, object identity, review state and custody events.

## Implemented
- Added authenticated evidence API under /api/documents.
- Every evidence operation first verifies the claim belongs to the authenticated organization.
- Read access requires documents:read; upload workflow requires documents:write.
- Server stores evidence metadata in claim_documents rather than trusting claim JSON as custody authority.
- Upload intent requires immutable identifying metadata: document id, filename, MIME type, byte size and SHA-256.
- Server creates tenant/claim/document-scoped object key.
- Duplicate SHA-256 on the same claim is rejected before upload intent.
- Original evidence is marked as original in server metadata.
- Upload completion does not mark evidence Ready. It moves to quarantine.
- Quarantine requires future server-side object verification/malware scanning before promotion to Ready.
- Upload intent and completion are audit events bound to organization, claim and document.
- Frontend API functions now exist for evidence listing, upload-intent creation and completion.
- Existing storage adapter remains fail-closed: disabled storage returns 503; an unimplemented selected provider returns 501 rather than pretending bytes were stored.

## Deliberate safety behavior
The current browser Evidence Engine still computes a client SHA-256 and explicitly says original bytes are not persisted. This was not falsely converted into a production upload. Until José provisions private storage and its adapter is implemented/tested, real evidence upload remains HOLD.

## Production storage requirements
Private bucket/container; encryption; versioning/immutability controls appropriate to design; TLS; tenant-scoped object keys; short-lived upload/download authorization; server-side size/type/hash verification; malware/quarantine scanning; access logging; retention/legal hold/disposition; backup/recovery; no public ACL; lifecycle rules approved by privacy/compliance.

## Staging acceptance
1. Org A cannot list/create/complete Org B evidence.
2. Original upload survives browser/device loss.
3. Stored object byte count/hash matches server record.
4. Duplicate behavior is deterministic.
5. Failed/interrupted upload remains pending and is retry-safe.
6. Completed upload remains quarantined until verified/scanned.
7. Malware/type mismatch cannot become Ready.
8. Download authorization is short-lived and tenant-scoped.
9. Object version/original cannot be silently overwritten.
10. Derivatives link to original rather than replacing it.
11. Evidence access/upload lifecycle appears in audit.
12. Backup/restore reproduces metadata + object + hash/version relationship.
13. Retention/legal hold blocks unauthorized deletion.
14. Package manifest binds evidence id/hash/version where required.

## Current decision
Application custody architecture: PASS.
Tenant-scoped evidence metadata API: PASS.
Fail-closed storage boundary: PASS.
Private object storage: NOT PROVISIONED.
Provider adapter: NOT IMPLEMENTED.
Malware scanning/object verification: NOT IMPLEMENTED.
Real-client evidence: HOLD.
Synthetic metadata/testing: GO.

P0-04 APPLICATION CODE REMEDIATION COMPLETE.
Infrastructure-dependent verification remains a staging gate and must not be represented as production complete.
