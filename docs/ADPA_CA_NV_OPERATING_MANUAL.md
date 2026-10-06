# ADPA California + Nevada Public Adjusting Operating Manual — Core Rules

**Verification date:** 2026-10-06  
**Purpose:** Product/compliance requirements for ADPA. This is an operational manual, not legal advice. Primary law/regulator material controls over this summary. Re-verify rules when law, regulations, emergency orders, or policy language changes.

## 1. Operating architecture
Every claim follows: **STATE → LICENSE → REPRESENTATION → POLICY → COVERAGE → EVIDENCE → SCOPE → VALUATION → PAYMENT → NEGOTIATION → APPROVAL → AUDIT**.

Every substantive outbound position follows: **AI prepares → rules engine checks → licensed PA reviews → client authorization when required → controlled delivery → audit log**.

AI must abstain when policy language, evidence, authority, jurisdiction, or licensed approval is insufficient.

## 2. California public-adjuster engagement
Primary regulator: California Department of Insurance (CDI).

- Cal. Ins. Code §15027 requires a written public-adjuster contract on a form approved by the Commissioner, executed in duplicate before acting as a public insurance adjuster. One original is retained by the licensee and one provided to the insured.
- §15027(v) requires a separate printed disclosure before contract signing.
- The approved contract must state the fee/compensation and base and requires the insured's initials next to the fee provision.
- Ordinary cancellation: three business days after signing and receiving the signed contract. A qualifying catastrophic-disaster property loss has a five-calendar-day cancellation right. The Notice of Cancellation must be included as required by §15027.
- §15027(w): no later than three business days after the cancellation period expires, notify the insurer, its adjuster, or attorney of the written PA contract.
- §15027.5: compensation cannot exceed the contract amount/percentage; claim-related compensation from another source must be disclosed to the insured and conflicts can create rescission risk.
- Solicitation: §15027(d)-(e) restricts solicitation during the loss-producing occurrence and between 6 p.m. and 8 a.m. absent insured request. §15027.1 imposes an additional seven-calendar-day restriction for residential properties in catastrophic-disaster areas, subject to the insured-initiated-contact exception.

**ADPA rule:** approved contract/disclosure text is a versioned read-only legal template. AI may populate approved fields but must not rewrite required language.

Primary sources:
- https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/public-adjuster/App-Procedures-BE-Non-Res.cfm
- https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/upload/Public_Insurance_Adjuster_Contract.pdf
- https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/upload/DISCLOSURE.pdf
- https://www.insurance.ca.gov/0400-news/0100-press-releases/archives/upload/Public-Adjuster-Notice.pdf

## 3. California carrier claim-handling clocks
10 CCR §2695 et seq. is the Fair Claims Settlement Practices framework. Operational clocks encoded initially:
- §2695.5(e)(1): claim acknowledgment — 15 calendar days, subject to rule/exceptions.
- §2695.5(e)(2): necessary forms/instructions/assistance — 15 calendar days.
- §2695.5(e)(3): begin investigation — immediately, no later than 15 calendar days.
- §2695.5(b): complete response to pertinent claimant communication reasonably suggesting a response is expected — immediately, no later than 15 calendar days.
- §2695.7(b): accept or deny after proof of claim — immediately, no later than 40 calendar days, subject to the regulation.
- §2695.7(c)(1): when more investigation time is required, written notice and continuing 30-calendar-day notices, subject to the regulation.
- §2695.7(h): accepted claim payment generally within 30 calendar days, subject to exceptions.
- §2695.7(d): thorough, fair, objective investigation; do not seek information not reasonably required.
- §2695.7(b)(1): first-party denial must be written and state the policy provision/law basis as required.
- §2695.9: additional first-party residential/commercial property standards, including replacement-cost repair/replacement rules.

Primary source:
- https://www.insurance.ca.gov/01-consumers/130-laws-regs-hearings/05-CCR/fair-claims-regs.cfm

## 4. California disaster mode
ADPA must use a separate disaster flag and effective-date-aware rules. The CDI 2026 major-disaster guide should be a maintained source, not copied into static assumptions. Examples include special ALE, replacement-cost, policy-copy, contents, rebuilding, and emergency-law provisions. Rules must be tied to loss date, policy date/renewal date, declaration/event, and effective date.

Primary source:
- https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/upload/2026-Guide-for-Adjusting-Property-Claims-in-California-After-a-Major-Disaster_Final.pdf

## 5. Nevada public-adjuster controls
Primary authority: NRS Chapter 684A.
- NRS 684A.030: public adjuster is employed by and represents solely the financial interests of the insured named in the policy.
- NRS 684A.040: applicable adjuster license required.
- NRS 684A.165: honest/fair communications; prompt, knowledgeable, courteous, fair and objective treatment; no legal advice; no direct dealing with a represented policyholder/claimant without counsel consent; privacy/information-security compliance; identify adjuster/employer.
- NRS 684A.180: retain transaction records, investigations/adjustments, and compensation information; records retained at least three years after claim closure.
- NRS 684A.210 prohibits compensated representation of both insurer and insured in the same transaction.

Primary source:
- https://www.leg.state.nv.us/NRS/NRS-684A.html

## 6. Nevada carrier claim-handling controls
NRS 686A.310 identifies unfair claim practices including policy/fact misrepresentation, unreasonable communication delay, inadequate investigation standards, unreasonable coverage delay after proof of loss, failure to effectuate prompt/fair/equitable settlements when liability is reasonably clear, failure to reasonably explain a denial/offer, discouraging counsel, and misleading about limitations.

NAC Chapter 686A provides operational timing detail. Initial clocks include:
- NAC 686A.665: acknowledgment and pertinent claimant communications — generally 20 working days.
- NAC 686A.670: procedures to begin investigation within 20 working days.
- NAC 686A.675: first-party proof-of-loss decision/additional-time/payment rules, including 30-working-day notice periods and payment of accepted/undisputed amounts under applicable provisions.

Primary sources:
- https://www.leg.state.nv.us/NRS/NRS-686A.html
- https://www.leg.state.nv.us/NAC/NAC-686A.html

## 7. Evidence standard
Every material position should answer:
1. What exactly is disputed?
2. What policy language governs?
3. What physical/documentary evidence proves the fact?
4. What quantity/quality/price/valuation support proves the dollar amount?
5. What evidence is missing?
6. What did the carrier say, and what is the source?
7. What is ADPA's requested action?
8. Does a licensed PA approve the position?

Evidence metadata: source, date, coverage, issue, reviewer, status, and stable reference/hash where possible. Preserve originals; do not overwrite evidence.

## 8. Negotiation protocol
Use an issue-by-issue reconciliation, not generic demands:
1. Reconcile facts, policy, scope, quantities, quality, price, depreciation, code, and payments.
2. Ask the carrier for the specific basis and source supporting a disputed adjustment.
3. Supply the missing proof and concise line-item rebuttal.
4. Request reconsideration/revised estimate/payment of undisputed amounts.
5. Escalate to supervisor with a clean issue/dollar/evidence summary.
6. Consider DOI/appraisal/counsel only when appropriate after licensed review.

ADPA must never fabricate authority, overstate evidence, threaten unsupported bad-faith claims, or present AI output as a legal conclusion.

## 9. Litigation-ready chronology
Preserve sent/received timestamps, message/document IDs, exact submitted version, governing clock, calculated and verified due dates, reminders, actual responses, promises, payments, inspections, estimates, issue changes, approvals, and release events. A chronology is factual evidence; ADPA does not automatically label conduct "bad faith."

## 10. Production hardening still required
Before production reliance: authoritative holiday calendars; effective-from/effective-through rule versioning; emergency-order ingestion; state-by-state license validation; immutable server-side audit log; private object storage; retention/legal-hold controls; source-page citations; role enforcement; secure outbound email/e-sign integration; security review; benchmark tests; attorney review for legal-advice boundaries.
