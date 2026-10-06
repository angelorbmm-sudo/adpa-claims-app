# P0-03 — PostgreSQL/API Authoritative System of Record

Date: 2026-10-06
Status: CODE PATH COMPLETE; STAGING INTEGRATION PROOF PENDING

## Objective
When VITE_API_BASE_URL is configured, ADPA must treat the authenticated API/PostgreSQL backend as claim authority. Browser localStorage may remain only as a local cache/draft aid and must not silently become the authoritative fallback after a server failure.

## Implemented
- App detects configured API mode.
- On startup in API mode, claim portfolio is loaded from authenticated /api/claims and replaces the browser claim list.
- API portfolio response includes each claim's server version.
- Frontend hydrates server versions for optimistic concurrency.
- New claims are written to the server before being admitted to the active workspace.
- Explicit claim saves are written to the server first.
- Failed server saves do not update the authoritative in-memory claim state; UI reports that the server remains authoritative.
- If initial server loading fails, cached browser data is identified as read-only/non-authoritative rather than silently promoted.
- Existing localStorage persistence remains as a compatibility/cache layer and for non-API demo/development mode.
- Existing migration/preflight workflow remains the explicit path for moving a browser workspace into PostgreSQL.

## Safety boundary
This remediation deliberately does NOT automatically upload an existing localStorage workspace. Migration still requires preflight and explicit confirmed import. This avoids silently overwriting server claims.

## Known follow-on
Some component callbacks use the existing saveClaim/updateClaimById pattern. P0-03 establishes the authoritative persistence boundary for explicit saves and claim creation, but full multi-user production validation must be performed in staging. updateClaimById-driven background edits require integration testing before live production.

## Staging acceptance tests
1. Empty browser + populated DB loads DB claims.
2. Stale browser cache cannot overwrite DB on startup.
3. New claim appears only after successful API write.
4. Failed API write does not become canonical browser state.
5. Two sessions editing same claim produce expected-version conflict instead of lost update.
6. Refresh after save reproduces exact server state.
7. Existing browser workspace imports only through explicit migration flow.
8. API outage displays non-authoritative/read-only warning.
9. Reconnection/reload restores server state.
10. Tenant A cannot retrieve/save Tenant B claims.

## Decision
Repository code remediation: PASS.
PostgreSQL/API architecture boundary: PASS.
Production-like runtime proof: NOT TESTED because staging infrastructure is not yet provisioned.
Real-client production: HOLD until staging tests pass.

P0-03 CODE REMEDIATION COMPLETE.
