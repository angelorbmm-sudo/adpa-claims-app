# ADPA Tier-A Step 16 — Controlled Pilot Program

Design date: 2026-10-06
Status: COMPLETE — PILOT PROGRAM DEFINED; SYNTHETIC PILOT MAY BEGIN AFTER STAGING EXISTS; REAL-CLIENT PILOT REMAINS BLOCKED BY STEP 15 P0 GATES

## Purpose
Define a deliberately small, observable and reversible path from staging validation to limited real-world use without turning a pilot into an uncontrolled production launch.

A pilot is an experiment under production-grade controls, not permission to bypass the PRR.

## Phase 0 — current state
Allowed now:
- private development with synthetic data;
- isolated synthetic demo;
- building staging;
- synthetic test-plan preparation.

Not allowed now:
- real client PII/evidence in the current browser/localStorage workspace as a production system;
- real-client controlled pilot;
- external AI access to claim evidence;
- autonomous carrier/client communications;
- automatic settlement/release/legal conclusions.

## Phase 1 — synthetic staging pilot
Entry: Step 13 staging infrastructure provisioned and core release candidate deployed.
Users: 2–5 authorized internal testers representing licensed PA, claims staff/reviewer and technical/QA roles.
Data: synthetic/de-identified only.
Duration target: enough repeated journeys to demonstrate stability; minimum 5 business days of active testing is a planning target, not a regulatory requirement.

Synthetic claim set:
- CA water/partial payment/depreciation;
- CA fire/major contents/mortgage;
- CA disputed scope/supplement;
- closed/reopened claim;
- NV claim;
- heavy claim/large contents;
- cross-tenant isolation pair.

Required tasks:
intake -> representation/compliance -> policy -> evidence -> valuation -> contents/ALE/estimate -> communications/deadlines -> payment/depreciation/mortgage -> issues/supplements -> package -> approvals -> release/closure checks -> reopen/audit.

Phase 1 exit:
- Step 14 actual rehearsal passes;
- all Step 15 P0 blockers pass;
- no unresolved critical/high defect in pilot scope;
- restore/rollback demonstrated;
- security/tenant negative tests pass;
- mobile/UX critical journey tested;
- performance within approved pilot budgets;
- named owners sign GO.

## Phase 2 — shadow real-client pilot
This phase is NOT authorized today.
After all P0 gates pass, use a very small separately approved cohort of real claims. ADPA records/supports the workflow, but existing trusted/manual business processes remain the authoritative operational backstop during initial observation where legally/operationally appropriate.

Initial proposed cohort: 3–5 low-complexity claims, one jurisdiction at a time. California first is the proposed engineering rollout because current business operations and rule research are centered there; Nevada is a separate activation after Nevada-specific contract/rule verification. This is a pilot proposal, not authorization or a legal requirement.

Exclude initially:
- active litigation;
- SIU/fraud-sensitive matters;
- complex appraisal/counsel-controlled matters;
- catastrophic claims with unstable emergency rules;
- unusually sensitive evidence;
- claims needing untested vendor integrations;
- any claim whose policy/representation/jurisdiction is unresolved.

Phase 2 behavior:
- ADPA prepares/checks/organizes.
- Licensed PA reviews every material position.
- No autonomous external send.
- No autonomous negotiation.
- No automatic settlement/release.
- Every package/approval tied to immutable current package version.
- Daily financial/evidence/audit reconciliation during initial cohort.
- Existing manual source documents remain available for verification.

## Phase 3 — limited operational pilot
Entry only after Phase 2 produces clean evidence and explicit sign-off.
Proposed size: 10–25 claims, still one controlled jurisdiction/scope at a time.
May enable selected integrations only after each integration's own security/idempotency/authority tests pass.
Continue enhanced monitoring and manual sampling.

## Phase 4 — expansion decision
Not automatic.
Review:
- incident/defect rate;
- reconciliation;
- security/privacy;
- claim cycle time;
- user completion/errors;
- PA review quality;
- evidence integrity;
- system performance;
- backup/recovery;
- carrier/client communication accuracy;
- regulatory exceptions.
Only then decide whether to increase volume, jurisdictions, roles or integrations.

## Pilot roles
Product/business owner — approves cohort/scope and customer impact.
Licensed PA authority owner — approves regulated actions and rule applicability.
Technical owner — release/rollback/system health.
Security/privacy owner — access/evidence/privacy incidents.
Data/recovery owner — reconciliation/backups/restores.
Pilot coordinator/QA — daily checklist, defects, user observations.
Claims staff/reviewer — performs assigned nonlicensed workflow only within RBAC.

No role receives more permission merely because the pilot is small.

## Default-deny pilot feature matrix
ON after prerequisite passes:
- authenticated claim intake/read/update;
- server-backed policy/evidence metadata;
- coverage/valuation preparation;
- contents/ALE/estimate comparison;
- communications log/draft preparation;
- deadlines as reviewed operational aids;
- payment/depreciation/mortgage tracking;
- issue/supplement preparation;
- package assembly/versioning;
- Work Queue/Portfolio;
- server audit;
- human-controlled closure/reopen.

OFF until separately passed:
- autonomous AI decisions;
- automatic carrier/client email;
- automatic negotiation;
- automatic settlement/release;
- automatic legal/bad-faith conclusions;
- external AI evidence ingestion;
- production e-sign;
- replace-existing migration;
- broad client portal;
- unverified jurisdiction/rule;
- any vendor write action without idempotency/audit/authorization.

## Claim admission checklist
Before a real claim enters Phase 2/3:
- explicit pilot cohort approval;
- correct tenant/organization;
- jurisdiction confirmed and activated;
- representation/contract controls verified;
- PA license verified;
- policy obtained or claim held appropriately;
- client data/evidence permitted under approved privacy/custody process;
- backup/restore healthy;
- assigned licensed PA;
- claim not in an exclusion category;
- pilot flag/cohort ID set for enhanced monitoring.

Failure = claim remains outside pilot.

## Daily pilot control room
During the initial real-client cohort review each business day:
- authentication/authorization anomalies;
- tenant isolation alerts;
- failed saves/409 conflicts;
- application errors;
- evidence upload/hash/quarantine failures;
- financial reconciliation differences;
- stale package/approval mismatch;
- overdue critical Work Queue items;
- rule/compliance HOLDs;
- backup/monitoring health;
- user-reported confusion/data-loss concern;
- outbound actions awaiting PA/client authority.

Record reviewer, timestamp, finding, disposition and follow-up owner.

## Metrics
Safety/integrity:
- cross-tenant exposure: target 0;
- unauthorized regulated actions: target 0;
- evidence loss/hash mismatch: target 0;
- unexplained financial variance: target 0;
- wrong-package approval/signature: target 0;
- unrecoverable data loss: target 0.

Reliability:
- save/API error rate;
- p50/p95 latency;
- availability during staffed pilot;
- DB/storage/auth dependency failures;
- backup success and restore evidence.

Workflow:
- intake-to-ready time;
- Work Queue aging;
- time to PA review;
- package rework/stale rate;
- reconciliation exception rate;
- claim-stage dwell time.

UX:
- critical task completion;
- user errors/rework;
- mobile completion;
- support questions;
- accessibility defects.

AI, when eventually enabled in a later approved scope:
- finding precision/false positives;
- abstention behavior;
- citation/source correctness;
- human override rate;
- cross-claim leakage target 0;
- autonomous regulated action target 0.

Metrics establish baselines during pilot; do not invent success percentages without measured data except hard safety targets of zero.

## Immediate stop conditions
Pause affected feature and, when scope is uncertain, new pilot intake for:
- any cross-tenant disclosure/access;
- privilege/authorization bypass;
- evidence loss or unexplained hash mismatch;
- unexplained financial reconciliation difference;
- forged/wrong-package approval/signature;
- failed restore indicating data cannot be recovered as designed;
- material CA/NV rule defect affecting action;
- critical vulnerability with credible exposure;
- material audit gap for regulated action;
- repeated severe outage beyond approved tolerance;
- external message/release sent without required authority.

Preserve evidence/logs. Do not “fix forward” while continuing risky writes if integrity is uncertain.

## Incident severity
P0 Pilot Emergency: tenant/privacy exposure, unauthorized release/settlement, unrecoverable loss, evidence integrity compromise, critical auth bypass. Stop immediately; incident lead/security/PA owner engaged.
P1 Serious: financial/package/rule integrity error with potential material claim impact. Pause affected workflow/claims; investigate before resume.
P2 Operational: significant defect with safe workaround and no integrity/authority compromise. Track/fix with owner.
P3 Minor: cosmetic/usability issue without material claim effect.

## Rollback
Feature rollback: disable feature flag/integration, preserve canonical records.
Release rollback: deploy previous immutable release after compatibility check.
Data rollback: only through approved recovery/reconciliation procedure; never overwrite/merge by guess.
Claim rollback: do not erase audit history; correct through versioned/reasoned records.
Pilot rollback: stop new admissions and return affected operational process to the approved manual/backstop procedure while preserving ADPA evidence/audit for investigation.

## Defect handling
Every material pilot defect records:
ID, date/time, environment, release SHA, claim/cohort synthetic identifier, severity, reporter, reproduction, expected/actual, data/security/PA impact, logs/evidence, owner, fix commit, test evidence, approval to close.
No real client PII in GitHub issue text/screenshots unless the approved system explicitly permits and protects it; default to redacted references.

## Change control during pilot
- No unreviewed direct production edits.
- Every change tied to source commit/release.
- P0/P1 fix receives targeted regression test.
- Schema changes rehearse in staging.
- Feature flags default safest state.
- Changes affecting PA authority/compliance receive licensed review.
- Changes affecting evidence/privacy receive security/privacy review.
- Emergency rollback is preferable to risky emergency mutation.

## Exit to broader rollout
All must be true:
- no open P0/P1 incidents;
- zero known tenant/authority/evidence-integrity defects;
- money/package reconciliation clean;
- backups/restores healthy;
- performance stable at measured pilot load;
- users complete critical tasks reliably;
- mobile/accessibility critical defects resolved;
- regulatory/rule exceptions understood;
- support/incident ownership sustainable;
- open P1 engineering backlog explicitly reviewed for next volume;
- final pilot report and sign-offs complete.

Expansion occurs in bounded increments. A clean 5-claim pilot does not prove 1,000 claims/month; Step 11 load evidence still governs scale.

## Pilot report template
Release/environment:
Dates:
Cohort and inclusion/exclusion:
Users/roles:
Claims by jurisdiction/type:
Enabled/disabled features:
Incidents/defects:
Security/privacy:
Financial reconciliation:
Evidence integrity:
Package/approval integrity:
Performance/reliability:
UX/mobile/accessibility:
Regulatory exceptions:
Backup/restore:
Metrics:
Open risks:
Recommendation — expand / repeat / pause:
Sign-offs:

## Current authorization
Phase 0 private/synthetic development: GO.
Phase 1 synthetic staging pilot: GO ONCE STAGING IS PROVISIONED; currently waiting on infrastructure.
Phase 2 real-client shadow pilot: NO-GO TODAY.
Phase 3 limited operational pilot: NO-GO.
Phase 4 expansion: NO-GO.

## Step 16 conclusion
ADPA now has a controlled pilot program with bounded cohorts, default-deny features, claim admission rules, daily monitoring, hard stop conditions, incident severity, rollback/change control and measurable exit criteria. The program intentionally cannot override Step 15: real-client use remains blocked until every P0 production-readiness gate is evidenced in staging.

STEP 16 COMPLETE.
