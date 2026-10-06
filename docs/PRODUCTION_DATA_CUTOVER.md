# ADPA Production Data Cutover Runbook

Status: preparation complete; production cutover NOT authorized until infrastructure gates below are satisfied.

## Safety rule
The current browser/localStorage workspace remains the working source until the production backend is deployed, authenticated, backed up, tested, and explicitly approved for live client data. Never move client data into the public demo repository.

## Required infrastructure gates
- Managed PostgreSQL with encryption in transit/at rest, restricted network access, automated backups and point-in-time recovery.
- Production identity provider/JWT validation; development bypass disabled.
- Organization membership and role enforcement.
- Jurisdiction-specific PA license verification data for regulated actions.
- Private object storage for original evidence, signed URLs, malware/type validation, retention and access logs.
- Immutable/append-only audit strategy and legal-hold/retention policy.
- HTTPS, restricted CORS origin, secrets manager, rate limiting, request IDs, centralized logs/alerts.
- Restore test and security review.
- Server-side release and closure checks enabled.
- Controlled outbound email/e-sign integrations remain separate from data migration.

## Cutover sequence
1. Freeze production schema/migrations and run them against staging.
2. Create a complete browser workspace backup and store only in an approved encrypted location.
3. Run local readiness checks.
4. Run POST /api/migration/preflight. Resolve missing identifiers/jurisdiction and review existing-ID collisions.
5. Import into staging with mode=skip_existing first. Never silently overwrite.
6. Reconcile staging counts and per-claim SHA/field checks against the browser backup.
7. Test role boundaries: claims staff cannot release/close; licensed PA controls work only in verified jurisdiction; read-only cannot mutate.
8. Test optimistic concurrency: stale version save must return HTTP 409.
9. Test package staleness, release check, closure check, reopen flow and audit events.
10. Test backup restore.
11. Obtain production infrastructure/security approval.
12. Schedule cutover window. Export a fresh browser backup immediately before migration.
13. Run production preflight.
14. Import with skip_existing. Any replacement requires explicit reviewed replace_existing mode and audit evidence.
15. Reconcile claim count, money totals, package hashes, document manifests and audit records.
16. Switch frontend API configuration only after reconciliation passes.
17. Preserve the pre-cutover backup according to retention/security policy; do not delete it merely because migration succeeded.
18. Monitor errors/audit events and keep rollback plan available.

## Rollback
If reconciliation, authentication, authorization, document access or audit integrity fails: stop writes, return frontend to the last approved mode, preserve both datasets, identify the divergence, and reconcile before retrying. Do not merge records by guesswork.

## Production acceptance tests
- Create/read/update claim within organization only.
- Cross-organization access denied.
- Stale concurrent update returns 409.
- CA claim cannot use NV-only license and vice versa.
- Release check requires verified PA license and current approved package.
- Closure check catches payment mismatch, depreciation, lender-held funds, open issues/critical events, stale package and missing approvals.
- Migration preflight is non-destructive.
- Default migration skips existing records.
- Replacement migration records before/after audit evidence.
- Original evidence is private and recoverable after restore.
- Browser/demo never contains production secrets.
