# ADPA Backend Foundation

This repository now includes a production-oriented backend foundation for ADPA Claims. It is intentionally provider-neutral so the application can be deployed to a cloud provider without coupling the claim model to one vendor.

## What is implemented

- Express API server
- PostgreSQL schema and migration runner
- Organization / tenant model
- Users and organization memberships
- Roles: admin, licensed_pa, claims_staff, reviewer, read_only
- Permission middleware
- JWT/JWKS authentication integration point
- Development-only auth bypass guard
- Claim persistence using structured JSON plus indexed claim columns
- Optimistic claim version field
- Immutable-style audit event records for claim creates/updates
- Claim audit-history endpoint
- Browser localStorage import endpoint
- Private object-storage abstraction and explicit disabled state until a provider is configured
- Health endpoint
- Environment-variable configuration
- CORS restriction
- Request validation with Zod

## Local development

1. Copy .env.example to .env.
2. Provision PostgreSQL and set DATABASE_URL.
3. Run npm install.
4. Run npm run db:migrate.
5. Create an organization, user, and organization_members record.
6. For local development only, set AUTH_DEV_BYPASS=true and configure AUTH_DEV_USER_ID.
7. Run npm run dev:server for the API and npm run dev for the frontend.

The development bypass is rejected when NODE_ENV=production.

## Production deployment checklist

Before any real client data is placed in ADPA:

- Provision managed PostgreSQL with encryption at rest, TLS, automated backups, point-in-time recovery, and restricted network access.
- Configure a production identity provider and set AUTH_ISSUER, AUTH_AUDIENCE, and AUTH_JWKS_URL.
- Keep AUTH_DEV_BYPASS=false.
- Provision private object storage for policy documents, photos, videos, estimates, receipts, and other evidence.
- Implement the selected storage adapter with short-lived signed upload/download URLs.
- Enable malware scanning, file-type validation, retention rules, and access logging.
- Place all secrets in the cloud provider's secret manager, never in GitHub.
- Configure HTTPS and the final ADPA domain.
- Restrict APP_ORIGIN to the production frontend origin.
- Add rate limiting, request IDs, structured logs, monitoring, and alerting.
- Add database migration automation to CI/CD.
- Test restore-from-backup procedures.
- Perform role/permission tests for every endpoint.
- Complete a security review before storing regulated client information.
- Add server-side OpenAI integration only after secrets, logging, source-citation controls, and authorization are in place.
- Add DocuSign/email integrations only after outbound-release authority gates are connected to the server-side audit trail.

## Data migration

The current browser build uses localStorage key:

adpa-claims-workspace-v1

The backend exposes POST /api/migration/workspace for an authenticated user with claims:write permission. It imports up to 500 structured claims at a time and records a migration_imports audit record.

Do not delete the user's browser data until:
1. the import succeeds,
2. claim counts match,
3. sample claims are compared field-by-field,
4. server backups are confirmed.

## Important boundary

This backend foundation is code-complete for architecture and handoff, but it is not the same as a deployed production system. Cloud infrastructure, database credentials, identity provider, object storage, backups, monitoring, and final security validation must still be provisioned and tested.


## 2026-10-06 compliance/claims-control expansion

The browser workspace now includes California/Nevada compliance, representation/cancellation controls, state carrier deadline clocks, evidence standards, issue/negotiation files, seven-bucket routing, critical-event/EUO/appraisal/counsel routing, litigation-ready chronology, recoverable depreciation tracking, stale-package invalidation, and portfolio reporting.

Backend foundations added:
- indexed claim jurisdiction;
- user_licenses table for jurisdiction-specific PA license verification;
- claims:negotiate / claims:release / compliance:override permissions;
- requireVerifiedPALicenseForClaim middleware;
- POST /api/claims/:id/release-check server-side readiness gate.

Important: these controls are foundations. The browser app still uses localStorage by default and the production identity/database/storage/email/e-sign environment is not deployed. Material outbound actions must remain disabled until server persistence, license verification data, immutable audit logging, private object storage, role enforcement, and delivery integrations are production-configured and tested.


## Closure and production-transition controls added 2026-10-06
- canonical browser reconciliation helper for coverage/payment/depreciation/mortgage closure checks;
- Claim Closure & Final Audit Center with reasoned reopen and exportable audit record;
- Final Financial Reconciliation Center with duplicate/unallocated/unreceived payment exceptions;
- migration preflight endpoint and explicit confirm/mode on import;
- existing records default to skip rather than silent overwrite;
- migration import/replacement audit events;
- optimistic concurrency on claim saves using expected version (HTTP 409 on stale write);
- server-side PA-license release check and closure check;
- automatic private-repository demo deployment disabled; demo deployment is manual only;
- CI now builds the frontend and syntax-checks critical backend files.

See docs/PRODUCTION_DATA_CUTOVER.md before any live client-data migration.
