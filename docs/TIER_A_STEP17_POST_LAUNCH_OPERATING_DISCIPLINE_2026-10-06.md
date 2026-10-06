# ADPA Tier-A Step 17 — Post-Launch Operating Discipline

Design date: 2026-10-06
Status: COMPLETE — OPERATING MODEL DEFINED; ACTIVATION FOLLOWS APPROVED PRODUCTION PILOT

## Purpose
Define how ADPA remains safe, correct, recoverable, compliant and supportable after launch. Passing a launch review is not permanent certification. Production readiness must be continuously maintained as code, laws, policies, vendors, users, data volume and threats change.

## Operating principles
1. Claim integrity and licensed authority outrank release speed.
2. Production changes are traceable to reviewed source/release artifacts.
3. No critical control silently degrades.
4. Security/privacy/evidence incidents are handled as operational incidents, not ordinary bugs.
5. Regulatory logic is versioned and provenance-backed.
6. AI remains supervised, measurable and able to abstain.
7. Backups are useful only when restores are demonstrated.
8. Metrics and incidents drive improvement; they do not justify hiding failures.
9. Production access follows least privilege and periodic review.
10. Every material action remains attributable and auditable.

## Operating cadence

### Every business day during initial pilot / high-change launch period
- Review P0/P1 alerts and incidents.
- Review auth/tenant anomalies.
- Review failed writes/409 conflicts and API errors.
- Review evidence upload/hash/quarantine failures.
- Review financial reconciliation exceptions.
- Review stale package/approval mismatches.
- Review critical/overdue Work Queue items.
- Review compliance/rule HOLDs.
- Confirm backup/monitoring jobs healthy.
- Review any outbound action awaiting PA/client authority.
- Record material findings, owner and disposition.

After stability is demonstrated, daily manual review may be reduced only where reliable automated monitoring/alerts replace it.

### Weekly
- Review error/latency/availability trends.
- Review new high/critical dependency/security findings.
- Review failed/slow DB queries and capacity.
- Review support/user confusion and mobile issues.
- Sample claim packages, money reconciliation and audit completeness.
- Review pilot/production feature flags.
- Review outstanding P0/P1 defects and due dates.
- Review external vendor failures/retries.
- Review AI evaluation samples if AI scope is enabled.

### Monthly
- Access/RBAC review for privileged/admin/licensed roles.
- Dependency/update review and controlled patch release.
- Backup success + restore-readiness evidence review.
- Privacy/evidence lifecycle exception review.
- Regulatory source-change watch and rule provenance review.
- Performance/capacity trend against growth.
- Incident/problem-management review.
- Review open accepted risks and expiration dates.
- Review vendor/subprocessor changes.
- Review audit/storage growth and retention behavior.

### Quarterly
- Perform representative restore drill or approved recovery exercise; full architecture-dependent cadence may be adjusted from measured risk.
- Tenant-isolation/security regression.
- PA authority/approval/release negative tests.
- Regulatory rule matrix re-verification for active jurisdictions.
- Accessibility/mobile regression on critical journeys.
- Performance/load regression at current/forecast scale.
- Incident-response/tabletop exercise.
- Privileged access certification.
- Evidence integrity sample/hash reconciliation.
- AI red-team/evaluation refresh if AI uses claim data.
- Review RPO/RTO and SLOs against measured results.

### Annually and on material change
- Full production-readiness re-review.
- Disaster-recovery exercise.
- Threat model/privacy/data-flow update.
- Vendor/contract/security review.
- Retention/legal-hold policy review.
- License/jurisdiction operating review.
- Business continuity review.
- Architecture and data-model review.
- Review all accepted risks for renewal or closure.

Material changes trigger review immediately rather than waiting for the calendar: new state, major vendor, new identity/storage architecture, client portal, external AI evidence access, e-signature, autonomous action, material DB/schema redesign, major regulatory change, acquisition/tenant model change, or significant incident.

## SLO/error-budget framework
Final numerical SLOs must be set from staging/pilot measurements, not invented now. Track at minimum:
- availability of authenticated claim read/write;
- API p50/p95/p99 latency;
- successful durable writes;
- evidence upload/retrieval integrity;
- auth/IdP dependency success;
- DB/storage dependency health;
- backup success and restore capability;
- queue/critical-task freshness;
- financial/package reconciliation integrity.

Hard integrity objectives remain zero tolerance for known:
- cross-tenant exposure;
- unauthorized regulated action;
- evidence hash/data loss;
- unexplained financial variance;
- wrong-package approval/signature;
- unrecoverable canonical claim loss.

If reliability/error budget is exhausted, reduce feature-release velocity and prioritize reliability until service returns within approved bounds.

## Release management
Every production release records:
- source commit;
- release/version identifier;
- dependency lock hash;
- artifact hash;
- schema migration version;
- test/security results;
- feature-flag changes;
- approver;
- deployment timestamp;
- rollback target.

Rules:
- no unreviewed direct production code edit;
- production artifact built by controlled CI/CD;
- schema change rehearsed in staging;
- backward-compatible expand/contract migrations where practical;
- P0/P1 fixes receive regression tests;
- compliance/authority changes require licensed review;
- evidence/privacy changes require security/privacy review;
- previous known-good release remains deployable where schema compatibility permits.

## Security operations
- Centralize redacted security/application logs.
- Alert on auth anomalies, repeated authorization failures, tenant-boundary failures, privileged actions, rate-limit abuse and suspicious upload behavior.
- Patch critical vulnerabilities through an expedited reviewed process.
- Rotate/revoke compromised credentials immediately.
- Never enable dev bypass to solve an outage.
- Periodically review secrets, CI identities, service accounts and third-party access.
- Maintain vulnerability intake, severity, owner, remediation target and verification evidence.
- Preserve incident evidence and timeline.

## Dependency/supply-chain operations
After Step 9 remediation:
- lock dependencies;
- controlled automated update PRs;
- dependency review/vulnerability scanning;
- immutable/hardened CI actions;
- SBOM/release manifest;
- provenance/attestation where supported;
- review major upgrades rather than auto-merge;
- emergency vulnerable-dependency rollback procedure.

## Regulatory/rule operations
For each active jurisdiction maintain:
state, rule ID, claim stage, requirement, primary citation/source, effective-from/to, applicability, exceptions, calendar method, system behavior, PA review requirement, last verified date and verifier.

Change process:
1. Detect source change from regulator/legislature or authoritative counsel/business review.
2. Assess affected claim stages and existing claims.
3. Update versioned rule; never silently rewrite historical provenance.
4. Test old/new effective dates and exceptions.
5. Licensed PA reviews operational interpretation.
6. Deploy behind controlled release/feature activation.
7. Identify claims potentially affected by change.
8. Audit the rule version used for material actions.

Uncertain applicability = REVIEW/HOLD, not automatic legal conclusion.

## Claim-quality assurance
Use risk-based sampling plus event-driven review:
- new user/role;
- new jurisdiction/rule;
- large financial variance;
- repeated package staleness;
- manual compliance override;
- reopened claim;
- unusual evidence issue;
- AI-human disagreement;
- complaint/incident;
- high-value/complex claim per approved threshold.

QA checks:
identity/jurisdiction, representation, policy, evidence links, coverage/valuation, money, deadlines, issues/supplements, package version, authority, communications, mortgage/depreciation, closure and audit.
Record defects by type/severity/root cause; feed recurring defects into product/training/rules/tests.

## AI operations
AI is a controlled subsystem, not the legal/licensed authority.
Before any expanded AI scope:
- approved data boundary/vendor;
- prompt-injection/cross-claim tests;
- source/citation requirements;
- deterministic authority gates outside model;
- human approval for material action;
- abstention path;
- model/version logging;
- evaluation set using synthetic/de-identified claims where possible.

Ongoing metrics:
- false-positive/false-negative samples;
- source/citation correctness;
- abstention quality;
- human override;
- drift by model/version;
- cross-claim leakage target 0;
- unauthorized autonomous action target 0.

A model/provider change is a material production change requiring evaluation before rollout.

## Evidence/privacy operations
- Original evidence immutable/versioned according to approved design.
- Derivatives linked to originals.
- Access/download events logged appropriately.
- Retention/legal hold/disposition enforced by server policy.
- Deletion/disposition is authorized and auditable.
- Periodic object-to-DB manifest/hash reconciliation.
- Quarantined files never become Ready silently.
- Privacy requests follow documented identity/scope/legal-hold checks.
- Logs/analytics minimize PII.
- New vendors do not receive restricted evidence until reviewed/approved.

## Backup and disaster recovery
- Monitor every backup/PITR job.
- Protect backup credentials from ordinary app writes where feasible.
- Restore drills verify claim count, tenant ownership, money, package hashes, approvals, evidence object/hash/version and audit history.
- Measure actual RPO/RTO.
- Repeat after material architecture/storage changes and on approved periodic cadence.
- Failed restore is a production-readiness incident, not paperwork.

## Incident response
Severity model follows Step 16:
P0 Emergency — tenant/privacy exposure, unauthorized release/settlement, unrecoverable loss, critical auth bypass, evidence-integrity compromise.
P1 Serious — material financial/package/rule integrity error.
P2 Operational — significant but contained defect with safe workaround.
P3 Minor — no material claim impact.

Lifecycle:
detect -> contain -> preserve evidence -> assess claim/client/regulatory impact -> recover -> reconcile -> approve resume -> communicate as required -> root-cause analysis -> corrective actions/tests -> close with evidence.

Never erase audit history to make an incident disappear.

## Problem management
Repeated incidents or recurring defects create a root-cause problem record. Track:
symptom, affected claims/releases, contributing conditions, root cause, permanent corrective action, regression test, owner and verification.
Do not rely indefinitely on manual workarounds for P0/P1 classes.

## Access lifecycle
Joiner:
approved role/org, minimum permissions, MFA/identity controls, training.
Mover:
re-evaluate role/org/license authority immediately.
Leaver:
disable/revoke promptly, rotate shared credentials if any, preserve audit attribution.
Periodic:
review privileged/admin/licensed users, dormant accounts, service identities, vendor access and active licenses.

## User training/support
Maintain role-based quick guides for:
- intake;
- evidence/contents;
- licensed PA review;
- financial/recovery;
- package/approval/closure;
- admin/incident tasks.

Train users on:
save/conflict behavior, HOLD/BLOCKED meanings, evidence handling, no-PII-in-unsafe-channels rule, escalation, reporting suspected security/privacy issue, and when AI must not be trusted without review.

User confusion that repeatedly causes material mistakes is treated as a product defect, not merely a training failure.

## Capacity management
Track:
active/historical claims, contents/evidence volume, audit growth, object-storage growth, DB size/query latency, connection saturation, API payload/latency and concurrent users.
Re-run Step 11 load/spike tests before forecast demand approaches tested capacity. Catastrophe surge planning is separate from average monthly volume.

## Vendor/integration operations
For identity, hosting, DB/storage, email, e-sign, AI and future HomeBack integrations:
- named owner;
- data classification shared;
- permissions/scopes;
- secrets/rotation;
- SLA/status/incident contact;
- retry/idempotency behavior;
- auditability;
- outage/degraded mode;
- termination/export process;
- security/privacy review.

Vendor outage must not silently bypass ADPA authority controls.

## Documentation discipline
Keep current:
architecture diagram, data flow, threat model, schema/migrations, API contracts, rule registry, runbooks, DR plan, incident plan, release history, vendor inventory, data classification/retention, pilot/PRR evidence and known-risk register.
Material documentation changes are reviewed with the related system change.

## Governance dashboard
Production leadership should be able to see:
- open P0/P1 incidents;
- security vulnerabilities;
- backup/restore status;
- availability/latency;
- financial/evidence integrity exceptions;
- compliance HOLDs;
- stale packages;
- overdue critical tasks;
- dependency age/risk;
- rule last-verified dates;
- AI quality/override metrics when enabled;
- capacity trend;
- open accepted risks and expiry.

## Accepted-risk discipline
A risk exception requires:
specific risk, scope, reason, compensating controls, owner, approval, expiration/review date and exit plan.
Critical integrity/tenant/authority failures cannot be normalized as permanent accepted operating behavior.

## Post-launch expansion gates
Before adding:
New state — verified rules/license/contract/calendar + tests + PA sign-off.
Client portal — privacy/auth/UX/accessibility/security review.
E-sign — signer identity/authority/package binding/idempotency/audit.
Outbound email — approval, recipient verification, idempotency/retry/audit.
External AI evidence — vendor/privacy/security/prompt-injection/data-boundary review.
Autonomous action — separate governance decision; no assumption that successful drafting authorizes negotiation/settlement/release.
HomeBack integration — API/data ownership/tenant/consent/audit and failure-mode review.

## Annual Tier-A renewal
At least annually, and after major incident/material architecture change, re-run a condensed Tier-A review:
1 product/workflow;
2 regulatory;
3 architecture/data;
4 code health;
5 automated tests;
6 security;
7 privacy/evidence;
8 supply chain;
9 DR;
10 performance;
11 UX/accessibility;
12 production operations.
Publish GO/CONDITIONAL/NO-GO with evidence and remediation owners.

## Current activation status
Operating model/documentation: PASS / COMPLETE.
Production monitoring cadence: DEFINED, not active.
Production release management: DEFINED, not active.
Regulatory change management: DEFINED, partially manual until production registry/monitoring exists.
AI operations: DEFINED; external evidence AI remains off.
DR cadence: DEFINED; cannot activate until staging/production infrastructure exists.
Post-launch governance: READY TO ACTIVATE after approved pilot.

## Step 17 conclusion
ADPA now has a full lifecycle operating model: build safely, launch only after evidence, pilot in bounded stages, then continuously maintain security, regulatory correctness, claim integrity, evidence custody, recoverability, AI supervision, performance and user quality. Tier-A is therefore treated as an operating discipline rather than a one-time launch certificate.

STEP 17 COMPLETE.
