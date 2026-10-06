-- ADPA P0-01: tenant-safe claim identity
-- Apply in staging before deploying application code that uses ON CONFLICT (organization_id,id).
-- This migration preserves legacy/browser claim IDs and scopes their uniqueness to the organization.

BEGIN;

LOCK TABLE claims IN ACCESS EXCLUSIVE MODE;
LOCK TABLE claim_documents IN ACCESS EXCLUSIVE MODE;

ALTER TABLE claim_documents
  DROP CONSTRAINT IF EXISTS claim_documents_claim_id_fkey;

ALTER TABLE claims
  DROP CONSTRAINT IF EXISTS claims_pkey;

ALTER TABLE claims
  ADD CONSTRAINT claims_pkey PRIMARY KEY (organization_id, id);

ALTER TABLE claim_documents
  ADD CONSTRAINT claim_documents_org_claim_fkey
  FOREIGN KEY (organization_id, claim_id)
  REFERENCES claims(organization_id, id)
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_claim_documents_org_claim
  ON claim_documents(organization_id, claim_id);

CREATE INDEX IF NOT EXISTS idx_audit_org_claim
  ON audit_events(organization_id, claim_id, created_at DESC);

COMMIT;
