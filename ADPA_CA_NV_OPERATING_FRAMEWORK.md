# ADPA California + Nevada Digital Public Adjusting Operating Framework

Last primary-source review: 2026-10-06

## Operating principle
ADPA is an evidence-driven claims operating system. AI may organize records, identify gaps, compare positions, calculate variances, draft correspondence, and recommend next workflow steps. AI must not independently make a licensed public-adjuster judgment, compromise a claim, give legal advice, or release a substantive position without the applicable authority gates.

Release pattern:
AI prepares -> state/compliance rules check -> evidence/policy support check -> licensed PA review -> client authorization when required -> controlled delivery -> immutable audit record.

## Source hierarchy
1. Controlling statutes, regulations, regulator orders, and official regulator guidance.
2. The insured's actual policy, endorsements, declarations, and claim-specific carrier correspondence.
3. Professional standards, estimating documentation, manufacturer information, building-code material, expert reports, invoices, market pricing, and authoritative technical sources.
4. Training, podcasts, videos, forums, and community discussions for practice insight only. They never override tiers 1-3.

## California
Primary operational authorities include California Insurance Code public-adjuster provisions (Division 5, Chapter 2), the approved public-adjuster contract/disclosure process, and 10 CCR §2695.1 et seq. Fair Claims Settlement Practices Regulations.

ADPA controls:
- Verify California jurisdiction and applicable PA license before regulated work.
- Preserve the approved contract and separate pre-contract disclosure sequence.
- Track cancellation status and disaster-specific rules.
- Link coverage/valuation positions to actual policy language.
- Track claim communications, proof-of-claim decisions, continuing-investigation notices, accepted payments, and other applicable clocks with authority/evidence.
- Do not turn a missed operational clock into an automatic bad-faith conclusion.
- Apply disaster/emergency orders only when the loss/event and effective dates qualify.
- Keep rules effective-date aware.

Primary regulator:
https://www.insurance.ca.gov/
Fair Claims Settlement Practices:
https://www.insurance.ca.gov/01-consumers/130-laws-regs-hearings/05-CCR/fair-claims-regs.cfm

## Nevada
Primary operational authorities include NRS Chapter 684A, NAC Chapter 684A, NRS/NAC Chapter 686A claim-practice provisions, and Nevada Division of Insurance guidance.

ADPA controls:
- Verify Nevada jurisdiction and applicable PA license.
- Public adjuster acts solely for insured's financial interests.
- Preserve claim investigation/adjustment records for the applicable retention period; NRS 684A.180 states at least three years after claim closure.
- Enforce the no-legal-advice boundary in NRS 684A.165.
- Track acknowledgment, pertinent communications, investigation, proof-of-loss decision, continuing notice, accepted-payment, and undisputed-payment workflows under current NAC rules.
- Calculate working-day clocks with a verified holiday calendar before production reliance.

Primary regulator:
https://doi.nv.gov/
NRS 684A:
https://www.leg.state.nv.us/NRS/NRS-684A.html
NAC 686A:
https://www.leg.state.nv.us/NAC/NAC-686A.html

## Claim lifecycle
1. Intake and jurisdiction.
2. License/authority and representation packet.
3. Policy/declarations/endorsements collection.
4. Duties after loss and evidence preservation.
5. Coverage and causation issue identification.
6. Inspection, measurements, photographs/video, expert/technical evidence.
7. Dwelling/other structures scope and estimate.
8. Contents inventory, ownership, age/condition, LKQ, RCV/ACV/depreciation.
9. ALE baseline, incremental expense, habitability and duration evidence.
10. Mitigation/emergency services.
11. Code/ordinance trigger, policy sublimit, code/permit support.
12. Proof of loss and carrier information requests.
13. Estimate reconciliation and issue files.
14. Payments, undisputed amounts, mortgage/loss draft, depreciation.
15. Supplements/disputes and evidence cure.
16. Negotiation and staged escalation.
17. Appraisal/regulator/counsel review when appropriate.
18. Settlement/client authority/release.
19. Replacement/recovery.
20. Closure, audit package, and retention.

## Evidence standard
Every material position should answer:
- What exactly is the issue?
- What does the carrier say?
- What does ADPA say?
- What policy provision controls?
- What evidence supports ADPA's position?
- What evidence is missing?
- What is the dollar effect?
- What state rule/deadline is relevant?
- What is the next action?
- Who approved the position?

Dwelling evidence: pre/post-loss media, measurements, plans, estimate lines, material specifications, contractor/vendor quotes, invoices, permits/code support, mitigation records, moisture data, engineering/technical reports where necessary.

Contents evidence: photographs/video, receipts, bank/card records where appropriate and permissioned, model/serial information, age/condition, retailer/manufacturer replacement sources, LKQ support, quantity, depreciation basis.

ALE evidence: pre-loss baseline, temporary housing, utilities, food differential, storage, pets, transportation, leases, receipts, habitability evidence, repair/rebuild timeline.

## Negotiation playbook
1. Separate coverage, causation, scope, quantity, quality/LKQ, price, depreciation, code, evidence, and payment issues.
2. Ask for the specific basis of disagreement.
3. Cure missing evidence before escalating tone.
4. Use line-item/document-specific rebuttals.
5. Request reconsideration/revised estimate.
6. Request supervisor review with a concise issue ledger.
7. Escalate to formal dispute/supplement when supported.
8. Consider regulator/appraisal/counsel only under the applicable policy, law, facts, and licensed/legal review.
9. Preserve every position, response, promise, deadline, payment, and source in chronology.

## Communication discipline
Pre-deadline reminders state the recorded deadline and request timely completion; they do not accuse the carrier in advance. After a verified deadline passes, record the factual late status and request the response/reason. Preserve sent message ID, recipients, exact content, attachments, delivery evidence, trigger date, governing authority, calculated/verified due date, and actual response date.

## AI abstention triggers
AI must hold/abstain when:
- jurisdiction or license authority is unresolved;
- representation/required disclosure status is unresolved;
- policy language necessary for the position is missing;
- evidence is materially insufficient or contradictory;
- a position needs licensed PA judgment;
- the request would constitute legal advice;
- appraisal, EUO, litigation, statute/suit limitation, coverage denial/ROR, fraud/SIU, or counsel-controlled subject requires escalation;
- the system cannot verify the governing rule/effective date;
- a material settlement/compromise/client authority decision is involved.

## Production safeguards still required
- Server-side authentication/authorization and tenant isolation.
- Managed PostgreSQL, encryption/TLS, backup/PITR and restore tests.
- Private object storage, malware scanning, signed access, retention controls.
- Server-side OpenAI use only after source-citation, logging, confidence/abstention and evaluation controls.
- Controlled email/e-sign delivery with approval gates and provider event IDs.
- State/federal holiday calendars and effective-dated rule engine.
- Attorney/compliance review before production reliance on automated legal/regulatory calculations.
- Audit logs that are append-only/tamper-evident at the server layer.
