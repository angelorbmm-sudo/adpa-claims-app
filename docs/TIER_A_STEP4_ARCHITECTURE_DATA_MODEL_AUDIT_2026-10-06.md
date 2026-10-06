# ADPA Tier-A Step 4 — Architecture & Data Model Integrity Audit

Audit date: 2026-10-06
Status: COMPLETE — PASS WITH ARCHITECTURE REMEDIATION BACKLOG

Scope: frontend state/persistence, API boundary, PostgreSQL schema, tenant/auth model, claim versioning, audit, evidence storage abstraction, migration, package integrity, money/closure reconciliation and module-to-module consistency.

## Architecture observed
Current working UI is a React/Vite single-page application. Browser localStorage key adpa-claims-workspace-v1 remains the active UI persistence layer. A separate Express/PostgreSQL production foundation exists with JWT/JWKS authentication, organization membership, role permissions, PA-license checks, optimistic claim versioning, audit events and migration endpoints. Private object storage is intentionally disabled/unimplemented.

The backend stores selected claim fields relationally and the complete claim as data_json. This hybrid model is useful for transition but requires strict canonicalization so relational columns and JSON cannot disagree.

## Controls that passed
- Organization ID scopes normal claim reads/writes.
- Role permissions separate read/write/approve/negotiate/release capabilities.
- Production authentication requires configured issuer/audience/JWKS; development bypass is non-production only.
- Jurisdiction-specific PA-license middleware exists for regulated release/closure checks.
- Optimistic version checking exists on normal claim PUT.
- Claim create/update writes before/after audit data.
- Browser-to-backend migration has preflight, explicit confirmation, skip/replace modes and transaction wrapping.
- Claim packages have snapshot hashes and staleness behavior.
- Closure/release endpoints re-read server claim state rather than trusting a browser “ready” flag.
- Evidence schema anticipates SHA-256, object key, storage status, source and metadata.
- Closed workflow and package history are not designed as destructive overwrite operations.

## Findings

### S4-C01 — Claim ID is globally unique across all organizations
Severity: CRITICAL architecture issue before multi-tenant production.
The claims table primary key is id alone, while organization_id is a separate column. If two organizations use the same client-generated claim ID, the second tenant's INSERT ... ON CONFLICT(id) can conflict with a row belonging to another tenant. Because the conflict update is keyed by global id rather than tenant+id, this is an unsafe multi-tenant key design.
Remediation: use a server-generated global UUID primary key plus tenant-local/external claim identifier, or enforce a composite organization_id + claim key and make every FK/query consistent. Add cross-tenant collision tests.

### S4-H01 — Authentication assumes one membership
Severity: HIGH.
resolveMembership uses LIMIT 1. A user belonging to more than one organization has no explicit active-organization selection and may receive an arbitrary/implicit membership.
Remediation: tenant context must be explicit and authorized per request/session; test user membership in multiple organizations.

### S4-H02 — Audit organization is carried in metadata, not the audit_events organization_id column
Severity: HIGH.
writeAuditEvent inserts actor/claim/action/etc. but does not populate organization_id. Normal claim update/release/closure audit records therefore leave the indexed organization_id column null even when metadata contains organizationId.
Remediation: require organizationId in writeAuditEvent and persist it in the dedicated column. Make organization_id NOT NULL where appropriate and test tenant audit retrieval.

### S4-H03 — Browser and server are two competing systems of record
Severity: HIGH / known boundary.
The ordinary UI saves to localStorage. The backend has authoritative permissions/versioning/audit, but those controls are not in the normal save path.
Remediation: after staging gates, move normal reads/writes to server APIs and make local state a cache/draft only. Define offline behavior explicitly.

### S4-H04 — Hybrid relational/JSON claim representation can drift
Severity: HIGH.
insured/carrier/date/jurisdiction/etc. are duplicated in relational columns and data_json. Current write routes update both together, but future migrations/admin jobs can create divergence.
Remediation: define canonical source and validation invariant; database/service tests must reject or detect drift. Consider deriving query projections from canonical JSON or normalizing high-value fields.

### S4-H05 — Migration replacement bypasses expected-version concurrency
Severity: HIGH.
Normal PUT supports _expectedVersion. replace_existing migration deliberately increments version but does not require the imported record to prove it was based on the current server version.
Remediation: production replacement requires an expected server version or explicit privileged conflict-resolution workflow with before/after review.

### S4-H06 — Evidence integrity model is metadata-only until storage adapter exists
Severity: HIGH / known boundary.
claim_documents has object_key and sha256, but createUploadIntent is not implemented. There is no production object authorization, malware scanning, content-type enforcement, immutable original, retention or restore path yet.
Remediation: implement private object-storage architecture and bind document row, immutable object version and hash.

### S4-H07 — Package snapshot does not fully bind source evidence/context
Severity: HIGH, inherited from Step 2.
Package manifest omits evidence SHA-256/provenance/review fields and snapshot omits material claim context such as date of loss/cause of loss and valuation provenance.
Remediation: version a canonical package schema and hash all material context/evidence references.

### S4-H08 — Financial/closure logic is duplicated between frontend and backend
Severity: HIGH.
claimReconciliation.js and server closure-check independently implement money/depreciation/mortgage/open-item logic. Divergence already exists elsewhere in the UI.
Remediation: establish one versioned domain-rule specification with shared fixtures/contract tests; server result is authoritative for production release/closure.

### S4-M01 — Monetary values are generic JS numbers / unconstrained JSON
Severity: MEDIUM-HIGH.
Financial fields are primarily Number values in JSON with no integer-cents or decimal schema invariant.
Remediation: choose integer cents or fixed-precision decimal at API/domain boundaries; define rounding rules and invariant tests for totals.

### S4-M02 — Browser IDs are timestamp + Math.random
Severity: MEDIUM.
uid() is acceptable for a prototype but not the preferred durable distributed identifier.
Remediation: use crypto.randomUUID/server UUIDs and preserve imported legacy IDs as external identifiers.

### S4-M03 — claim_documents organization and claim relationship lacks a database tenant-consistency constraint
Severity: MEDIUM-HIGH.
A document has claim_id and organization_id, but the FK only proves claim_id exists; the database itself does not prove the document organization equals the claim organization.
Remediation: enforce tenant-consistent composite FK/design after the claim-key correction.

### S4-M04 — Audit rows use free-form claim_id without FK
Severity: MEDIUM / possibly intentional for retention.
This can preserve audit history after deletion, but the retention model is undocumented.
Remediation: explicitly choose immutable retained audit vs FK behavior; record tenant and immutable claim reference.

### S4-M05 — Date/time semantics need a domain policy
Severity: MEDIUM.
date_of_loss is date; audit timestamps are timestamptz; browser operational due dates are YYYY-MM-DD and comparisons use local/constructed times.
Remediation: define claim-local timezone, calendar-date vs instant types, DST behavior, jurisdiction calendar and serialization rules.

### S4-M06 — Full-claim passthrough validation is permissive
Severity: MEDIUM.
Zod ClaimPayload validates a small top-level subset then passthrough accepts the remainder of the claim graph.
Remediation: version and validate the complete production claim schema, including arrays/status enums/money/date/reference objects.

### S4-M07 — No database-level lifecycle/status constraints for most nested records
Severity: MEDIUM.
Because most modules live in JSON, status spelling/terminal-state rules are application conventions.
Remediation: canonical enums/schema version + migration strategy + contract tests.

### S4-M08 — API token is kept in sessionStorage
Severity: MEDIUM / design review required.
This is better scoped than localStorage but remains script-accessible. Final identity architecture should select a threat-model-driven browser session approach.
Remediation: review against chosen IdP and CSRF/XSS model; do not finalize authentication storage by convenience.

## Canonical data ownership recommendation
1. PostgreSQL/API becomes production claim authority.
2. Private object store becomes original evidence authority; DB stores immutable object identity/hash/metadata.
3. Server domain services become authority for compliance, financial reconciliation, release and closure.
4. Frontend becomes presentation/draft/cache; it cannot independently declare a regulated gate final.
5. Audit store is append-only and tenant-bound.
6. Claim package is an immutable versioned projection of canonical server state and immutable evidence references.

## Architecture acceptance tests required
- Two tenants can use identical external claim numbers/legacy IDs without collision or disclosure.
- Tenant A can never read/write/replace/document-link/audit Tenant B data.
- Multi-org user must explicitly select an authorized organization.
- Stale expectedVersion receives 409 for normal and replacement workflows.
- Relational projections always match canonical claim payload.
- Money arithmetic is exact under documented rounding rules.
- Evidence object hash mismatch fails verification.
- Package hash changes when any material evidence/context changes.
- Release/closure UI cannot override a server HOLD.
- Backup/restore preserves claims, versions, documents, hashes and audit chain.
- All timestamps/due dates survive timezone/DST boundary tests.
- Schema-version migration is forward-tested on old claim fixtures.

## Step 4 conclusion
ADPA has a sound prototype-to-production separation and several strong safety foundations, but the data architecture is not ready for multi-tenant production until the global claim-key issue, tenant-bound audit, canonical system-of-record transition and duplicated domain logic are corrected. These are architecture remediations, not reasons to discard the application.

STEP 4 COMPLETE.
