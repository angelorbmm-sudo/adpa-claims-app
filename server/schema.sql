CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE,
  display_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_members (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin','licensed_pa','claims_staff','reviewer','read_only')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jurisdiction text NOT NULL,
  license_type text NOT NULL DEFAULT 'public_adjuster',
  license_number text,
  status text NOT NULL DEFAULT 'unverified',
  expires_on date,
  verified_at timestamptz,
  verification_source text,
  UNIQUE(user_id, jurisdiction, license_type)
);

CREATE INDEX IF NOT EXISTS idx_user_licenses_user_state ON user_licenses(user_id, jurisdiction);

CREATE TABLE IF NOT EXISTS claims (
  id text PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  insured text,
  property text,
  carrier text,
  claim_number text,
  date_of_loss date,
  cause_of_loss text,
  jurisdiction text,
  representation_status text,
  mortgage_servicer text,
  valuation text,
  valuation_source text,
  valuation_reviewer text,
  notes text,
  data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  created_by text REFERENCES users(id),
  updated_by text REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_claims_org ON claims(organization_id);
CREATE INDEX IF NOT EXISTS idx_claims_updated ON claims(updated_at DESC);

CREATE TABLE IF NOT EXISTS claim_documents (
  id text PRIMARY KEY,
  claim_id text NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category text,
  coverage_tag text,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  sha256 text,
  object_key text,
  storage_status text NOT NULL DEFAULT 'pending',
  review_status text NOT NULL DEFAULT 'Unreviewed',
  source text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by text REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_claim_documents_claim ON claim_documents(claim_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id bigserial PRIMARY KEY,
  organization_id uuid,
  actor_user_id text,
  claim_id text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  before_json jsonb,
  after_json jsonb,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_claim ON audit_events(claim_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_events(organization_id, created_at DESC);

CREATE TABLE IF NOT EXISTS migration_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_user_id text REFERENCES users(id),
  source text NOT NULL,
  claim_count integer NOT NULL DEFAULT 0,
  imported_at timestamptz NOT NULL DEFAULT now(),
  details_json jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE claims ADD COLUMN IF NOT EXISTS jurisdiction text;
CREATE INDEX IF NOT EXISTS idx_claims_jurisdiction ON claims(organization_id, jurisdiction);
