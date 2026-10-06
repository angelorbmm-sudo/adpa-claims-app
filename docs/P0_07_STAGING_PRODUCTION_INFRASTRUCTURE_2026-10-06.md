# P0-07 — Staging and Production Infrastructure

Date: 2026-10-06
Status: REPOSITORY INFRASTRUCTURE READINESS COMPLETE; CLOUD PROVISIONING REQUIRES JOSÉ/OWNER ACCOUNTS

## Code completed
- Added PostgreSQL readiness probe with latency.
- Added /live process liveness endpoint.
- Added /ready dependency readiness endpoint.
- /health now fails with 503 when PostgreSQL is unavailable instead of always reporting ok.
- Added controlled DB pool connection and idle timeouts.
- Added graceful SIGTERM/SIGINT HTTP drain and PostgreSQL pool shutdown.
- Production startup now fails closed unless DATABASE_SSL=true.
- Production startup now fails closed unless APP_ORIGIN uses HTTPS.
- Production startup now fails closed unless private storage provider + bucket are configured.
- Existing production startup already rejects dev auth bypass and requires OIDC issuer/audience/JWKS.

## Required topology
Staging and production must be separate environments. Staging uses synthetic/deidentified data only and must match production architecture class.

Web: adpa.claims (production); separate staging hostname.
API: api.adpa.claims or reviewed same-origin /api; separate staging API.
Data: separate managed PostgreSQL databases with TLS, backups/PITR and least-privilege credentials.
Evidence: separate private object-storage buckets/containers with public access blocked.
Identity: production-grade OIDC/JWT; staging config isolated from production.
Secrets: provider secret manager, never GitHub/browser/source.
Operations: centralized logs/metrics/alerts, DNS/TLS, rate limiting/WAF as appropriate, backup/restore and rollback.

## José provisioning handoff
1. Choose/confirm cloud provider and region based on ADPA requirements and operational familiarity.
2. Create isolated staging project/account and production project/account.
3. Provision managed PostgreSQL for staging with TLS + automated backup/PITR.
4. Provision private versioned staging evidence storage; block all public access.
5. Configure staging IdP/OIDC and MFA policy; no dev bypass.
6. Put DB/IdP/storage credentials in secret manager.
7. Deploy API with /live and /ready probes.
8. Deploy web app with HTTPS and exact staging origin.
9. Add centralized logs/metrics/alerts.
10. Configure short-lived CI deployment credentials and protected environment.
11. Repeat reviewed infrastructure pattern for production only after staging gates pass.
12. Configure adpa.claims DNS/TLS only when production release is approved; domain ownership remains with Angelo/ADPA.

## Hard boundaries
No real client data in staging.
No production secret in GitHub.
No public evidence bucket.
No direct public PostgreSQL exposure.
No dev authentication bypass in production.
No real-client production launch until all P0 gates, restore drill, Step 14 rehearsal and PRR #2 pass.

## Acceptance tests
- HTTPS/TLS only.
- /live proves process; /ready fails when DB is unavailable.
- production refuses insecure DB SSL/origin/storage/auth configuration.
- DB inaccessible from unrestricted internet and app credential is least privilege.
- storage public access fails.
- IdP issuer/audience/expiry/RBAC/tenant tests pass.
- staging and production secrets/data are isolated.
- logs/alerts fire on synthetic failures without leaking secrets/PII.
- DB backup/PITR restore succeeds.
- evidence backup/version/hash recovery succeeds.
- previous app release can be rolled back without claim loss.
- deployment artifact maps to exact Git commit/dependency lock.
- staging migration rehearsal passes before production.

## Decision
Repository production-readiness controls: PASS.
Infrastructure blueprint/handoff: PASS.
Actual staging cloud: NOT PROVISIONED.
Actual production cloud: NOT PROVISIONED.
DNS/TLS production cutover: NOT AUTHORIZED.
Production P0-07: HOLD until José provisions and the acceptance tests pass.

P0-07 APPLICATION/REPOSITORY WORK COMPLETE. The remaining work is real infrastructure provisioning and verification; it cannot truthfully be simulated by repository code.
