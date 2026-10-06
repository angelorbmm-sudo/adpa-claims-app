# ADPA Tier-A Step 8 — Privacy & Evidence-Custody Review

Audit date: 2026-10-06
Status: COMPLETE — PRIVACY/EVIDENCE MODEL DEFINED; LIVE CLIENT DATA HOLD REMAINS

Scope: data minimization, classification, evidence provenance, original-file custody, integrity, access, retention, deletion, export, backup, breach exposure, privacy requests, vendor transfer and AI use. Static architecture review plus current CA/NV primary-source verification. This is an engineering/privacy-control review, not legal advice or a certification.

## Current-state determination
ADPA currently records claim data in browser localStorage and evidence metadata/fingerprints in the claim. EvidenceEngine computes SHA-256 but explicitly does not persist original file bytes. The backend schema anticipates private claim_documents records and object keys, but the object-storage adapter is not implemented. DataTransitionCenter can export the entire workspace as plaintext JSON and correctly warns that the file is not encrypted.

Therefore real client PII/evidence remains HOLD until production storage, access, retention, backup and incident controls are deployed and tested.

## Data classification model
P0 Public: public regulatory sources, public forms/templates intended for public distribution.
P1 Internal: operational configuration, non-client internal notes with no sensitive claim information.
P2 Confidential Claim: insured name/contact, property address, policy/claim number, estimates, correspondence, claim chronology.
P3 Restricted Evidence: photos/video of home/interior, receipts, inventories, signatures, contracts, bank/payment records, identity documents, security-camera/smart-device material, medical/health information if ever received, credentials/tokens, unredacted financial account data.
P4 Regulated/Authority: licensed-PA approvals, client authorizations, e-signature evidence, audit history, legal-hold records and security incident evidence.

Default unknown uploaded evidence to P3 until classified.

## Minimum collection rule
Collect only information needed to represent/process the claim, prove a claim fact, meet a regulatory/contractual record duty, secure the system, or perform an authorized HomeBack/ADPA workflow. Do not collect SSNs, full payment-card credentials, passwords/security answers, medical information, biometrics or unrelated family data merely because the system can store files. Redact unnecessary account/identity information where the evidentiary purpose can still be met.

## Evidence chain-of-custody target
Every original evidence object should receive:
- server-generated immutable evidence ID;
- tenant/claim ID;
- original filename plus normalized display name;
- SHA-256 calculated/verified server-side;
- immutable object version/key;
- byte size and detected MIME/type, not browser declaration alone;
- source/received-from and received timestamp;
- uploader/actor;
- coverage/category/purpose;
- capture metadata when legitimately available;
- malware/quarantine status;
- review status/reviewer/time;
- derivative relationships (redacted/OCR/thumbnail/extracted text);
- access/download/export audit;
- retention class/legal-hold flag;
- deletion/disposition record.

The original must never be silently replaced by a derivative. Redactions/OCR/AI extraction are separate derived objects linked back to the immutable original.

## Primary-source privacy/retention anchors
California's privacy framework requires reasonable security procedures appropriate to the nature of personal information for covered data/business contexts; the California AG also describes consumer rights under CCPA/CPRA where applicable, including know, delete, correct, opt-out of sale/sharing and non-discrimination. Applicability depends on the business and data context and must be assessed rather than assumed.

Nevada NRS 684A.165 requires adjusters to comply with applicable local, state and federal privacy/information-security laws. NRS 684A.180 requires adjuster transaction/investigation/adjustment/compensation records to be available to the Commissioner and retained at least three years after claim closure.

ADPA implication: deletion cannot be a blind “delete everything” operation. A privacy/deletion request must be reconciled with applicable record-retention, legal-hold, contract, claim-defense and regulatory duties.

## Findings

### S8-C01 — Original evidence custody does not yet exist
Severity: CRITICAL before live evidence.
Browser SHA-256 metadata is useful but original bytes are not stored. There is therefore no production chain of custody, immutable original, access control, restore path or proof that the later file is the same original.
Fix: private versioned object storage + server upload service + server hash verification + claim_documents binding + restore tests.

### S8-H01 — Plaintext full-workspace export can contain extensive PII
Severity: HIGH.
The browser backup exports the complete workspace as JSON. The UI warns correctly, but there is no encryption or destination control.
Fix: production backup/export must be permissioned, audited, encrypted, purpose-labeled and delivered only to approved secure storage. Consider a separately controlled client-record export distinct from disaster-recovery backup.

### S8-H02 — No formal retention/disposition engine
Severity: HIGH.
No record currently carries retention class, retention start, minimum retain-until, legal hold, disposition status or destruction proof.
Fix: create effective-dated retention policy by jurisdiction/record class; calculate retain-until from verified events such as closure; legal hold overrides deletion.

### S8-H03 — No legal-hold mechanism
Severity: HIGH.
A disputed claim, litigation/EUO/regulatory matter or preservation instruction may require records to remain unchanged despite ordinary deletion schedules.
Fix: claim/evidence legal hold with authority, reason, scope, actor, start/end, approval and immutable audit.

### S8-H04 — Evidence deletion is currently a simple metadata removal
Severity: HIGH.
EvidenceEngine Remove record deletes the item from the browser array with no reason, authorization, tombstone, retention check or custody event.
Fix: production delete becomes disposition workflow. Never physically destroy an original while retention/legal hold applies; preserve auditable tombstone.

### S8-H05 — Access/download history is not modeled for evidence
Severity: HIGH.
Future sensitive evidence needs a record of who viewed/downloaded/exported/shared it, especially P3/P4.
Fix: server-authorized object access using short-lived signed access; audit sensitive reads/downloads/exports.

### S8-H06 — File metadata is trusted too much at browser stage
Severity: HIGH for future upload.
Filename/type/lastModified are client-supplied. Browser hash is not enough for content safety.
Fix: server detects content type, enforces size/type allowlists, malware/quarantine workflow, strips unsafe active content where appropriate for derivatives, and verifies hash after upload.

### S8-H07 — Claim JSON can mix sensitive data without field-level classification
Severity: HIGH.
Free-form notes and nested records can receive account numbers, medical details or other unnecessary P3 data without labeling.
Fix: data dictionary + field classification + UI warnings/redaction for sensitive free text + restricted fields separated where necessary.

### S8-H08 — Privacy-request workflow is absent
Severity: HIGH if/when applicable.
No workflow inventories a person's data, verifies requester identity, records exceptions/retention conflicts, exports/corrects/deletes eligible data, or records completion.
Fix: build only after legal applicability/policy is defined; requests must never erase required claim/audit records blindly.

### S8-H09 — Vendor/subprocessor transfer controls are not yet defined
Severity: HIGH before external storage/AI/e-sign/email.
Object storage, identity, e-signature, email and future AI vendors can receive client information.
Fix: vendor data-flow register, purpose/minimum-data rules, contracts/security review, region/retention settings, incident obligations, deletion/return and subprocessor review.

### S8-H10 — Backup/restore privacy controls are not implemented
Severity: HIGH.
Production backup needs encryption, access separation, retention, restore authorization and proof that deleted/expired data is handled according to policy.
Fix: documented RPO/RTO plus encrypted backups and restoration drills with synthetic data first.

### S8-M01 — Evidence hash should be server-verifiable and package-bound
Severity: MEDIUM-HIGH.
Current SHA-256 is browser-computed and Step 2 found package manifest does not bind the hash.
Fix: verify server-side and include immutable evidence IDs/hashes/version in package snapshot.

### S8-M02 — Derivative provenance is missing
Severity: MEDIUM-HIGH.
Future OCR, redaction, thumbnail, transcription and AI extraction need explicit parent/original relationships.
Fix: immutable derivative graph with processor/version/time and source page/timecode references.

### S8-M03 — Data residency/region policy is undefined
Severity: MEDIUM.
Fix: choose approved production regions/vendors and document cross-region/cross-border behavior before live data.

### S8-M04 — No purpose/consent/authority metadata for optional data sources
Severity: MEDIUM-HIGH.
Future Ring/security footage, bank statements, smart-home data and third-party property data may have different authority and sensitivity.
Fix: record source, permission/authority, purpose, scope, obtained-at and revocation/expiration where relevant.

### S8-M05 — Audit data itself can contain PII
Severity: MEDIUM.
Before/after full JSON snapshots can duplicate sensitive data and increase breach surface.
Fix: minimize/redact highly sensitive values in audit payloads while preserving meaningful integrity history; never log credentials/secrets.

### S8-M06 — No privacy-safe nonproduction data policy is enforced
Severity: MEDIUM-HIGH.
Fix: development/demo/test use synthetic or irreversibly de-identified fixtures; prohibit copying live claim databases/evidence into developer environments.

## Required lifecycle
Collect/receive → classify → hash/scan/quarantine → immutable original storage → review/link → authorized use → package/reference → retention/legal hold → approved export/access → disposition/destruction when legally eligible → permanent disposition audit.

## Required privacy/evidence acceptance tests
1. User from Tenant A cannot list/read/download/export/delete Tenant B evidence.
2. Upload MIME mismatch/polyglot/malware/oversize is rejected or quarantined.
3. Server hash equals stored object hash; mismatch blocks evidence readiness.
4. Original object cannot be overwritten by derivative.
5. Redacted/OCR/AI derivative points to exact original version/hash.
6. Legal hold blocks destruction.
7. Retain-until blocks premature destruction.
8. Authorized disposition leaves non-sensitive tombstone/proof.
9. Sensitive download/export creates actor/time/purpose audit.
10. Package hash changes when bound evidence changes.
11. Restore reproduces object/version/hash/metadata/access controls.
12. Privacy request cannot bypass regulatory/legal retention.
13. Demo/test environment rejects or is procedurally barred from live client datasets.
14. Backup export is encrypted and permission-controlled.
15. Vendor/AI transfer is denied unless purpose and destination are approved.

## Production release decision
Synthetic demo data: PASS.
Browser-only real claim data: HOLD.
Real original evidence uploads: HOLD.
External AI on claim evidence: HOLD.
Vendor integrations receiving P3/P4 data: HOLD until vendor/data-flow review.
Production privacy/evidence custody: HOLD until S8-C01 and high findings are remediated and tested.

## Step 8 conclusion
ADPA already has the beginnings of a strong evidence model—source, category, coverage, review state and SHA-256—but it currently tracks an evidence record, not a defensible production evidence custody chain. The production design should treat originals as immutable restricted objects, derivatives as separately traceable records, and retention/deletion as controlled lifecycle events rather than simple file operations.

STEP 8 COMPLETE.
