# P0-01 Tenant-Safe Claim Identity Remediation

Date: 2026-10-06
Status: CODE COMPLETE; STAGING DATABASE EXECUTION/PROOF PENDING STEP 13 INFRASTRUCTURE

## Problem
The original database declared claims.id as a global primary key. ADPA is multi-tenant, so two organizations using the same legacy/browser claim ID could collide. Application reads were mostly organization-scoped, but INSERT ... ON CONFLICT (id) could target a row belonging to another organization.

## Remediation implemented
- Fresh databases now use PRIMARY KEY (organization_id, id).
- Existing databases have an explicit migration: server/migrations/001_tenant_safe_claim_identity.sql.
- Claim PUT upsert uses ON CONFLICT (organization_id, id).
- Workspace migration upsert uses ON CONFLICT (organization_id, id).
- claim_documents now reference the composite organization/claim key, preventing a document from pointing across tenant boundaries.
- Audit retrieval now filters both claim_id and organization_id.
- Shared audit writer now stores organization_id in the audit_events column rather than only metadata.
- Claim create/update, release-check and closure-check pass the authenticated organization into audit writes.
- Composite indexes were added for document and audit tenant/claim lookups.

## Compatibility
Legacy claim.id values are preserved. Frontend URLs and claim JSON do not need to change. The same id may now safely exist in separate organizations after the database migration.

## Deployment order
Because application upserts now target the composite key, staging/production deployment must apply migration 001 before deploying this application revision to an existing database.

## Required staging proof
P0-01 is not production-PASS until staging exists and demonstrates:
1. Migration applies successfully to a copy/synthetic legacy schema.
2. Existing claims/documents remain attached to the correct organization.
3. Org A and Org B can both create the same legacy claim id.
4. Updating Org A's duplicate id does not change Org B.
5. Migration skip/replace affects only the authenticated organization.
6. Org A cannot read Org B's claim audit events for the same id.
7. Cross-organization document/claim FK insertion fails.
8. Rollback/restore procedure is proven before production cutover.

## Current decision
Repository/code remediation: PASS.
Static tenant scoping review: PASS.
Runtime PostgreSQL migration proof: NOT TESTED (no staging database currently provisioned).
Production release: HOLD until staging proof above passes.

This closes the code portion of Step 15 P0-01 without pretending that an unexecuted database migration has been proven in production-like infrastructure.
