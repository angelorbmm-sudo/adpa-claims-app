# ADPA Carrier Adjuster Collaboration Portal — Developer Handoff v1.0
Date: 2026-10-17
Status: SPECIFICATION ONLY — NOT DEPLOYED

## Objective
Invite carrier adjusters to collaborate on individually authorized ADPA claims. Reuse ADPA claim_id, Evidence Locker, estimates, mitigation, contents, payments and chronology. Do not build insurer-wide claims management in this phase.

## Roles and security
ADPA licensed PA publishes selected artifacts; carrier adjuster sees only explicitly published versions and authorized claim; supervisor requires separate ADPA-approved invitation. Default deny, organization/claim/object-level authorization, MFA, 7-day invite expiry, immediate revocation, audit of reads/downloads/messages. Internal strategy, attorney materials and unpublished evidence remain inaccessible. Signed file URLs short-lived, malware scan uploads, encryption, rate limits.

## MVP screens
Assigned claims; Claim Overview; Shared Evidence; Estimates & Differences; Mitigation; Contents; Requests & Messages; Payments (read-only); Activity Timeline. Responsive and keyboard accessible.

## Workflow
ADPA invite -> verify email/MFA -> accept claim-scoped grant -> ADPA publish artifact snapshot with SHA256 and version -> carrier view/request/upload/respond -> ADPA review -> audit. Requests: open/acknowledged/in_review/fulfilled/declined/withdrawn. Settlement proposal is not payment or acceptance.

## Suggested entities
carrier_organizations, carrier_memberships, claim_external_access, shared_artifacts, carrier_requests, carrier_messages, external_uploads, audit_events. Every resource keyed to claim_id and organization authorization.

## Suggested endpoints
POST /api/carrier/invitations; POST /api/carrier/invitations/{token}/accept; GET /api/carrier/claims; GET /api/carrier/claims/{claimId}/overview; GET /api/carrier/claims/{claimId}/artifacts; POST /api/claims/{claimId}/disclosures; GET/POST /api/carrier/claims/{claimId}/requests; GET/POST /api/carrier/claims/{claimId}/threads; POST /api/carrier/claims/{claimId}/uploads; POST /api/claims/{claimId}/external-access/{id}/revoke; GET /api/claims/{claimId}/external-audit.

## AI boundary
Susie summarizes only carrier-visible evidence with citations. No automatic claim approval/denial, coverage ruling, settlement commitment, or private disclosure. PA approval required.

## Acceptance gates
Cross-tenant/IDOR tests; revocation; invitation replay prevention; artifact visibility matrix; upload quarantine; audit event attribution; accurate estimate version labels; mobile/a11y; end-to-end staging tests using synthetic claims. Licensed PA and privacy/security signoff before pilot.

## Phases
0 repository audit and reuse; 1 invitations/RBAC/audit; 2 evidence/messages/requests; 3 read-only comparisons and ledger; 4 security tests and controlled pilot.

## Founder defaults pending confirmation
7-day invitation expiry; 30-day renewable claim grant; carrier supervisors invited only by ADPA; downloads of explicitly published files permitted with audit; settlement proposals permitted but not accepted automatically.

See downloadable DOCX/PDF in ChatGPT handoff for expanded detailed specification.